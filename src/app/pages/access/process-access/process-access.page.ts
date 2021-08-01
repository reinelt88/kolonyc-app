import {Component, OnInit} from '@angular/core';
import {BasePage} from '../../base/base.page';
import {StorageService} from '../../../sharedServices/storage.service';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {AccessService} from '../access.service';
import {PersonService} from '../../person/person.service';
import {Access} from '../../../models/access';
import {ResidentService} from '../../resident/resident.service';
import {Resident} from '../../../models/resident';
import {Person} from '../../../models/person';
import {UserService} from '../../users/user.service';
import {HouseService} from '../../resident/house.service';

@Component({
    selector: 'app-process-access',
    templateUrl: './process-access.page.html',
    styleUrls: ['./process-access.page.scss'],
})
export class ProcessAccessPage extends BasePage implements OnInit {

    access: Access;
    resident: Resident;
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
        private residentService: ResidentService,
        private userService: UserService,
        private houseService: HouseService,
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {
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
            this.accessService.getAll(this.savedUser.colonyId).subscribe(accesses => {
                accesses.forEach(access => {

                    // if (access.code === '1578410524') {
                    if (access.code === this.barcodeData) {
                        this.access = access;
                        this.startDate = new Date(access.startDate.seconds * 1000).toISOString();
                        this.endDate = new Date(access.endDate.seconds * 1000).toISOString();
                        this.colonyId = this.savedUser.colonyId;
                        this.houseService.getResident(this.colonyId, access.residentId).then(resident => {
                            this.resident = resident;
                            this.userService.get(resident.userId).subscribe(user => this.user = user);
                        });

                        this.personService.getAll(access.id, this.savedUser.colonyId).subscribe(persons => {
                            this.persons = persons;
                        });
                    }
                });
            });
        });

        loading.dismiss();
    }

}
