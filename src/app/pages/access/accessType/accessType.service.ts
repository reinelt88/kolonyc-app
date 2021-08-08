import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AccessType} from '../../../models/accessType';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AccessTypeService {

  private collection: AngularFirestoreCollection<AccessType>;
  private obj: Observable<AccessType[]>;

  constructor(
    private db: AngularFirestore,
  ) {

  }

  getCollection(colonyId: string) {
    return this.collection = this.db.collection<AccessType>('/colony/' + colonyId + '/accessType');
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

  get(id: string, colonyId: string) {
    return this.getCollection(colonyId).doc<AccessType>(id).valueChanges();
  }

  update(obj: AccessType, id: string, colonyId: string) {
    return this.getCollection(colonyId).doc(id).update(obj);
  }

  add(obj: AccessType, colonyId: string) {
    return this.getCollection(colonyId).add(obj);
  }

  remove(id: string, colonyId: string) {
    return this.getCollection(colonyId).doc(id).delete();
  }

  getByName(colonyId: string, name: string) {
    return this.db.collection<AccessType>('/colony/' + colonyId + '/accessType').ref.where('name', '==', name).get();
  }

}
