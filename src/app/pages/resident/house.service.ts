import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {House} from '../../models/house';
import {AdminService} from '../users/user-details/admin.service';
import {Admin} from '../../models/admin';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class HouseService {

    public colonyId: string;
    private collection: AngularFirestoreCollection<House>;
    private obj: Observable<House[]>;

    constructor(
        private db: AngularFirestore,
        private adminService: AdminService
    ) {

    }

    getCollection(colonyId: string) {
        return this.collection = this.db.collection<House>('/colony/' + colonyId + '/house', ref => ref.orderBy('place', 'asc'));
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

    add(obj: House, colonyId: string) {
        return this.getCollection(colonyId).add(obj);
    }

    remove(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).delete();
    }

    get(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc<House>(id).valueChanges();
    }

    update(id: string, obj: House, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }

    getByPlaceAndNumber(colonyId: string, place: string, num: string) {
        return new Promise<any>((resolve, reject) => this.db.collection('/colony/' + colonyId + '/house')
          .ref.where('place', '==', place).where('number', '==', num).get().then(res => {
                res.docs.forEach(d => {
                    const model: any = d.data();
                    model.id = d.id;
                    resolve(model);
                });

                resolve(null);
            }));
    }

    getByAllByPlace(colonyId: string, place: string) {
        const list: any[] = [];
        return new Promise<any>((resolve, reject) => this.db.collection<House>('/colony/' + colonyId + '/house')
          .ref.where('place', '==', place).get().then(res => {
                res.docs.forEach(d => {
                    const model = d.data();
                    model.id = d.id;
                    list.push(model);
                });
                resolve(list);
            }));
    }

    getAdminByUid(colonyId: string, userId: string) {
        return new Promise<any>((resolve, reject) => this.getAll(colonyId).subscribe(houses => {
            this.adminService.getByUserId(userId, colonyId).get().then(result => {
                if (result.docs.length > 0) {
                    result.forEach(doc => {
                        const data = doc.data();
                        const admin: Admin = {
                            id: doc.id,
                            userId: data.userId,
                            createdAt: data.createdAt
                        };
                        resolve(admin);
                    });
                }
            }, e => reject(e));
        }));
    }

}
