import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Colony} from '../../models/colony';
import {HouseService} from '../resident/house.service';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class ColonyService {

    private collection: AngularFirestoreCollection<Colony>;
    private obj: Observable<Colony[]>;

    constructor(
        private db: AngularFirestore,
        private houseService: HouseService,
    ) {
        this.collection = db.collection<Colony>('colony', ref => ref.orderBy('createdAt', 'desc'));
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
        return this.collection.doc<Colony>(id).valueChanges();
    }

    update(obj: Colony, id: string) {
        return this.collection.doc(id).update(obj);
    }

    add(obj: Colony) {
        return this.collection.add(obj);
    }

    remove(id: string) {
        return this.collection.doc(id).delete();
    }

    getHouses(id: string) {
        const houses = [];
        return new Promise<any>((resolve, reject) => this.houseService.getAll(id).subscribe(h => {
                if (h.length > 0) {
                    resolve(h);
                }
            }, e => reject(e)));
    }
}
