import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ReceiptType} from '../../models/receiptType';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class ReceiptTypeService {

    private collection: AngularFirestoreCollection<ReceiptType>;
    private obj: Observable<ReceiptType[]>;

    constructor(
        private db: AngularFirestore,
    ) {
        // this.collection = db.collection<ReceiptType>('receiptType');
    }

    getCollection(colonyId: string) {
        return this.collection = this.db.collection<ReceiptType>('/colony/' + colonyId + '/receiptType');
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

    get(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc<ReceiptType>(id).valueChanges();
    }

    update(obj: ReceiptType, id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }

    add(obj: ReceiptType, colonyId: string) {
        return this.getCollection(colonyId).add(obj);
    }

    remove(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).delete();
    }

    getByName(colonyId: string, name: string) {
        return this.db.collection<ReceiptType>('/colony/' + colonyId + '/receiptType').ref.where('name', '==', name).get();
    }

}
