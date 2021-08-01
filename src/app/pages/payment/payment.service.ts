import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Payment} from '../../models/payment';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    public colonyId = null;
    public qty = 0;
    private collection: AngularFirestoreCollection<Payment>;
    private obj: Observable<Payment[]>;


    constructor(
        private db: AngularFirestore,
    ) {
    }

    getCollection(colonyId: string) {
        return this.collection = this.db.collection<Payment>('/colony/' + colonyId + '/payment', ref => ref.orderBy('createdAt', 'desc'));
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

    getAllByHouseId(colonyId: string, houseId: string) {
        return this.db.collection<Payment>('/colony/' + colonyId + '/payment')
            .ref.where('houseId', '==', houseId)
            .orderBy('createdAt', 'desc').get();
    }

    getByHouseAndMonthAndYear(colonyId: string, houseId: string, month: number, year: number) {
        return this.db.collection<Payment>('/colony/' + colonyId + '/payment')
            .ref.where('houseId', '==', houseId)
            .where('year', '==', year)
            .where('month', '==', month).get();
    }

    getByHouseAndMonthAndYearApproved(colonyId: string, houseId: string, month: number, year: number) {
        return this.db.collection<Payment>('/colony/' + colonyId + '/payment')
            .ref.where('houseId', '==', houseId)
            .where('year', '==', year)
            .where('month', '==', month)
            .where('status', '==', 'Aprobado').get();
    }

    getByHouseAndMonthAndYearApprovedQty(colonyId: string, houseId: string, month: number, year: number) {
        return new Promise<any>((resolve, reject) => {
            return this.db.collection<Payment>('/colony/' + colonyId + '/payment')
                .ref.where('houseId', '==', houseId)
                .where('year', '==', year)
                .where('month', '==', month)
                .where('status', '==', 'Aprobado').get().then(result => {
                    resolve(result.size);
                });
        });
    }

    add(obj: Payment, colonyId: string) {
        return this.getCollection(colonyId).add(obj);
    }

    remove(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).delete();
    }

    get(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc<Payment>(id).valueChanges();
    }

    update(id: string, obj: Payment, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }
}
