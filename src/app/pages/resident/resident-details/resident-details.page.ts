import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../../sharedServices/storage.service';
import {ColonyService} from '../../colony/colony.service';
import {User} from '../../../models/user';
import {UserService} from '../../users/user.service';
import {AuthService} from '../../../sharedServices/auth.service';
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

    @ViewChild('selectComponent', {static: false}) selectComponent: IonicSelectableComponent;
    public residentId = null;
    public form: FormGroup;
    public attempt = false;
    public defaultErrorMessage = 'Por favor ingrese un valor válido';
    public houses: House[];
    public placeType = null;
    public selectedHouse = null;

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
                    this.userService.get(this.residentId).subscribe(resident => {
                        if (resident.houseId === h.id) {
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

        this.userService.get(this.residentId).subscribe(resident => {

            this.user = resident;
            this.form.get('email').setValue(resident.email);
            this.form.get('displayName').setValue(resident.displayName);
            this.form.get('phone').setValue(resident.phone);

            this.houseService.get(resident.houseId, this.user.colonyId).subscribe(house => {

                this.house = house;
                this.house.id = resident.houseId;
                this.selectedHouse = house;
            });

            loading.dismiss();
        });
    }

    removeResident() {
        this.userService.remove(this.residentId);
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
                    this.user.displayName = this.form.value.displayName;
                    this.user.email = this.form.value.email;
                    this.user.phone = this.form.value.phone;
                    this.user.houseId = this.selectedHouse.id;
                    this.userService.update(this.user, this.residentId).then(() => {
                        this.attempt = false;
                        this.nav.navigateForward('/list-residents');
                    });
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
                                    connected: false,
                                    createdAt: this.user.createdAt,
                                    houseId: this.selectedHouse.id,
                                    savedProducts: []
                                  };

                                  this.userService.add(user).then(docRef => {
                                    this.nav.navigateForward('/list-residents');
                                  });

                                });
                        }).catch((error: Error) => {
                        console.log('Error registering user', error.message);
                        this.toast(2000, error.message, 'danger');
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
        this.userService.getByColonyAndHouse(this.user.colonyId, house.id).then(res => {
            if (res.docs.length > 0) {
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
