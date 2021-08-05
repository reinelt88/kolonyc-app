import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {UserService} from '../pages/users/user.service';
import {StorageService} from './storage.service';
import {FCM} from '@ionic-native/fcm/ngx';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Events} from './events.service';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public isLogged: any = false;
    userId = '';
    private allowedEmails = ['rey880603@gmail.com', 'admin@colonyc.com', 'resident@colonyc.com', 'security@colonyc.com'];
    private notActivatedMessage = 'La cuenta asociada a este email no ha sido verificada, por favor acceda al enlace ' +
      'que ha sido enviado a su correo electrónico para activarla';

    constructor(public afAuth: AngularFireAuth,
                private db: AngularFirestore,
                private userService: UserService,
                private storageService: StorageService,
                private events: Events,
                private fcm: FCM
    ) {
        afAuth.authState.subscribe(
            user => (this.isLogged = user)
        );
    }

    async onLogin(user: string, password: string) {
        try {

            return new Promise<any>((resolve, reject) => {
                this.afAuth.signInWithEmailAndPassword(user, password).then(
                    res => {
                        if (this.allowedEmails.find(e => e === user) === undefined &&
                            user.match(/security_\d{1,10}@kolonyc.com/g) === null) {

                            if (res.user.emailVerified) {
                                this.isLogged = true;
                                this.userId = res.user.uid;
                                this.manageUserEventAndStorage(password);
                                resolve(res);
                            } else {
                                this.events.publish('loginError', this.notActivatedMessage);
                                reject(this.notActivatedMessage);
                            }

                        } else {
                            this.isLogged = true;
                            this.userId = res.user.uid;
                            this.manageUserEventAndStorage(password);
                            resolve(res);
                        }

                    }, err => {
                        this.events.publish('loginError', err);
                        reject(err);
                    }
                );
            });

        } catch (e) {
            console.log('Error on login', e);
        }
    }

    async onRegister(user: User) {
        return new Promise<any>((resolve, reject) => {
            this.afAuth.createUserWithEmailAndPassword(user.email, user.password).then(
                res => {
                    this.userId = res.user.uid;
                    user.uid = this.userId;
                    user.role = 'SUPERADMIN';
                    user.password = '';
                    this.db.collection('user').add(user);

                    this.manageUserEventAndStorage(user.password);

                    resolve(res);
                }, err => {

                    reject(err);
                }
            );
        });
    }

    manageUserEventAndStorage(password: string) {

        this.userService.getByUid(this.userId).then(data => {
            data.password = password;

            this.fcm.getToken().then(t => {

                if (data.token !== t) {
                    data.token = t;
                    this.userService.update(data, data.id).then(() => {
                    });
                }
            });

            if (data) {
                this.events.publish('userChange', data);
                this.storageService.setObject('user', data);
            }
        });
    }

    resetPassword(email: string) {
        return this.afAuth.sendPasswordResetEmail(email);
    }
}
