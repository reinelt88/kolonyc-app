import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {House} from '../../models/house';
import {Resident} from '../../models/resident';
import {ResidentService} from './resident.service';
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
    private resident: Observable<Resident[]>;

    constructor(
        private db: AngularFirestore,
        private residentService: ResidentService,
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

    getResident(colonyId: string, residentId: string) {
        return this.recursiveSearch(colonyId, residentId, 'resident');
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
        return new Promise<any>((resolve, reject) => this.db.collection<House>
        ('/colony/' + colonyId + '/house').ref.where('place', '==', place).get().then(res => {
                res.docs.forEach(d => {
                    const model = d.data();
                    model.id = d.id;
                    list.push(model);
                });
                resolve(list);
            }));
    }

    getHouseByResident(colonyId: string, residentId: string) {
        return this.recursiveSearch(colonyId, residentId, 'house');
    }

    getResidentByUid(colonyId: string, userId: string) {
        return new Promise<any>((resolve, reject) => this.getAll(colonyId).subscribe(houses => {
                houses.forEach(h => {
                    this.residentService.getByUserId(userId, colonyId, h.id).get().then(result => {
                        if (result.docs.length > 0) {
                            result.forEach(doc => {
                                const data = doc.data();
                                const resident: Resident = {
                                    id: doc.id,
                                    userId: data.userId,
                                    createdAt: data.createdAt
                                };
                                resolve (resident);
                            });
                        }
                    }, e => reject(e));
                }, error => reject(error));
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

    public getResidentsByHouse(colonyId: string, houseId: string) {
      return new Promise<any>((resolve, reject) => this.getAll(colonyId).subscribe(houses => {
        houses.forEach(h => {
          if (h.id === houseId) {
            this.residentService.getAll(colonyId, h.id).subscribe(resident => {
              resolve(resident);
            }, e => reject(e));
          }
        }, error => reject(error));
      }));
    }

    private recursiveSearch(colonyId: string, residentId: string, type) {
        return new Promise<any>((resolve, reject) => this.getAll(colonyId).subscribe(houses => {
                houses.forEach(h => {
                    this.residentService.get(residentId, colonyId, h.id).subscribe(resident => {
                        if (resident) {
                            return (type === 'resident') ? resolve(resident) : resolve(h);
                        }
                    }, e => reject(e));
                }, error => reject(error));
            }));
    }


}
