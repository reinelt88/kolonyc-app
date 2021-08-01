import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Product} from '../../models/product';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    public tableData: any[] = [];
    public colonyId = null;
    private collection: AngularFirestoreCollection<Product>;
    private obj: Observable<Product[]>;



    constructor(
        private db: AngularFirestore,
    ) {
    }

    getCollection(colonyId: string) {
        return this.collection = this.db.collection<Product>('/colony/' + colonyId + '/product', ref => ref.orderBy('createdAt', 'desc'));
    }


    getPaginatedResults(colonyId: string, docId: string) {

        if (docId != null) {

        } else {
            this.collection = this.db.collection<Product>('/colony/' + colonyId + '/product',
                ref => ref.orderBy('createdAt', 'desc').limit(2)
            );
        }

        return this.obj = this.collection.snapshotChanges().pipe(map(
            actions => actions.map(
                    a => {

                        console.log(a.payload.doc);
                        const data = a.payload.doc.data();

                        const id = a.payload.doc.id;

                        return {id, ...data};
                    }
                )
            )
        );

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

    add(obj: Product, colonyId: string) {
        return this.getCollection(colonyId).add(obj);
    }

    remove(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).delete();
    }

    get(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc<Product>(id).valueChanges();
    }

    update(id: string, obj: Product, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }
}
