import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Notification} from '../../models/notification';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    public colonyId = null;
    private collection: AngularFirestoreCollection<Notification>;
    private obj: Observable<Notification[]>;

    constructor(
        private db: AngularFirestore,
    ) {
    }

    getCollection(userId: string) {
        return this.collection = this.db.collection<Notification>('/user/' + userId + '/notification',
            ref => ref.orderBy('createdAt', 'desc'));
    }

    getAll(userId: string) {
        return this.obj = this.getCollection(userId).snapshotChanges().pipe(map(
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

    getUnreads( userId: string) {
        return  this.db.collection<Notification>('/user/' + userId + '/notification')
            .ref.where('status', '==', 'unread')
            .orderBy('createdAt', 'desc').get();
    }


    add(obj: Notification, userId: string) {
        return this.getCollection(userId).add(obj);
    }

    remove(id: string, userId: string) {
        return this.getCollection(userId).doc(id).delete();
    }

    get(id: string, userId: string) {
        return this.getCollection(userId).doc<Notification>(id).valueChanges();
    }

    update(id: string, obj: Notification, userId: string) {
        return this.getCollection(userId).doc(id).update(obj);
    }
}
