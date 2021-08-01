import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../../sharedServices/storage.service';
import {ColonyService} from '../../colony/colony.service';
import {User} from '../../../models/user';
import {UserService} from '../../users/user.service';
import {AuthService} from '../../../sharedServices/auth.service';
import {ResidentService} from '../resident.service';
import {BasePage} from '../../base/base.page';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {HouseService} from '../house.service';
import {timer} from 'rxjs';
import {House} from '../../../models/house';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
    selector: 'app-resident-details',
    templateUrl: './resident-details.page.html',
    styleUrls: ['./resident-details.page.scss'],
})
export class ResidentDetailsPage extends BasePage implements OnInit {

    residentId = null;
    public form: FormGroup;
    public attempt = false;
    public defaultErrorMessage = 'Por favor ingrese un valor válido';
    public houses: House[];
    public placeType = null;
    public selectedHouse = null;

    @ViewChild('selectComponent', {static: false}) selectComponent: IonicSelectableComponent;
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
        private residentService: ResidentService,
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private keyboard: Keyboard,
        private houseService: HouseService,
    ) {
        super(storageService, toastController);

        this.form = formBuilder.group(
            {
                email: ['', Validators.compose([Validators.required, Validators.email])],
                displayName: ['', Validators.compose([Validators.required, Validators.min(5)])],
                profilePicture: this.noImage,
                phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
                house: ['']
            });

    }

    ngOnInit() {

        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            this.residentId = this.route.snapshot.params.id;

            this.colonyService.get(this.user.colonyId).subscribe(col => {
                this.colony = col;
                this.placeType = (this.colony.type === 'vertical') ? 'Edificio' : 'Calle';
                this.allPlaces(this.residentId);
            });

            if (this.residentId) {
                this.loadResident();
            }
        });
    }

    allPlaces(residentId) {
        this.houseService.getAll(this.user.colonyId).subscribe(home => {
            // this.houses = home
            const arrHouses = [];
            home.forEach(h => {
                const obj: any = {
                    id: h.id,
                    place: this.placeType + ' ' + h.place + ' - # ' + h.number,
                };

                if (residentId === null || residentId === undefined ) {
                    arrHouses.push(obj);
                } else {
                    this.houseService.getHouseByResident(this.user.colonyId, this.residentId).then(house => {
                        if (house.id === h.id) {
                            arrHouses.push(obj);
                            this.selectedHouse = obj;
                        }
                    });
                }
            });
            this.houses = arrHouses;
        });
    }

    async loadResident() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.houseService.getHouseByResident(this.user.colonyId, this.residentId).then(house => {
            this.house = house;
            // this.form.get('house').setValue(house.id);
            this.selectedHouse = house;
        });

        this.houseService.getResident(this.user.colonyId, this.residentId).then(resident => {
            this.resident = resident;
            const userId = this.resident.userId;
            if (userId !== '') {
                this.userService.get(userId).subscribe(user => {
                    this.user = user;
                    this.user.id = userId;
                    this.form.get('email').setValue(user.email);
                    this.form.get('displayName').setValue(user.displayName);
                    this.form.get('phone').setValue(user.phone);
                    loading.dismiss();
                });
            }
        });

    }

    removeResident() {
        this.residentService.remove(this.residentId, this.user.colonyId, this.house.id);
        this.nav.navigateForward('/list-residents');
    }

    async saveResident() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        if (this.form.valid) {
            if (this.selectedHouse !== null && this.selectedHouse !== undefined) {
                // Si se hace un update del residente
                if (this.residentId) {

                    this.resident.userId = this.user.id;

                    if (this.house.id !== this.selectedHouse.id) { // si cambia de casa

                        this.residentService.remove(this.residentId, this.user.colonyId, this.house.id).then(() => {});  // eliminamos el residente de la casa anterior
                        this.residentService.add(this.resident, this.user.colonyId, this.selectedHouse.id).then(() => { // se añade el residente en otra casa
                            this.user.displayName = this.form.value.displayName;
                            this.user.email = this.form.value.email;
                            this.user.phone = this.form.value.phone;
                            this.userService.update(this.user, this.resident.userId).then(() => {
                                this.attempt = false;
                                this.nav.navigateForward('/list-residents');
                            });
                        });
                    } else { // si se mantiene en la misma casa se hace el update

                        this.residentService.update(this.residentId, this.resident, this.user.colonyId, this.selectedHouse.id).then(() => {

                            this.user.displayName = this.form.value.displayName;
                            this.user.email = this.form.value.email;
                            this.user.phone = this.form.value.phone;
                            this.userService.update(this.user, this.resident.userId).then(() => {
                                this.attempt = false;
                                this.nav.navigateForward('/list-residents');
                            });
                        });
                    }

                } else { // Creando residente

                    this.authService.afAuth.createUserWithEmailAndPassword(this.form.value.email, 'user123')
                        .then(() => {
                            this.authService.afAuth.currentUser.then(u => u.sendEmailVerification())
                                .then(async () => {
                                  // create new

                                  const user: User = {
                                    uid: await this.authService.afAuth.currentUser.then(u => u.uid),
                                    email: this.form.value.email,
                                    phone: this.form.value.phone,
                                    password: 'user123',
                                    role: 'RESIDENT',
                                    displayName: this.form.value.displayName,
                                    profilePicture: this.noImage,
                                    colonyId: this.user.colonyId,
                                    token: '',
                                    createdAt: this.user.createdAt
                                  };

                                  this.userService.add(user).then(docRef => {

                                    this.resident.userId = docRef.id;

                                    this.residentService.add(this.resident, this.user.colonyId, this.selectedHouse.id).then(() => {
                                      this.attempt = false;
                                      this.nav.navigateForward('/list-residents');
                                    });
                                  });

                                });
                        }).catch((error) => {
                        error.log('Error registering user', error.message);
                    });

                }
            } else {
                this.toast(2000, 'Debe de seleccionar una ubicación', 'danger');
            }
        } else {
            this.attempt = true;
        }

        loading.dismiss();

    }

    async confirmMessage() {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar al residente?',
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
                        this.removeResident();
                    }
                }
            ]
        });

        await alert.present();
    }

    hideKeyboard() {
        this.keyboard.hide();
    }

    async addHouseAlert() {
        const alert = await this.alertController.create({
            header: 'Agregar ' + this.placeType,
            inputs: [
                {
                    name: 'place',
                    type: 'text',
                    placeholder: this.placeType,
                },
                {
                    name: 'number',
                    type: 'text',
                    placeholder: 'Número',
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
        if (data.place !== '' && data.number !== '') {
            const h: House = {
                number: data.number,
                place: data.place,
                createdAt: this.house.createdAt
            };

            this.houseService.getByPlaceAndNumber(this.user.colonyId, data.place, data.number).then(res => {
                if (res !== null) {
                    this.toast(2000, 'La ubicación ingresada ya se encuentra en el sistema', 'danger');
                } else {
                    this.houseService.add(h, this.user.colonyId).then(() => {
                        this.toast(2000, 'Ubicación agregada correctamente', 'success');
                    });
                }
            });

        } else {
            this.toast(2000, 'Debe ingresar los datos correspondientes', 'danger');
        }
    }

    // deleteHouseAlert() {
    //     debugger;
    //     this.selectComponent.confirm();
    //     const lala = this.selectComponent.hasValue();
    //     const ll = this.selectedHouse;
    // }

    async deleteHouseAlert() {
        this.selectComponent.confirm();

        if (this.selectedHouse != null) {
            const alert = await this.alertController.create({
                header: 'Confirmación',
                message: 'Estas seguro que deseas eliminar la ubicación seleccionada?',
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
                            this.deleteHouse(this.selectedHouse);
                        }
                    }
                ]
            });
            await alert.present();
        } else {
            this.toast(2000, 'Es necesario seleccionar una ubicación para eliminarla', 'danger');
        }
    }

    deleteHouse(house) {
        this.houseService.getResidentsByHouse(this.user.colonyId, house.id).then(res => {
            if (res.length > 0) {
                this.toast(2000, 'No se puede eliminar la ubicación porque tiene residentes asociados', 'danger');
            } else {
                this.form.get('house').setValue('');
                this.houseService.remove(house.id, this.user.colonyId);
                this.toast(2000, 'Ubicación eliminada correctamente', 'success');
            }
        });
    }

    clear() {
        this.selectComponent.clear();
        this.selectedHouse = null;
        this.allPlaces(null);
        if (this.residentId === null || this.residentId === undefined) {
            this.selectComponent.close();
        }
    }

    confirm() {
        this.selectComponent.confirm();
        // this.loadPayments();
        this.selectComponent.close();
    }

}
