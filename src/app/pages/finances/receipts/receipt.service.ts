import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Receipt} from '../../../models/receipt';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class ReceiptService {

    public colonyId = null;
    private collection: AngularFirestoreCollection<Receipt>;
    private obj: Observable<Receipt[]>;

    constructor(
        private db: AngularFirestore,
    ) {
    }

    getCollection(colonyId: string) {
        return this.collection = this.db.collection<Receipt>('/colony/' + colonyId + '/receipt', ref => ref.orderBy('createdAt', 'desc'));
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

    add(obj: Receipt, colonyId: string) {
        return this.getCollection(colonyId).add(obj);
    }

    remove(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).delete();
    }

    get(receiptId: string, colonyId: string) {
        return this.getCollection(colonyId).doc<Receipt>(receiptId).valueChanges();
    }

    update(id: string, obj: Receipt, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }
}
