import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../../sharedServices/storage.service';
import {AccessService} from '../access.service';
import {PersonService} from '../../person/person.service';
import {ResidentService} from '../../resident/resident.service';
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
    public residents = [];
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
        private residentService: ResidentService,
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
    }


    ngOnInit() {

    }

    ionViewWillEnter() {

        timer(3000).subscribe(() => {
            this.user = this.savedUser;

            this.accessId = this.route.snapshot.params.id;
            this.colonyId = (this.route.snapshot.params.colony !== undefined) ? this.route.snapshot.params.colony : this.user.colonyId;

            this.colonyService.get(this.colonyId).subscribe(col => {
                this.colony = col;
                this.colonyType = (this.colony.type === 'vertical') ? 'Edificio' : 'Calle';
            });

            if (this.user.role === 'RESIDENT') {

                this.houseService.getResidentByUid(this.colonyId, this.user.id).then(resident => {
                    this.access.residentId = resident.id;
                    this.resident = resident;

                    this.houseService.getHouseByResident(this.colonyId, resident.id).then(house => {
                        this.house = house;
                    });
                });

            } else {

                this.loadResidentsAndAdmins();
                // this.userService.getByColonyAndRole(this.colonyId, 'RESIDENT').then(res => {
                //
                //     console.log(res.docs);
                //
                //     if (res.docs.length > 0) {
                //         res.docs.forEach(d => {
                //             const data = d.data();
                //             const residentMod = {
                //                 id: '',
                //                 name: '',
                //             };
                //
                //             this.houseService.getResidentByUid(this.colonyId, d.id).then(r => {
                //                 if (r) {
                //                     residentMod.id = r.id;
                //                     this.houseService.getHouseByResident(this.colonyId, r.id).then(h => {
                //                         if (h) {
                //                             residentMod.name = data.displayName + ' (' + this.colonyType + ' ' + h.place + ' - #' + h.number + ')';
                //                         }
                //                     });
                //
                //                     if (!this.residents.find(o => o.id === r.id)) {
                //                         this.residents.push(residentMod);
                //                     }
                //                 }
                //             });
                //         });
                //     }
                // });

            }

            if (this.accessId === undefined) {
                this.access.code = moment().unix().toString();
                this.access.startDate = new Date();
                this.access.endDate = new Date();
                this.startDate = moment().format();
                this.endDate = moment().format();

            } else {
                this.loadAccess();
            }

            this.accessTypeService.getAll(this.user.colonyId).subscribe(accessTypes => {
                this.accessTypes = accessTypes;
                // this.showForm = true;
            });

            this.showForm = true;

        });

        this.checkPermissions();
    }

    loadResidentsAndAdmins() {
        this.residents = [];
        this.userService.getByResidentAndAdminByColony(this.colonyId).then(res => {
            if (res.length > 0) {
                const residentsArr = [];
                res.forEach(d => {
                    const data = d.data();
                    const residentMod = {
                        id: d.id,
                        name: data.displayName,
                    };
                    residentsArr.push(residentMod);
                });

                this.residents = residentsArr;
                console.log(this.residents);

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

                console.log(res.callResident);

                this.access.status = res.status;
                this.access.residentId = res.residentId;
                this.access.code = res.code;
                this.access.accessType = res.accessType;
                this.access.callResident = res.callResident;
                this.startDate = new Date(res.startDate.seconds * 1000).toISOString();
                this.endDate = new Date(res.endDate.seconds * 1000).toISOString();

                if (res.residentId !== '') {
                    this.houseService.getResident(this.colonyId, res.residentId).then(resident => {

                        if (resident) {
                            this.resident = resident;
                            this.userService.get(resident.userId).subscribe(user => this.user = user);
                            this.houseService.getHouseByResident(this.colonyId, res.residentId).then(house => {
                                if (house) {
                                    this.house = house;
                                }
                            });
                        }
                    });
                }

                this.personService.getAll(this.accessId, this.colonyId).subscribe(p => {
                    if (p) {
                        this.persons = p;
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

        this.access.startDate = new Date(this.startDate);
        this.access.endDate = new Date(this.endDate);

        this.access.createdBy = (this.user.role === 'RESIDENT') ? 'residente' : (this.user.role === 'SECURITY') ? 'seguridad' : (this.user.role === 'ADMIN') ? 'administrador' : 'superadmin';

        if (this.accessId) {
            this.accessService.update(this.accessId, this.access, this.colonyId).then(() => {
                loading.dismiss();
                this.nav.navigateForward('/list-accesses');
            });
        } else {
            this.access.status = 'pendiente';
            if (this.access.residentId === '') {
                this.toast(2000, 'Debe de seleccionar un residente', 'danger');
            } else {
                this.accessService.add(this.access, this.colonyId).then((result) => {
                    loading.dismiss();
                    this.nav.navigateForward('/access-details/' + this.colonyId + '/' + result.id);
                });
            }
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
        this.personService.remove(id, this.accessId, this.colonyId);
    }

    updateStartDate($event) {
        this.startDate = $event.detail.value;
    }

    updateEndDate($event) {
        this.endDate = $event.detail.value;
    }

    addPerson(data) {

        if (data.name !== '' && data.companions !== '') {
            this.person.name = data.name;
            this.person.companions = data.companions;

            this.personService.add(this.person, this.accessId, this.colonyId).then(() => {
                return true;
            });
        }
    }

    openActionSheet() {

        const btn = [
            // {
            //     text: 'Guardar cambios',
            //     icon: 'save',
            //     handler: () => {
            //         this.saveAccess();
            //     }
            // },
            {
                text: 'Agregar persona',
                icon: 'person',
                handler: () => {
                    this.presentAlertPrompt();
                }
            },
            // {
            //     text: 'Escanear código',
            //     icon: 'qr-scanner',
            //     handler: () => {
            //         this.scanCode();
            //     }
            // },
            {
                text: 'Descargar código QR',
                icon: 'download',
                handler: () => {
                    this.downloadQr();
                }
            },
            {
                text: 'Borrar',
                icon: 'trash',
                handler: () => {
                    this.removeAccesss();
                }
            },
            {
                text: 'Cancelar',
                icon: 'close-circle',
                role: 'cancel'
            }
        ];

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

        await alert.present();
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

        this.userService.get(this.resident.userId).subscribe(res => {
            this.callNumber.callNumber(res.phone, true)
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
        this.access.residentId = null;
        this.loadResidentsAndAdmins();
    }

    confirm() {
        this.selectComponent.confirm();
        console.log(this.house);
        this.loadResidentsAndAdmins();
        this.selectComponent.close();
    }

}
