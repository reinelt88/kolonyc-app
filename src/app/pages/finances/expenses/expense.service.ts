import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Expense} from '../../../models/expense';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {

    public colonyId = null;
    private collection: AngularFirestoreCollection<Expense>;
    private obj: Observable<Expense[]>;

    constructor(
        private db: AngularFirestore,
    ) {
    }

    getCollection(colonyId: string) {
        return this.collection = this.db.collection<Expense>('/colony/' + colonyId + '/expense', ref => ref.orderBy('createdAt', 'desc'));
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

    add(obj: Expense, colonyId: string) {
        return this.getCollection(colonyId).add(obj);
    }

    remove(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).delete();
    }

    get(expenseId: string, colonyId: string) {
        return this.getCollection(colonyId).doc<Expense>(expenseId).valueChanges();
    }

    update(id: string, obj: Expense, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }
}
