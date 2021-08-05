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
    public limit = 8;
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


    getPaginatedResults(colonyId: string, docId: Product, category: any, userId: any) {
        return new Promise<any>((resolve, reject) => {
            const path = '/colony/' + colonyId + '/product';
            if (docId != null) {
                this.getSnapshot(docId.id, colonyId).subscribe(product => {
                    if (product) {
                        if (category !== null) {
                            const query =  this.db.collection<Product>(path)
                                .ref.where('categoryId', '==', category.id)
                                .startAfter(product)
                                .limit(this.limit);

                            query.get().then(res => {
                                resolve(this.processArray(res, userId));
                            });
                        } else {
                            const query =  this.db.collection<Product>(path)
                                .ref.orderBy('createdAt', 'desc')
                                .startAfter(product)
                                .limit(this.limit);

                            query.get().then(res => {
                                resolve(this.processArray(res, userId));
                            });
                        }

                    }
                });

            } else {
                if (category !== null) {
                    const query = this.db.collection<Product>(path)
                        .ref.where('categoryId', '==', category.id)
                        .limit(this.limit);

                    query.get().then(res => {
                        resolve(this.processArray(res, userId));
                    });
                } else {
                    const query = this.db.collection<Product>(path)
                        .ref.orderBy('createdAt', 'desc')
                        .limit(this.limit);

                    query.get().then(res => {
                        resolve(this.processArray(res, userId));
                    });
                }
            }
        });
    }

    processArray(res: any, userId: string) {
        if (res.docs.length > 0) {
            const arrProducts = [];
            res.docs.forEach(r => {
                const p: any = r.data();
                p.id = r.id;
                if (userId != null) {
                    if (userId === p.userId) {
                        arrProducts.push(p);
                    }
                } else {
                    if (p.publicationStatus === 'activo') {
                        arrProducts.push(p);
                    }
                }

            });
            return arrProducts;
        }
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

    getAllActived(colonyId: string) {
        return this.obj = this.getCollection(colonyId).snapshotChanges().pipe(map(
            actions => actions.map(
                    a => {

                        const data = a.payload.doc.data();

                        if (data.publicationStatus === 'activo') {
                            const id = a.payload.doc.id;

                            return {id, ...data};
                        }

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

    getSnapshot(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc<Product>(id).get();
    }

    getPromise(id: string, colonyId: string) {
        return new Promise<any>((resolve, reject) => {
            return this.getCollection(colonyId).doc<Product>(id).ref.get().then(result => {
                resolve(result);
            });
        });
    }

    update(id: string, obj: Product, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }
}
