import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Security} from '../../models/security';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {

  public colonyId: string;
  private collection: AngularFirestoreCollection<Security>;
  private obj: Observable<Security[]>;

  constructor(
      private db: AngularFirestore,
  ) {

  }

  getCollection(colonyId: string) {
      return this.collection = this.db.collection<Security>('/colony/' + colonyId + '/security', ref => ref.orderBy('createdAt', 'desc'));
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

  add(obj: Security, colonyId: string) {
      return this.getCollection(colonyId).add(obj);
  }

  remove(id: string, colonyId: string) {
      return this.getCollection(colonyId).doc(id).delete();
  }

  get(id: string, colonyId: string) {
      return this.getCollection(colonyId).doc<Security>(id).valueChanges();
  }

  update(id: string, obj: Security, colonyId: string) {
      return this.getCollection(colonyId).doc(id).update(obj);
  }
}
