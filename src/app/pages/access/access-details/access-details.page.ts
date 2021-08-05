import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../../sharedServices/storage.service';
import {AccessService} from '../access.service';
import {PersonService} from '../../person/person.service';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {Base64ToGallery} from '@ionic-native/base64-to-gallery/ngx';
import * as moment from 'moment';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {BasePage} from '../../base/base.page';
import {timer} from 'rxjs';
import {UserService} from '../../users/user.service';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ColonyService} from '../../colony/colony.service';
import {HouseService} from '../../resident/house.service';
import {AccessTypeService} from '../accessType/accessType.service';
import {AccessType} from '../../../models/accessType';
import {IonicSelectableComponent} from 'ionic-selectable';
import {Events} from '../../../sharedServices/events.service';

@Component({
    selector: 'app-access-details',
    templateUrl: './access-details.page.html',
    styleUrls: ['./access-details.page.scss'],

})
export class AccessDetailsPage extends BasePage implements OnInit {

    public startDate: string;
    public endDate: string;
    public persons = [];
    public locations = [];
    public accessId = null;
    public colonyId = null;
    public residentId = null;
    public colonyType = null;
    public form: FormGroup;
    public attempt = false;
    public defaultErrorMessage = 'Por favor ingrese un valor válido';
    public minDate: string = moment().format();
    public accessStatus = ['pendiente', 'en curso', 'completado'];
    public accessTypes: AccessType[];
    public showForm = false;
    public selectedHouse = null;

    private elementType: 'url' | 'canvas' | 'img' = 'canvas';
    private hasWriteAccess = false;



    // @ts-ignore
    @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;

    constructor(
        private loadingController: LoadingController,
        protected toastController: ToastController,
        private route: ActivatedRoute,
        private nav: NavController,
        private router: Router,
        protected storageService: StorageService,
        private accessService: AccessService,
        private personService: PersonService,
        private events: Events,
        private actionCtrl: ActionSheetController,
        private alertController: AlertController,
        private barcodeScanner: BarcodeScanner,
        private base64ToGallery: Base64ToGallery,
        private androidPermissions: AndroidPermissions,
        private userService: UserService,
        private callNumber: CallNumber,
        private formBuilder: FormBuilder,
        private colonyService: ColonyService,
        private houseService: HouseService,
        private accessTypeService: AccessTypeService
    ) {
        super(storageService, toastController);
        const m = moment();
        this.access.code = m.unix().toString();
        const newDate = new Date();
        this.access.startDate = new Date();
        this.access.endDate = this.addMinute(newDate, 5);
        this.startDate = newDate.toISOString();
        this.endDate = this.addMinute(newDate, 5).toISOString();
        // this.endDate = m.add(5, 'minutes').format();
    }


    ngOnInit() {

    }

    addMinute(dt, minutes) {
        return new Date(dt.getTime() + minutes * 60000);
    }

    ionViewWillEnter() {

        timer(3000).subscribe(() => {
            this.user = this.savedUser;

            this.accessId = this.route.snapshot.params.id;
            this.colonyId = (this.route.snapshot.params.colony !== undefined) ? this.route.snapshot.params.colony : this.user.colonyId;

            this.colonyService.get(this.colonyId).subscribe(col => {

                this.accessTypeService.getAll(this.user.colonyId).subscribe(accessTypes => {
                    this.colony = col;
                    this.colonyType = (this.colony.type === 'vertical') ? 'Edificio' : 'Calle';
                    this.accessTypes = accessTypes;

                    if (this.user.role === 'RESIDENT') {

                        this.access.houseId = this.user.houseId;
                        this.houseService.get(this.user.houseId, this.user.colonyId).subscribe(house => this.house = house);

                    } else {
                        this.loadLocations();
                    }

                    // Is new access
                    if (this.accessId !== undefined) {
                        this.loadAccess();
                    }
                    this.showForm = true;
                });
            });
        });

        this.checkPermissions();
    }

    loadLocations() {
        this.locations = [];
        this.userService.getByResidentAndAdminByColony(this.colonyId).then(res => {
            if (res.length > 0) {
                const locationsArr = [];
                res.forEach(d => {
                    const data = d.data();
                    this.houseService.get(data.houseId, this.colonyId).subscribe(house => {
                        if (!locationsArr.find(l => l.id === data.houseId)) {
                            locationsArr.push({
                                id: data.houseId,
                                name: this.colonyType + ' ' +  house.place + ' #' + house.number,
                            });
                        }
                    });
                });

                this.locations = locationsArr;

                this.showForm = true;
            }
        });
    }

    async loadAccess() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.accessService.get(this.accessId, this.colonyId).subscribe(res => {

            if (res) {

                this.access.status = res.status;
                this.access.houseId = res.houseId;
                this.access.code = res.code;
                this.access.accessType = res.accessType;
                this.access.callResident = res.callResident;
                this.startDate = new Date(res.startDate.seconds * 1000).toISOString();
                this.endDate = new Date(res.endDate.seconds * 1000).toISOString();

                if (res.houseId !== '') {
                    this.houseService.get(res.houseId, this.colonyId).subscribe( house => {
                        this.house = house;
                    });
                }

                this.personService.getAll(this.accessId, this.colonyId).subscribe(persons => {
                    if (persons) {
                        console.log(persons);
                        this.persons = persons;
                    }
                });

                loading.dismiss();
            }

        });
    }

    async save() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        const oStartDate = new Date(this.startDate);
        const oEndDate = new Date(this.endDate);

        if (oStartDate < oEndDate) {
            this.access.startDate = oStartDate;
            this.access.endDate = oEndDate;
            this.access.createdBy = (this.user.role === 'RESIDENT') ? 'residente' : (this.user.role === 'SECURITY') ? 'seguridad' : (this.user.role === 'ADMIN') ? 'administrador' : 'superadmin';

            if (this.accessId) {
                this.accessService.update(this.accessId, this.access, this.colonyId).then(() => {
                    loading.dismiss();
                    this.nav.navigateForward('/list-accesses');
                });
            } else {
                if (this.user.role !== 'RESIDENT') {
                    this.access.houseId = (this.selectedHouse) ? this.selectedHouse.id : null;
                }
                this.access.status = (this.user.role === 'SECURITY') ? 'en curso' : 'pendiente';
                if (this.access.houseId === '' || this.access.houseId === '' || this.access.accessType === '' || this.access.startDate === '' || this.access.endDate === '') {
                    this.toast(2000, 'Debe de completar los datos para poder crear el acceso', 'danger');
                    loading.dismiss();
                } else {
                    this.accessService.add(this.access, this.colonyId).then(accessResponse => {
                        if (accessResponse) {
                            this.accessId = accessResponse.id;
                            this.houseService.get(this.access.houseId, this.colonyId).subscribe( house => {
                                this.house = house;
                            });
                            if (this.persons.length > 0) {
                                this.persons.forEach(p => {
                                    this.person.name = p.name;
                                    this.person.companions = p.companions;
                                    delete this.person.id;
                                    this.personService.add(this.person, accessResponse.id, this.colonyId).then(personResponse => {
                                        console.log(personResponse);
                                    });
                                });
                            } else {
                                this.person.name = 'Desconocido';
                                this.person.companions = 0;
                                this.personService.add(this.person, accessResponse.id, this.colonyId).then(personResponse => {
                                    console.log(personResponse);
                                });
                            }

                        }
                        loading.dismiss();
                        this.toast(2000, 'Acceso guardado correctamente', 'success');
                        // this.nav.navigateForward('/list-accesses');
                    });
                }
            }
        } else {
            this.toast(2000, 'La fecha inicio debe de ser mayor a la fecha fin', 'danger');
            loading.dismiss();
        }

    }

    removeAccesss() {
        this.accessService.get(this.accessId, this.colonyId).subscribe(a => {
           if (a.status === 'en curso' || a.status === 'completado') {
               this.toast(4000, 'El acceso no se puede eliminar estando en curso o completado', 'danger');
           } else {
               this.accessService.remove(this.accessId, this.colonyId);
               this.toast(2000, 'Acceso eliminado correctamente', 'success');
               this.nav.navigateForward('/list-accesses');
           }
        });
    }

    removePerson(id: string) {
        if (this.accessId) {
            this.personService.remove(id, this.accessId, this.colonyId);
        }

        this.persons.forEach((item, index) => {
            if (item.id === id) {
                this.persons.splice(index, 1);
            }
        });
    }

    async deletePersonConfirmMessage(id: string) {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar a la persona?',
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
                        this.removePerson(id);
                    }
                }
            ]
        });

        await alert.present();
    }

    async deleteAccessConfirmMessage() {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar el acceso?',
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
                        this.removeAccesss();
                    }
                }
            ]
        });

        await alert.present();
    }

    updateStartDate($event) {
        this.startDate = $event.detail.value;
    }

    updateEndDate($event) {
        this.endDate = $event.detail.value;
    }

    addPerson(data) {

        if (data.name !== '') {

            this.person.name = data.name;
            this.person.companions = (data.companions !== '') ? data.companions : 0;

            if (this.accessId) {
                this.personService.add(this.person, this.accessId, this.colonyId).then(() => {
                    this.persons.push(this.person);
                });
            } else {
                this.save();
                this.person.id = Math.random().toString(36).substring(7);
                this.persons.push(this.person);
            }

        } else {
            this.toast(2000, 'Debe de llenar los campos correspondientes', 'danger');
        }
    }

    openActionSheet() {

        const addPerson = {
            text: 'Agregar persona',
            icon: 'person',
            handler: () => {
                this.presentAlertPrompt();
            }
        };

        const downloadQR = {
                text: 'Descargar código QR',
                icon: 'download',
                handler: () => {
                    this.downloadQr();
                }
        };

        const remove = {
            text: 'Borrar',
            icon: 'trash',
            handler: () => {
                this.deleteAccessConfirmMessage();
            }
        };

        const cancel = {
            text: 'Cancelar',
            icon: 'close-circle',
            role: 'cancel'
        };

        let btn = [];
        if (this.savedUser.role === 'SECURITY' || this.accessId == null) {
            btn = [
                downloadQR, cancel
            ];
            if (this.selectedHouse !== null && this.access.accessType !== '') {
                btn.push(addPerson);
            }
        } else {
            btn = [
                addPerson, downloadQR, remove, cancel
            ];
        }


        this.actionCtrl.create({
            buttons: btn
        }).then(ac => ac.present());
    }

    async presentAlertPrompt() {
        const alert = await this.alertController.create({
            header: 'Agregar persona',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    id: 'maxLength10',
                    placeholder: 'Nombre y apellidos',
                },
                {
                    name: 'companions',
                    type: 'number',
                    placeholder: 'Cantidad de acompañantes',
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        console.log('Confirm Ok');
                        this.addPerson(data);
                    }
                }
            ]
        });

        await alert.present().then(result => {
            document.getElementById('maxLength10').setAttribute('maxlength', '30');
        });
    }

    downloadQr() {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        const imageData = canvas.toDataURL('image/jpeg').toString();
        const data = imageData.split(',')[1];

        if (!this.hasWriteAccess) {
            this.checkPermissions();
        }

        this.base64ToGallery.base64ToGallery(data, {
            prefix: '_img',
            mediaScanner: true
        }).then(async res => {
            const toast = await this.toastController.create({
                header: 'Código QR almacenado en tu galería',
                duration: 2000
            });
            toast.present();
        }, error => console.log('Error ', error));
    }

    checkPermissions() {
        this.androidPermissions
            .checkPermission(this.androidPermissions
                .PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then((result) => {
                console.log('Has permission?', result.hasPermission);
                this.hasWriteAccess = result.hasPermission;
            }, (err) => {
                this.androidPermissions
                    .requestPermission(this.androidPermissions
                        .PERMISSION.WRITE_EXTERNAL_STORAGE);
            });
        if (!this.hasWriteAccess) {
            this.androidPermissions
                .requestPermissions([this.androidPermissions
                    .PERMISSION.WRITE_EXTERNAL_STORAGE]);
        }
    }

    makeCall() {
        this.userService.getByColonyAndHouse(this.user.colonyId, this.access.houseId).then(users => {
            const userData = users.docs[0].data(); // TODO: Hacer correctamente que seleccione a que residente llamar
            this.callNumber.callNumber(userData.phone, true)
                .then(r => console.log('Launched dialer!', r))
                .catch(err => console.log('Error launching dialer', err));
        });
    }

    callResident($event) {
        this.access.callResident = $event.detail.checked;
    }

    clear() {
        this.selectComponent.clear();
        this.selectComponent.close();
        this.access.houseId = null;
        this.loadLocations();
    }

    confirm() {
        this.selectComponent.confirm();
        this.loadLocations();
        this.selectComponent.close();
    }

}
