import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MarketplaceCategory} from '../../models/marketplaceCategory';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class MarketplaceCategoryService {

    private collection: AngularFirestoreCollection<MarketplaceCategory>;
    private obj: Observable<MarketplaceCategory[]>;

    constructor(
        private db: AngularFirestore,
    ) {
        this.collection = db.collection<MarketplaceCategory>('marketplaceCategory', ref => ref.orderBy('createdAt', 'desc'));
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
        return this.collection.doc<MarketplaceCategory>(id).valueChanges();
    }

    update(obj: MarketplaceCategory, id: string) {
        return this.collection.doc(id).update(obj);
    }

    add(obj: MarketplaceCategory) {
        return this.collection.add(obj);
    }

    remove(id: string) {
        return this.collection.doc(id).delete();
    }

}
