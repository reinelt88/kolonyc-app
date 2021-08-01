import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Access} from '../../models/access';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AccessService {

    public colonyId = null;
    private collection: AngularFirestoreCollection<Access>;
    private obj: Observable<Access[]>;

    constructor(
        private db: AngularFirestore,
    ) {
    }

    getCollection(colonyId: string) {
        return this.collection = this.db.collection<Access>('/colony/' + colonyId + '/access', ref => ref.orderBy('createdAt', 'desc'));
    }

    getAll(colonyId: string) {
        return this.obj = this.getCollection(colonyId).snapshotChanges().pipe(map(
            actions => actions.map(
                    a => {

                        const data = a.payload.doc.data();

                        const id = a.payload.doc.id;

                        return {id, ...data};
                    }
                )
            )
        );
    }

    getAllByResidentId(colonyId: string, residentId: string) {
        return this.obj = this.db.collection<Access>('/colony/' + colonyId + '/access',
            ref => ref.where('residentId', '==', residentId).orderBy('createdAt', 'desc')).snapshotChanges().pipe(map(
                actions => actions.map(
                        a => {

                            const data = a.payload.doc.data();

                            const id = a.payload.doc.id;

                            return {id, ...data};
                        }
                    )
                )
            );
    }

    add(obj: Access, colonyId: string) {
        return this.getCollection(colonyId).add(obj);
    }

    remove(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).delete();
    }

    get(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc<Access>(id).valueChanges();
    }

    update(id: string, obj: Access, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }
}
