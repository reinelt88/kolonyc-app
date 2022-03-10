import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {StorageService} from '../../../sharedServices/storage.service';
import {PaymentService} from '../payment.service';
import {BasePage} from '../../base/base.page';
import {timer} from 'rxjs';
import {PushNotification} from '../../../models/pushNotification';
import {HouseService} from '../../resident/house.service';
import {ColonyService} from '../../colony/colony.service';
import {UploadService} from '../../../sharedServices/upload.service';
import {UserService} from '../../users/user.service';
import {PaymentEmail} from '../../../models/paymentEmail';
import {HttpService} from '../../../sharedServices/http.service';
import {NotificationService} from '../../notification/notification.service';
import {PaymentStatusEmail} from '../../../models/paymentStatusEmail';
import {IonicSelectableComponent} from 'ionic-selectable';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import {Events} from '../../../sharedServices/events.service';

@Component({
    selector: 'app-payment-details',
    templateUrl: './payment-details.page.html',
    styleUrls: ['./payment-details.page.scss'],
})
export class PaymentDetailsPage extends BasePage implements OnInit {

    @ViewChild('selectComponent', {static: false}) selectComponent: IonicSelectableComponent;
    public form: FormGroup;
    public attempt = false;
    public defaultErrorMessage = 'Por favor ingrese un valor válido';
    public paymentId = null;
    public years = [2019, 2020, 2021, 2022, 2023, 2024];
    public types = ['Transferencia', 'Depósito', 'Efectivo'];
    public statuses = ['Pendiente', 'Rechazado', 'Aprobado', 'Realizado'];
    public houses = [];
    public placeType = null;
    public oldStatus = null;
    public colonyType = '';
    public selectedHouse = null;
    public currency = 'MXN';
    public currencyIcon = '$';

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        protected toastController: ToastController,
        protected storageService: StorageService,
        protected paymentService: PaymentService,
        private route: ActivatedRoute,
        private houseService: HouseService,
        private colonyService: ColonyService,
        private uploadService: UploadService,
        private loadingController: LoadingController,
        private events: Events,
        private userService: UserService,
        private nav: NavController,
        private alertController: AlertController,
        private httpService: HttpService,
        private notificationService: NotificationService,
        private payPal: PayPal,
        private navController: NavController,
    ) {
        super(storageService, toastController);
        this.paymentId = this.route.snapshot.params.id;
        this.buildForm();
        this.setReferenceNumberValidators();
    }

    buildForm() {
        this.form = this.formBuilder.group(
            {
                status: [''],
                houseId: [''],
                month: ['', Validators.required],
                year: ['', Validators.required],
                type: ['', Validators.required],
                amount: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
                notes: [''],
                evidence: this.noImage,
                referenceNumber: [''],
            });
    }

    setReferenceNumberValidators() {
        const referenceNumberControl = this.form.get('referenceNumber');
        const statusControl = this.form.get('status');

        this.form.get('type').valueChanges
            .subscribe(type => {

                if (type === 'Depósito' || type === 'Transferencia') {
                    referenceNumberControl.setValidators([Validators.required]);
                } else {
                    referenceNumberControl.setValidators(null);
                }

                if (type === 'PayPal') {
                    statusControl.setValidators([Validators.required]);
                } else {
                    statusControl.setValidators(null);
                }

                referenceNumberControl.updateValueAndValidity();
            });
    }

    ngOnInit() {

        timer(1000).subscribe(() => {
            this.user = this.savedUser;

            this.colonyService.get(this.user.colonyId).subscribe(colonyRes => {
                this.colony = colonyRes;
                if (colonyRes.usePaypal && (colonyRes.paypalClientId !== '' || colonyRes.paypalClientId !== undefined) && (colonyRes.paypalClientSecret !== '' || colonyRes.paypalClientSecret !== undefined)) {
                    this.types.push('PayPal');
                }
            });

            this.form.get('year').setValue(new Date().getFullYear());
            this.form.get('month').setValue(new Date().getMonth() + 1);

            if (this.user.role === 'ADMIN') {

                this.colonyService.get(this.user.colonyId).subscribe(col => {
                    this.colony = col;
                    this.colonyType = (this.colony.type === 'vertical') ? 'Edificio' : 'Calle';
                    this.allPlaces(this.paymentId);
                });

            } else {
                this.form.get('houseId').setValue(this.user.houseId);
                this.form.get('status').setValue('Realizado');
            }

            this.colonyService.get(this.user.colonyId).subscribe(col => {
                this.colony = col;
                this.placeType = (this.colony.type === 'vertical') ? 'Edificio' : 'Calle';
            });

            if (this.paymentId) {
                this.loadPayment();
            }
        });
    }

    allPlaces(paymentId) {
        this.houseService.getAll(this.user.colonyId).subscribe(home => {
            // this.houses = home
            const arrHouses = [];
            home.forEach(h => {
                const obj: any = {
                    id: h.id,
                    place: this.colonyType + ' ' + h.place + ' - # ' + h.number,
                };

                if (paymentId === null || paymentId === undefined) {
                    arrHouses.push(obj);
                } else {
                    this.paymentService.get(paymentId, this.user.colonyId).subscribe(p => {
                        if (p.houseId === h.id) {
                            arrHouses.push(obj);
                            this.selectedHouse = obj;
                        }
                    });
                }
            });
            this.houses = arrHouses;
        });
    }

    async loadPayment() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.paymentService.get(this.paymentId, this.user.colonyId).subscribe(p => {
            this.payment = p;

            this.form.get('month').setValue(this.payment.month);
            this.form.get('year').setValue(this.payment.year);
            this.form.get('status').setValue(this.payment.status);
            this.form.get('houseId').setValue(this.payment.houseId);
            this.form.get('type').setValue(this.payment.type);
            this.form.get('evidence').setValue(this.payment.evidence);
            this.form.get('referenceNumber').setValue(this.payment.referenceNumber);
            this.form.get('notes').setValue(this.payment.notes);
            this.form.get('amount').setValue(this.payment.amount);

            this.loadingController.dismiss();
        }, e => console.log(e));
    }

    async save() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        if (this.form.valid) {

            this.payment.month = this.form.value.month;
            this.payment.year = this.form.value.year;
            this.payment.type = this.form.value.type;
            this.payment.houseId = (this.user.role === 'ADMIN') ? this.selectedHouse.id : this.form.value.houseId;
            this.payment.referenceNumber = this.form.value.referenceNumber;
            this.payment.status = this.form.value.status;
            this.payment.notes = this.form.value.notes;
            this.payment.amount = this.form.value.amount;

            // Actualizando el pago
            if (this.paymentId) {

                this.paymentService.get(this.paymentId, this.user.colonyId).subscribe(obs => {
                    if (obs) {

                        this.oldStatus = obs.status;

                        if (this.oldStatus !== this.payment.status) {
                            this.userService.getByColonyAndHouse(this.user.colonyId, this.payment.houseId).then(res => {
                                if (res.docs.length > 0) {
                                    res.forEach(r => {
                                        const user = r.data();
                                        user.id = r.id;
                                        const notification: PushNotification = {
                                            notification: {
                                                title: 'Estado de pago actualizado',
                                                body: 'El administrado de la colonia ha actualizado el estado del ' +
                                                  'pago del ' + this.payment.month + '/' + this.payment.year + ' a ' + this.payment.status,
                                                image: user.profilePicture
                                            },
                                            to: user.token,
                                        };

                                        // push notification
                                        if (notification.to !== '') {
                                            this.httpService.pushNotification(notification).subscribe(sub => {
                                                console.log(sub);
                                            });
                                        }

                                        const paymentStatusEmail: PaymentStatusEmail = {
                                            email: user.email,
                                            quantity: this.payment.amount,
                                            referenceNumber: this.payment.referenceNumber,
                                            type: this.payment.type,
                                            notes: this.payment.notes,
                                            evidence: (this.payment.evidence !== '') ? this.payment.evidence : this.noImage,
                                            month: this.payment.month,
                                            year: this.payment.year,
                                            house: '',
                                            status: this.payment.status,
                                        };

                                        this.httpService.paymentStatusNotification(paymentStatusEmail).subscribe(r => {
                                            console.log(res);
                                        });

                                        // system notification
                                        this.notification.title = 'El administrado de la colonia ha ' +
                                          'actualizado el estado del pago del ' +
                                          '' + this.payment.month + '/' + this.payment.year + ' a ' + this.payment.status;
                                        this.notificationService.add(this.notification, r.id).then(() => {
                                            this.events.publish('userNotification');
                                        });

                                    });
                                }
                            });
                        }


                        this.paymentService.update(this.paymentId, this.payment, this.user.colonyId).then(() => {
                            this.toast(2000, 'Datos actualizados correctamente', 'success');
                            this.attempt = false;
                            loading.dismiss();
                            this.router.navigateByUrl('/payment-home/list');
                        });
                    }
                });
            // Creando nuevo pago
            } else {
                // Se verifica que no exista ya el pago para esa casa y ese mes
                this.paymentService.getByHouseAndMonthAndYear(
                  this.user.colonyId,
                  this.payment.houseId,
                  this.payment.month,
                  this.payment.year
                ).then(res => {
                    if (res.docs.length > 0) {
                        this.toast(4000, 'Ya existe un pago para el mes indicado', 'danger');
                        loading.dismiss();
                    } else {
                        if (this.form.value.type === 'PayPal') {
                            this.payWithPaypal();
                        } else {
                            this.makePayment();
                        }

                    }
                });
            }
        } else {
            this.attempt = true;
        }
        loading.dismiss();
    }

    makePayment() {
        this.paymentService.add(this.payment, this.user.colonyId).then(() => { // Añadiendo el pago
            this.userService.getByColonyAndRole(this.user.colonyId, 'ADMIN').then(result => { // Obtenemos al ADMIN
                if (result.docs.length > 0) {
                    result.docs.forEach(u => {
                        const data = u.data();

                        // Preparando push notification
                        const notification: PushNotification = {
                            notification: {
                                title: 'Notificación de nuevo pago',
                                body: 'El residente ' + this.user.displayName + ' ha realizado un pago de mensualidad',
                                image: this.user.profilePicture
                            },
                            to: data.token,
                        };

                        const paymentEmail: PaymentEmail = {
                            email: data.email,
                            house: '',
                            quantity: this.payment.amount,
                            referenceNumber: this.payment.referenceNumber,
                            type: this.payment.type,
                            notes: this.payment.notes,
                            evidence: (this.payment.evidence !== '') ? this.payment.evidence : this.noImage,
                            month: this.payment.month,
                            year: this.payment.year,
                        };

                        this.houseService.get(this.payment.houseId, this.user.colonyId).subscribe(h => {
                            paymentEmail.house = h.place + '/' + h.number;

                            // push notification
                            if (notification.to !== '') {
                                this.httpService.pushNotification(notification).subscribe(r => {
                                    console.log(r);
                                });
                            }

                            // admin email notification
                            this.httpService.paymentEmailNotification(paymentEmail).subscribe(r => {
                                console.log(r);
                            });

                            // resident email notification
                            if (this.user.role === 'RESIDENT') { // Si el usuario que crea el pago es un residente
                                paymentEmail.email = this.user.email;
                                this.httpService.paymentEmailNotification(paymentEmail).subscribe(r => {
                                    console.log(r);
                                });
                            } else { // Si el usuario que crea el pago es ADMIN
                                this.userService.getByColonyAndHouse(this.user.colonyId, this.payment.houseId).then(residents => {
                                    if (residents.docs.length > 0) {
                                        residents.docs.forEach( r => {
                                            const resident = r.data();
                                            paymentEmail.email = resident.email;
                                            this.httpService.paymentEmailNotification(paymentEmail).subscribe(response => {
                                                console.log(response);
                                            });
                                        });
                                    }
                                });
                            }

                            // system notification
                            this.notification.title = 'El residente ' + this.user.displayName + ' ha realizado un pago de mensualidad';
                            this.notificationService.add(this.notification, u.id).then(() => {
                                this.events.publish('userNotification');
                            });

                            this.toast(2000, 'Pago realizado correctamente, su confirmación será notificada', 'success');
                            this.attempt = false;
                            // loading.dismiss();
                            this.events.publish('paymentAdd');
                            this.router.navigateByUrl('/payment-home/list');
                        });

                    });
                }
            });
        });
    }

    payWithPaypal() {
        this.payPal.init({
            PayPalEnvironmentProduction: this.colony.paypalClientId,
            PayPalEnvironmentSandbox: this.colony.paypalClientSecret
        }).then(() => {
            // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
            this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
                // Only needed if you get an "Internal Service Error" after PayPal login!
                // payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
            })).then(() => {
                const payment = new PayPalPayment(this.form.value.amount, this.currency, 'Pago de mensualidad', 'Pago de mensualidad');
                this.payPal.renderSinglePaymentUI(payment).then((res) => {
                    console.log(res);

                    if (res.response.intent === 'authorize') {
                        this.payment.status = 'Aprobado';
                        this.payment.referenceNumber = res.response.authorization_id;
                    } else {
                        this.payment.status = 'Pendiente';
                    }

                    this.makePayment();
                    // Successfully paid

                    // Example sandbox response
                    //
                    //
                    // {
                    //   "client": {
                    //     "environment": "live",
                    //     "product_name": "PayPal iOS SDK",
                    //     "paypal_sdk_version": "2.16.0",
                    //     "platform": "iOS"
                    //   },
                    //   "response_type": "payment",
                    //   "response": {
                    //     "authorization_id": "PAYID-L2UHP5A0TN37045NB168144T",
                    //     "state": "approved",
                    //     "create_time": "2016-10-03T13:33:33Z",
                    //     "intent": "authorize"
                    //     "id": "PAYID-L2UHP5A0TN37045NB168144T"
                    //   }
                    // }
                }, () => {
                    // Error or render dialog closed without being successful
                    this.toast(4000, 'Los sentimos la ventana se cerró sin finalizar la operación', 'danger');
                });
            }, () => {
                // Error in configuration
                this.toast(4000, 'Error en la configuración', 'danger');
            });
        }, () => {
            // Error in initialization, maybe PayPal isn't supported or something else
            this.toast(4000, 'Error en la inicialización de PayPal', 'danger');
        });
    }

    remove() {
        this.paymentService.remove(this.paymentId, this.user.colonyId);
        this.nav.navigateForward('/list-payments');
    }

    async confirmMessage() {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar el pago?',
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
                        this.remove();
                    }
                }
            ]
        });

        await alert.present();
    }

    clear() {
        this.selectComponent.clear();
        // this.selectComponent.close();
        // this.form.get('houseId').setValue('');
        this.selectedHouse = null;
        this.allPlaces(null);
    }

    confirm() {
        this.selectComponent.confirm();
        // this.loadPayments();
        this.selectComponent.close();
    }

    changeType($event) {
        this.payment.type = $event.detail.value;
        this.form.get('type').setValue($event.detail.value);
    }

    // *******************************Image managment

    async loadImage(method: string) {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();
        const path = 'payment';

        if (method === 'takePicture') {
            this.uploadService.takePicture(path).then((res) => {
                this.events.subscribe(path, (url) => {
                    this.updateImage(url);
                    loading.dismiss();
                });
            });
        } else {
            this.uploadService.getImages(path, 1);
            this.events.subscribe(path, (url) => {
                this.updateImage(url);
                loading.dismiss();
            });
        }
        this.toast(2000, 'Carga completada', 'success');
    }

    updateImage(url: string) {
        this.payment.evidence = url;

        if (this.paymentId) {
            this.paymentService.update(this.paymentId, this.payment, this.user.colonyId).then(res => {
            });
        }
    }

    showPhoto() {
        this.uploadService.showPhoto(this.payment.evidence, 'Pago');
    }

}
