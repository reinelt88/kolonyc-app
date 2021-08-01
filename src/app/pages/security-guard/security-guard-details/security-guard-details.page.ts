import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../../sharedServices/storage.service';
import {ColonyService} from '../../colony/colony.service';
import {UserService} from '../../users/user.service';
import {AuthService} from '../../../sharedServices/auth.service';
import {BasePage} from '../../base/base.page';
import {SecurityService} from '../security.service';
import {User} from '../../../models/user';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import * as moment from 'moment';

@Component({
    selector: 'app-security-guard-details',
    templateUrl: './security-guard-details.page.html',
    styleUrls: ['./security-guard-details.page.scss'],
})
export class SecurityGuardDetailsPage extends BasePage implements OnInit {

    securitytId = null;
    generateEmail = 0;
    public form: FormGroup;
    public attempt = false;
    public defaultErrorMessage = 'Por favor ingrese un valor válido';

    constructor(
        private loadingController: LoadingController,
        private route: ActivatedRoute,
        private nav: NavController,
        private router: Router,
        protected storageService: StorageService,
        protected toastController: ToastController,
        private colonyService: ColonyService,
        private userService: UserService,
        private authService: AuthService,
        private securityService: SecurityService,
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private keyboard: Keyboard,
    ) {
        super(storageService, toastController);
        this.form = formBuilder.group(
            {
                email: ['', Validators.compose([Validators.required, Validators.email])],
                displayName: ['', Validators.compose([Validators.required, Validators.min(5)])],
                profilePicture: this.user.profilePicture,
                phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
            });
    }

    ngOnInit() {
        this.securitytId = this.route.snapshot.params.id;

        if (this.securitytId) {
            this.loadSecurity();
        }
    }

    async loadSecurity() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.securityService.get(this.securitytId, this.savedUser.colonyId).subscribe(res => {

            this.security = res;

            const userId = this.security.userId;

            if (userId !== '') {

                this.userService.get(userId).subscribe(user => {
                    this.user = user;
                    this.user.id = userId;
                    this.form.get('email').setValue(user.email);
                    this.form.get('phone').setValue(user.phone);
                    this.form.get('displayName').setValue(user.displayName);
                });
            }

            loading.dismiss();
        });

    }

    async saveSecurity() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        if (this.form.valid) {
            if (this.securitytId) {

                this.securityService.update(this.securitytId, this.security, this.savedUser.colonyId).then(() => {

                    this.user.displayName = this.form.value.displayName;
                    this.user.email = this.form.value.email;
                    this.user.phone = this.form.value.phone;
                    this.userService.update(this.user, this.security.userId).then(() => {
                        this.attempt = false;
                        this.nav.navigateForward('/list-security-guards');
                    });
                });

            } else {

                this.authService.afAuth.createUserWithEmailAndPassword(this.form.value.email, 'user123')
                    .then((result) => {
                        this.authService.afAuth.currentUser.then(u => u.sendEmailVerification())
                            .then(async () => {
                              // create new
                              this.form.value.uid = await this.authService.afAuth.currentUser.then(u => u.uid);

                              const user: User = {
                                uid: this.form.value.uid,
                                email: this.form.value.email,
                                phone: this.form.value.phone,
                                password: 'user123',
                                role: 'SECURITY',
                                displayName: this.form.value.displayName,
                                profilePicture: this.user.profilePicture,
                                colonyId: this.savedUser.colonyId,
                                token: '',
                                createdAt: this.user.createdAt
                              };

                              this.userService.add(user).then(docRef => {

                                this.security.userId = docRef.id;

                                this.securityService.add(this.security, this.savedUser.colonyId).then(() => {
                                  this.attempt = false;
                                  this.nav.navigateForward('/list-security-guards');
                                });
                              });

                            });
                    }).catch((error) => {
                    error.log('Error registering user', error.message);
                });

            }
        } else {
            this.attempt = true;
        }

        loading.dismiss();

    }


    removeSecurity() {
        this.securityService.remove(this.securitytId, this.savedUser.colonyId);
        this.nav.navigateForward('/list-security-guards');
    }

    async confirmMessage() {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar al seguridad?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Ok',
                    handler: () => {
                        console.log('Confirm Okay');
                        this.removeSecurity();
                    }
                }
            ]
        });

        await alert.present();
    }

    hideKeyboard() {
        this.keyboard.hide();
    }

    generateMailChange($event) {
        if ($event.detail.checked){
            this.form.get('email').setValue('security_' + moment().unix().toString() + '@kolonyc.com');
        } else {
            this.form.get('email').setValue('');
        }

    }


}
