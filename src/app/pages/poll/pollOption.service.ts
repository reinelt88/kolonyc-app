import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PollOption} from '../../models/pollOption';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PollOptionService {

  private obj: Observable<PollOption[]>;
  private collection: AngularFirestoreCollection<PollOption>;

  constructor(
    private db: AngularFirestore,
  ) {
  }

  getCollection(pollId: string, colonyId: string) {
    return this.collection = this.db.collection<PollOption>('/colony/' + colonyId + '/poll/' + pollId + '/pollOption');
  }

  getAll(pollId: string, colonyId: string) {

    return this.obj = this.getCollection(pollId, colonyId).snapshotChanges().pipe(map(
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

  getTotalVotes(pollId: string, colonyId: string) {
    return new Promise<any>((resolve, reject) => this.getCollection(pollId, colonyId).get().subscribe(res => {
      let qty = 0;
      res.docs.forEach(d => {
        const model = d.data();
        qty = qty + model.quantity;
      });
      resolve(qty);
    }));
  }

  getByName(pollId: string, colonyId: string, name: string) {
    return this.db.collection<PollOption>('/colony/' + colonyId + '/poll/' + pollId + '/pollOption')
      .ref.where('name', '==', name).get();
  }

  add(obj: PollOption, pollId: string, colonyId: string) {
    return this.getCollection(pollId, colonyId).add(obj);
  }

  remove(id: string, pollId: string, colonyId: string) {
    return this.getCollection(pollId, colonyId).doc(id).delete();
  }

  get(pollOptionId: string, pollId: string, colonyId: string) {
    return this.getCollection(pollId, colonyId).doc<PollOption>(pollOptionId).valueChanges();
  }

  getPollOption(pollOptionId: string, pollId: string, colonyId: string) {
    return this.getCollection(pollId, colonyId).doc<PollOption>(pollOptionId).get();
  }

  update(id: string, obj: PollOption, pollId: string, colonyId: string) {
    return this.getCollection(pollId, colonyId).doc(id).update(obj);
  }
}
