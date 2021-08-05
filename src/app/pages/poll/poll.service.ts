import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Poll} from '../../models/poll';
import {PollOptionService} from './pollOption.service';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class PollService {

    public colonyId = null;
    private collection: AngularFirestoreCollection<Poll>;
    private obj: Observable<Poll[]>;

    constructor(
        private db: AngularFirestore,
        private pollOptionService: PollOptionService
    ) {
    }

    getCollection(colonyId: string) {
        return this.collection = this.db.collection<Poll>('/colony/' + colonyId + '/poll', ref => ref.orderBy('createdAt', 'desc'));
    }

    getAll(colonyId: string) {
        return this.obj = this.getCollection(colonyId).snapshotChanges().pipe(map(
            actions => actions.map(
                    a => {
                        const data = a.payload.doc.data();
                        const currenDateSeconds = new Date().getTime();
                        const status = (currenDateSeconds >= data.endDate.seconds * 1000) ? 'Finalizada' : 'En curso';

                        const endDateFormatted = new Date (data.endDate.seconds * 1000).toISOString();

                        const id = a.payload.doc.id;

                        return {id, status, endDateFormatted, ...data};
                    }
                )
            )
        );
    }

    add(obj: Poll, colonyId: string) {
        return this.getCollection(colonyId).add(obj);
    }

    remove(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).delete();
    }

    get(pollId: string, colonyId: string) {
        return this.getCollection(colonyId).doc<Poll>(pollId).valueChanges();
    }

    update(id: string, obj: Poll, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }
}
