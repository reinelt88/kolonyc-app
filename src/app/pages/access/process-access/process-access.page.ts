import {Component, OnInit} from '@angular/core';
import {BasePage} from '../../base/base.page';
import {StorageService} from '../../../sharedServices/storage.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {AccessService} from '../access.service';
import {PersonService} from '../../person/person.service';
import {Person} from '../../../models/person';
import {HouseService} from '../../resident/house.service';
import {ColonyService} from '../../colony/colony.service';
import {timer} from 'rxjs';
import {UserService} from '../../users/user.service';
import {CallNumber} from '@ionic-native/call-number/ngx';

@Component({
    selector: 'app-process-access',
    templateUrl: './process-access.page.html',
    styleUrls: ['./process-access.page.scss'],
})
export class ProcessAccessPage extends BasePage implements OnInit {

    persons: Person[];
    startDate: string;
    endDate: string;
    barcodeData = null;
    message: string;
    public colonyId = null;
    public colonyType = '';

    constructor(
        protected storageService: StorageService,
        private loadingController: LoadingController,
        protected toastController: ToastController,
        private barcodeScanner: BarcodeScanner,
        private accessService: AccessService,
        private personService: PersonService,
        private houseService: HouseService,
        private colonyService: ColonyService,
        private userService: UserService,
        private callNumber: CallNumber,
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {
        timer(1000).subscribe(() => {
            this.colonyService.get(this.savedUser.colonyId).subscribe(col => {
                this.colony = col;
                this.colonyType = (this.colony.type === 'vertical') ? 'Edificio' : 'Calle';
            });
        });
    }

    async scanCode() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();
        this.barcodeScanner.scan().then(barcodeData => {

            this.barcodeData = barcodeData.text;
            this.accessService.getByCode(this.savedUser.colonyId, this.barcodeData).then(access => {
                if (access.docs.length > 0) {
                    // @ts-ignore
                    this.access = access.docs[0].data();
                    this.access.id = access.docs[0].id;
                    this.startDate = new Date(this.access.startDate.seconds * 1000).toISOString();
                    this.endDate = new Date(this.access.endDate.seconds * 1000).toISOString();
                    this.colonyId = this.savedUser.colonyId;
                    this.personService.getAll(access.docs[0].id, this.savedUser.colonyId).subscribe(persons => {
                        if (persons.length > 0) {
                            this.persons = persons;
                        } else {
                            this.person.name = 'Desconocido';
                            this.person.companions = 0;
                            this.personService.add(this.person, access.docs[0].id, this.savedUser.colonyId).then( () => {
                               this.persons.push(this.person);
                            });
                        }
                    });
                    this.houseService.get(this.access.houseId, this.colonyId).subscribe(house => this.house = house);
                }
            });
        });

        loading.dismiss();
    }

    makeCall() {
        this.userService.getByColonyAndHouse(this.savedUser.colonyId, this.access.houseId).then(users => {
            const userData = users.docs[0].data(); // TODO: Hacer correctamente que seleccione a que residente llamar
            this.callNumber.callNumber(userData.phone, true)
                .then(r => console.log('Launched dialer!', r))
                .catch(err => console.log('Error launching dialer', err));
        });
    }

}
