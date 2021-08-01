import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Resident} from '../../models/resident';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class ResidentService {

    public colonyId: string;
    private collection: AngularFirestoreCollection<Resident>;
    private obj: Observable<Resident[]>;

    constructor(
        private db: AngularFirestore,
    ) {

    }

    getCollection(colonyId: string, houseId: string) {
        return this.collection = this.db.collection<Resident>
        ('/colony/' + colonyId + '/house/' + houseId + '/resident', ref => ref.orderBy('createdAt', 'desc'));
    }

    getAll(colonyId: string, houseId: string) {
        return this.obj = this.getCollection(colonyId, houseId).snapshotChanges().pipe(map(
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

    add(obj: Resident, colonyId: string, houseId: string) {
        return this.getCollection(colonyId, houseId).add(obj);
    }

    remove(id: string, colonyId: string, houseId: string) {
        return this.getCollection(colonyId, houseId).doc(id).delete();
    }

    get(residentId: string, colonyId: string, houseId: string) {
        return this.getCollection(colonyId, houseId).doc<Resident>(residentId).valueChanges();
    }

    update(id: string, obj: Resident, colonyId: string, houseId: string) {
        return this.getCollection(colonyId, houseId).doc(id).update(obj);
    }

    getByUserId(id: string, colonyId: string, houseId: string) {
        return this.getCollection(colonyId, houseId).ref.where('userId', '==', id);
    }
}
