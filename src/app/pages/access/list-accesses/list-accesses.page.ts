import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../../sharedServices/storage.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {UserService} from '../../users/user.service';
import {ColonyService} from '../../colony/colony.service';
import {AccessService} from '../access.service';
import {ResidentService} from '../../resident/resident.service';
import {BasePage} from '../../base/base.page';
import {Colony} from '../../../models/colony';
import {timer} from 'rxjs';
import {PersonService} from '../../person/person.service';
import {HouseService} from '../../resident/house.service';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {AccessTypeService} from '../accessType/accessType.service';

@Component({
    selector: 'app-list-accesses',
    templateUrl: './list-accesses.page.html',
    styleUrls: ['./list-accesses.page.scss']
})
export class ListAccessesPage extends BasePage implements OnInit {

    public accesses = [];
    public colonyId = null;
    public colonies: Colony[];
    public searchTerm = null;
    public accessStatus = ['pendiente', 'completado', 'en curso'];
    public selectedStatus = null;

    constructor(
        protected storageService: StorageService,
        private loadingController: LoadingController,
        private userService: UserService,
        private colonyService: ColonyService,
        private accessService: AccessService,
        private residentService: ResidentService,
        protected toastController: ToastController,
        private colonyServices: ColonyService,
        private personService: PersonService,
        private houseService: HouseService,
        private keyboard: Keyboard,
        private accessTypeService: AccessTypeService
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {
        timer(1000).subscribe(() => {
            this.user = this.savedUser;

            if (this.user.role === 'SUPERADMIN') {
                this.loadColonies();
            } else {
                this.colonyId = this.user.colonyId;
            }

            this.loadAccesses();
        });
    }

    ionViewWillEnter() {

    }

    search($event) {
        const query = $event.target.value;

        if (!query) {
            this.loadAccesses();
        }

        this.accesses = this.accesses.filter((access) => {
            return JSON.stringify(access).toLowerCase().indexOf(query.toLowerCase()) > -1;
        });

        console.log(query, this.accesses.length);
    }

    loadColonies() {
        this.colonyServices.getAll().subscribe(res => {
            this.colonyId = res[0].id;
            this.colonies = res;
        });
    }

    async loadAccesses() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        if (this.user.role === 'RESIDENT') {

            this.houseService.getResidentByUid(this.colonyId, this.user.id).then(resident => {
                    this.accessService.getAllByResidentId(this.colonyId, resident.id).subscribe(res => {
                        this.accesses = [];
                        this.processAccesses(res);
                    });
            });

        } else {
            this.accessService.getAll(this.colonyId).subscribe(res => {
                this.accesses = [];
                this.processAccesses(res);
            });
        }

        loading.dismiss();
    }

    processAccesses(res) {

        const personNames = [];
        res.forEach(access => {

            const accessMod: any = {
                id: access.id,
                startDate:  new Date(access.startDate.seconds * 1000).toISOString(),
                endDate: new Date(access.endDate.seconds * 1000).toISOString(),
                status: access.status,
                resident: '',
                code: access.code,
                place: '',
                number: '',
                persons: '',
                colonyType: '',
                accessType: 'Ninguno',
                createdBy: access.createdBy
            };

            this.personService.getAll(access.id, this.colonyId).subscribe(persons => {

                if (persons.length > 0 && personNames.length < persons.length) {
                    persons.forEach(p => {
                        personNames.push(p.name);
                    });

                    accessMod.persons = personNames.join(', ');
                }
            });

            if (access.accessType) {
                this.accessTypeService.get(access.accessType, this.user.colonyId).subscribe(accessTypeRes => {
                    accessMod.accessType = accessTypeRes.name;
                });
            }

            this.colonyService.get(this.colonyId).subscribe(colony => {
                accessMod.colonyType = (colony.type === 'vertical') ? 'Edificio' : 'Calle';
            });

            if (access.residentId !== '') {

                this.houseService.getResident(this.colonyId, access.residentId).then(resident => {
                   if (resident) {
                       this.userService.get(resident.userId).subscribe(user => {
                           if (user) {
                               accessMod.resident = user.displayName;
                           }
                       });
                   }
                });

                this.houseService.getHouseByResident(this.colonyId, access.residentId).then(house => {
                    accessMod.place = house.place;
                    accessMod.number = house.number;
                });

            }

            if (this.selectedStatus === null) {
                this.accesses.push(accessMod);
            } else {
                if (accessMod.status === this.selectedStatus) {
                    this.accesses.push(accessMod);
                }
            }

        });
    }

    statusChange($event) {
        this.selectedStatus = $event.detail.value;
        this.loadAccesses();
    }

    colonyChange($event) {
        this.colonyId = $event.detail.value;
        this.loadAccesses();
    }

    hideKeyboard() {
        this.keyboard.hide();
    }

}
