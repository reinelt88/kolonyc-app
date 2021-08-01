import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Admin} from '../../../models/admin';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    public colonyId: string;
    private collection: AngularFirestoreCollection<Admin>;
    private obj: Observable<Admin[]>;

    constructor(
        private db: AngularFirestore,
    ) {

    }

    getCollection(colonyId: string) {
        return this.collection = this.db.collection<Admin>('/colony/' + colonyId + '/admin', ref => ref.orderBy('createdAt', 'desc'));
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

    add(obj: Admin, colonyId: string) {
        return this.getCollection(colonyId).add(obj);
    }

    remove(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).delete();
    }

    get(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc<Admin>(id).valueChanges();
    }

    update(id: string, obj: Admin, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }

    getByUserId(id: string, colonyId: string) {
        return this.getCollection(colonyId).ref.where('userId', '==', id);
    }

}
