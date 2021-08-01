import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Person} from '../../models/person';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class PersonService {

    private obj: Observable<Person[]>;
    private collection: AngularFirestoreCollection<Person>;

    constructor(
        private db: AngularFirestore,
    ) {
    }

    getCollection(accessId: string, colonyId: string) {
        return this.collection = this.db.collection<Person>('/colony/' + colonyId + '/access/' + accessId + '/person');
    }

    getAll(accessId: string, colonyId: string) {

        return this.obj = this.getCollection(accessId, colonyId).snapshotChanges().pipe(map(
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

    add(obj: Person, accessId: string, colonyId: string) {
        return this.getCollection(accessId, colonyId).add(obj);
    }

    remove(id: string, accessId: string, colonyId: string) {
        return this.getCollection(accessId, colonyId).doc(id).delete();
    }

    get(personId: string, accessId: string, colonyId: string) {
        return this.getCollection(accessId, colonyId).doc<Person>(personId).valueChanges();
    }

    update(id: string, obj: Person, accessId: string, colonyId: string) {
        return this.getCollection(accessId, colonyId).doc(id).update(obj);
    }
}
