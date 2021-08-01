import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Booking} from '../../../models/booking';
import {HouseService} from '../../resident/house.service';
import {UserService} from '../../users/user.service';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    private obj: Observable<Booking[]>;
    private collection: AngularFirestoreCollection<Booking>;

    constructor(
        private db: AngularFirestore,
        private houseService: HouseService,
        private userService: UserService
    ) {
    }

    getCollection(areaId: string, colonyId: string) {
        return this.collection = this.db.collection<Booking>('/colony/' + colonyId + '/area/' + areaId + '/booking');
    }

    getAll(areaId: string, colonyId: string) {

        return this.obj = this.getCollection(areaId, colonyId).snapshotChanges().pipe(map(
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

    add(obj: Booking, areaId: string, colonyId: string) {
        return this.getCollection(areaId, colonyId).add(obj);
    }

    remove(id: string, areaId: string, colonyId: string) {
        return this.getCollection(areaId, colonyId).doc(id).delete();
    }

    get(bookingId: string, areaId: string, colonyId: string) {
        return this.getCollection(areaId, colonyId).doc<Booking>(bookingId).valueChanges();
    }

    update(id: string, obj: Booking, areaId: string, colonyId: string) {
        return this.getCollection(areaId, colonyId).doc(id).update(obj);
    }

    getBookingsInDate(date: any, areaId: string, colonyId: string) {
        return new Promise<any>((resolve, reject) => this.db.collection<Booking>('/colony/' + colonyId + '/area/' + areaId + '/booking')
                .ref.where('startTime', '<=', date).get().then(res => {
                let count = 0;
                res.docs.forEach(d => {
                    const data = d.data();
                    const endDate = new Date(data.endTime.seconds * 1000);

                    if (date < endDate) {
                        count++;
                    }
                });

                resolve(count);
            }));

    }

    getNextBookings(areaId: string, colonyId: string) {
        const date = new Date();
        return new Promise<any>((resolve, reject) => this.db.collection<Booking>('/colony/' + colonyId + '/area/' + areaId + '/booking')
                .ref.where('startTime', '>=', date).get().then(res => {
                    const bookings = [];
                    res.docs.forEach(d => {
                        const data: any = d.data();
                        data.id = d.id;
                        data.startTime = new Date(data.startTime.seconds * 1000);
                        data.endTime = new Date(data.endTime.seconds * 1000);

                        this.houseService.getResident(colonyId, data.residentId).then(resident => {
                           this.userService.get(resident.userId).subscribe(user => {
                               data.residentId = (user.displayName !== '') ? user.displayName : 'Sin nombre';
                           });
                        });

                        bookings.push(data);
                    });

                    resolve(bookings);
                }));

    }
}
