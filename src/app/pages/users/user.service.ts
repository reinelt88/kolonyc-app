import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../../models/user';
import {StorageService} from '../../sharedServices/storage.service';
import {Events} from '../../sharedServices/events.service';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private collection: AngularFirestoreCollection<User>;
    private obj: Observable<User[]>;

    constructor(
        private db: AngularFirestore,
        private events: Events,
        private storageService: StorageService
    ) {
        this.collection = db.collection<User>('user', ref => ref.orderBy('createdAt', 'desc'));
    }

    getAll() {

        return this.obj = this.collection.snapshotChanges().pipe(map(
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

    get(id: string) {
        return this.collection.doc<User>(id).valueChanges();
    }

    getByUid(id: string) {
        return new Promise<any>((resolve, reject) => this.db.collection('user').ref.where('uid', '==', id).get().then(res => {
                res.docs.forEach(d => {
                    const model: any = d.data();
                    model.id = d.id;
                    resolve(model);
                });
            }));
    }

    getByColonyAndRole(colonyId: string, role: string) {
        return this.db.collection<User>('user')
            .ref.where('role', '==', role)
            .where('colonyId', '==', colonyId)
            .get();
    }

    getResidentsByHouse(houseId: string) {
      return this.db.collection<User>('user')
        .ref.where('role', '==', 'RESIDENT')
        .where('houseId', '==', houseId)
        .get();
    }

    async getByResidentAndAdminByColony(colonyId: string) {
        const residents = this.db.collection<User>('user')
            .ref.where('role', '==', 'RESIDENT')
            .where('colonyId', '==', colonyId)
            .get();
        const admins = this.db.collection<User>('user')
            .ref.where('role', '==', 'ADMIN')
            .where('colonyId', '==', colonyId)
            .get();

        const [residentsQuerySnapshot, adminsQuerySnapshot] = await Promise.all([
            residents,
            admins
        ]);

        const residentsArray = residentsQuerySnapshot.docs;
        const adminsArray = adminsQuerySnapshot.docs;

        return residentsArray.concat(adminsArray);
    }

    getByEmailAndColony(colonyId: string, email: string) {
        return this.db.collection<User>('user').ref.where('email', '==', email).where('colonyId', '==', colonyId).get();
    }

    update(obj: User, id: string) {
        return this.collection.doc(id).update(obj);
    }

    add(obj: User) {
        return this.collection.add(obj);
    }

    remove(id: string) {
        return this.collection.doc(id).delete();
    }

    updateStorageAndEvents(user: User) {
        this.storageService.setObject('user', user);
        this.events.publish('userChange', user);
    }

}
