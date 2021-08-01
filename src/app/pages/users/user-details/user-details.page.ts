import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {AuthService} from '../../../sharedServices/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user.service';
import {StorageService} from '../../../sharedServices/storage.service';
import {Colony} from '../../../models/colony';
import {ColonyService} from '../../colony/colony.service';
import {BasePage} from '../../base/base.page';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResidentService} from '../../resident/resident.service';
import {AdminService} from './admin.service';
import {SecurityService} from '../../security-guard/security.service';
import {Resident} from '../../../models/resident';
import {Admin} from '../../../models/admin';
import {Security} from '../../../models/security';
import {timer} from 'rxjs';
import {HouseService} from '../../resident/house.service';
import {House} from '../../../models/house';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.page.html',
    styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage extends BasePage implements OnInit {

    colonies: Colony[];
    public roles = ['SUPERADMIN', 'ADMIN', 'RESIDENT', 'SECURITY'];
    public userId = null;
    public form: FormGroup;
    public attempt = false;
    public defaultErrorMessage = 'Por favor ingrese un valor válido';
    public colonyType = '';
    public colonyId = null;
    public houses: House[];
    public placeType = null;
    public numberType = null;
    public userRole = null;
    public docId = null;

    constructor(
        private loadingController: LoadingController,
        private authService: AuthService,
        private route: ActivatedRoute,
        private nav: NavController,
        private userService: UserService,
        private router: Router,
        protected storageService: StorageService,
        private colonyService: ColonyService,
        protected toastController: ToastController,
        protected alertController: AlertController,
        private formBuilder: FormBuilder,
        private residentService: ResidentService,
        private adminService: AdminService,
        private securityService: SecurityService,
        private houseService: HouseService,
    ) {
        super(storageService, toastController);
        this.form = formBuilder.group(
            {
                email: ['', Validators.compose([Validators.required, Validators.email])],
                phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
                displayName: ['', Validators.compose([Validators.required, Validators.min(5)])],
                colonyId: ['', Validators.required],
                role: ['', Validators.required],
                profilePicture: this.user.profilePicture,
                houseId: [''],
                uid: [''],
                token: [''],
                createdAt: [this.user.createdAt]
            });

    }

    ngOnInit() {
        this.userId = this.route.snapshot.params.id;

        timer(1000).subscribe(() => {
            // this.user = this.savedUser;

            if (this.userId) {
                this.loadUser();
            }

            this.loadColonies();

        });
    }

    async loadColonies() {
        this.colonyService.getAll().subscribe(res => {
            this.colonies = res;
        });
    }

    async loadUser() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.userService.getByUid(this.userId).then(res => {
            this.docId = res.id;
            this.userRole = res.role;
            this.form.get('uid').setValue(res.uid);
            this.form.get('email').setValue(res.email);
            this.form.get('phone').setValue(res.phone);
            this.form.get('colonyId').setValue(res.colonyId);
            this.form.get('role').setValue(res.role);
            this.form.get('displayName').setValue(res.displayName);
            this.form.get('profilePicture').setValue(res.profilePicture);

            if (res.role === 'RESIDENT' || res.role === 'ADMIN') {
                this.houseService.getResidentByUid(res.colonyId, res.id).then(resident => {
                    this.resident = resident;
                    this.houseService.getHouseByResident(res.colonyId, resident.id).then(house => {
                        this.house = house;
                        this.form.get('houseId').setValue(house.id);

                    });
                });
            }

            loading.dismiss();
        });
    }

    async saveUser() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        if (this.form.valid) {
            if (this.userId) {

                // Update
                this.user.email = this.form.value.email;
                this.user.phone = this.form.value.phone;
                this.user.role = this.form.value.role;
                this.user.displayName = this.form.value.displayName;
                this.user.colonyId = this.form.value.colonyId;

                this.userService.update(this.form.value, this.docId).then(() => {

                    if (this.user.role === 'RESIDENT') {
                        if (this.house.id !== this.form.value.houseId) {
                            this.residentService.add(this.resident, this.form.value.colonyId, this.form.value.houseId)
                                .then(() => {}, e => console.log(e));
                            this.residentService.remove(this.resident.id, this.form.value.colonyId, this.form.value.houseId)
                                .then(() => {}, e => console.log(e));
                        }
                    }

                    this.attempt = false;
                    this.nav.navigateForward('/list-users');
                });
            } else {

                this.authService.afAuth.createUserWithEmailAndPassword(this.form.value.email, 'user123')
                    .then((res) => {
                        this.authService.afAuth.currentUser.then(u => u.sendEmailVerification())
                            .then(async () => {
                              // create new
                              this.form.get('uid').setValue(await this.authService.afAuth.currentUser.then(u => u.uid));
                              this.userService.add(this.form.value).then((user) => {
                                if (this.form.value.role === 'RESIDENT') {
                                  const resid: Resident = {
                                    userId: user.id,
                                    createdAt: this.user.createdAt
                                  };
                                  this.residentService.add(resid, this.form.value.colonyId, this.form.value.houseId).then(() => {
                                  });
                                } else if (this.form.value.role === 'ADMIN') {
                                  const adm: Admin = {
                                    userId: user.id,
                                    createdAt: this.user.createdAt
                                  };

                                  const resid: Resident = {
                                    userId: user.id,
                                    createdAt: this.user.createdAt
                                  };
                                  this.residentService.add(resid, this.form.value.colonyId, this.form.value.houseId).then(() => {
                                  });
                                  this.adminService.add(adm, this.form.value.colonyId).then(() => {
                                  });
                                } else if (this.form.value.role === 'SECURITY') {
                                  const secur: Security = {
                                    userId: user.id,
                                    createdAt: this.user.createdAt
                                  };

                                  this.securityService.add(secur, this.form.value.colonyId).then(() => {
                                  });
                                }
                                this.attempt = false;
                                this.nav.navigateForward('/list-users');
                              });
                            });
                    }).catch((error) => {
                    console.log('Error registering user', error.message);
                    this.toast(2000, 'Error al registrar el usuario', 'danger');
                });
            }
        } else {
            this.attempt = true;
        }

        loading.dismiss();
    }

    async confirmMessage() {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar al usuario?',
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
                        this.removeUser();
                    }
                }
            ]
        });

        await alert.present();
    }

    removeUser() {
        this.userService.remove(this.userId);
        this.nav.navigateForward('/list-users');
    }

    colonyChange($event) {
        this.colonyId = $event.detail.value;

        this.colonyService.get($event.detail.value).subscribe(col => {
            this.placeType = (col.type === 'vertical') ? 'Edificio' : 'Calle';
            this.numberType = (col.type === 'vertical') ? 'Departamento' : 'Número';
        });

        this.houseService.getAll($event.detail.value).subscribe(houses => {
            this.houses = houses;
        });
    }

    async addHouseAlert() {
        const alert = await this.alertController.create({
            header: 'Agregar ubicación',
            inputs: [
                {
                    name: 'place',
                    type: 'text',
                    placeholder: this.placeType,
                },
                {
                    name: 'number',
                    type: 'text',
                    placeholder: this.numberType,
                },
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        console.log('Confirm Ok');
                        this.addHouse(data);
                    }
                }
            ]
        });

        await alert.present();
    }

    addHouse(data) {
        if (data.name !== '') {
            const h: House = {
                number: data.number,
                place: data.place,
                createdAt: this.house.createdAt
            };
            this.houseService.add(h, this.form.value.colonyId).then(() => {
                return true;
            });
        }
    }

    async deleteHouseAlert(id: string) {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que deseas eliminar el departamento seleccionado?',
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
                        this.deleteHouse(id);
                    }
                }
            ]
        });

        await alert.present();
    }

    deleteHouse(id: string) {
        const colonyId = this.form.value.colonyId;
        this.houseService.getResidentsByHouse(colonyId, id).then(res => {
            if (res.length > 0) {
                this.toast(4000, 'No se puede eliminar la ubicación porque tiene residentes asociados', 'danger');
            } else {
                this.form.get('houseId').setValue('');
                this.houseService.remove(id, colonyId);
                this.toast(2000, 'Ubicación eliminada correctamente', 'success');
            }
        });
    }
}
