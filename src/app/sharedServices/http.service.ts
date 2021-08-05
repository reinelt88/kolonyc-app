import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {PushNotification} from '../models/pushNotification';
import {PaymentEmail} from '../models/paymentEmail';
import {PaymentStatusEmail} from '../models/paymentStatusEmail';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private FcmHttpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'key=' + environment.fcmToken
        })
    };

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(
        private http: HttpClient
    ) {
    }

    pushNotification(notification: PushNotification) {
        return this.http.post(environment.fcmUrl, JSON.stringify(notification), this.FcmHttpOptions);
    }

    paymentEmailNotification(paymentEmail: PaymentEmail) {
        return this.http.post(environment.functionUrl + '/paymentSendMail', JSON.stringify(paymentEmail), this.httpOptions);
    }

    paymentStatusNotification(paymentStatusEmail: PaymentStatusEmail) {
        return this.http.post(environment.functionUrl + '/paymentStatusSendMail', JSON.stringify(paymentStatusEmail), this.httpOptions);
    }

}
