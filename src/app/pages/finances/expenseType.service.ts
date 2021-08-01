import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ExpenseType} from '../../models/expenseType';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class ExpenseTypeService {

    private collection: AngularFirestoreCollection<ExpenseType>;
    private obj: Observable<ExpenseType[]>;

    constructor(
        private db: AngularFirestore,
    ) {
        // this.collection = db.collection<ExpenseType>('expenseType');
    }

    getCollection(colonyId: string) {
        return this.collection = this.db.collection<ExpenseType>('/colony/' + colonyId + '/expenseType');
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
        return this.getCollection(colonyId).doc<ExpenseType>(id).valueChanges();
    }

    update(obj: ExpenseType, id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }

    add(obj: ExpenseType, colonyId: string) {
        return this.getCollection(colonyId).add(obj);
    }

    remove(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).delete();
    }

    getByName(colonyId: string, name: string) {
        return this.db.collection<ExpenseType>('/colony/' + colonyId + '/expenseType').ref.where('name', '==', name).get();
    }

}
