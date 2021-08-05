import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../../../sharedServices/storage.service';
import {User} from '../../../models/user';
import {ColonyService} from '../../colony/colony.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {UserService} from '../../users/user.service';
import {BasePage} from '../../base/base.page';
import {timer} from 'rxjs';
import {HouseService} from '../house.service';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
    selector: 'app-list-residents',
    templateUrl: './list-residents.page.html',
    styleUrls: ['./list-residents.page.scss'],
})

export class ListResidentsPage extends BasePage implements OnInit {

    user: User;

    residentsList = [];
    public colonyType = '';
    public colonyId = null;
    public houses = [];
    public house = null;

    // @ts-ignore
    @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;

    constructor(
        protected storageService: StorageService,
        protected toastController: ToastController,
        private loadingController: LoadingController,
        private userService: UserService,
        private colonyService: ColonyService,
        private houseService: HouseService,
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.residentsList = [];
        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            this.colonyService.get(this.user.colonyId).subscribe(col => {
                this.colony = col;
                this.colonyType = (this.colony.type === 'vertical') ? 'Edificio' : 'Calle';
                this.houseService.getAll(this.user.colonyId).subscribe(houses => {
                    houses.forEach(house => {
                        if (!this.houses.find(h => h.place === house.place)) {
                            this.houses.push(house);
                        }
                    });
                });
            });
            this.loadResidents();
        });
    }

    async loadResidents() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.residentsList = [];
        this.userService.getByColonyAndRole(this.user.colonyId, 'RESIDENT').then(res => {
            if (res.docs.length > 0) {
                this.proccessList(res.docs);
            }
        });

        loading.dismiss();
    }

    proccessList(res) {
        res.forEach(resident => {

            const data = resident.data();

            const resMod: any = {
                id: resident.id,
                profilePicture: data.profilePicture,
                colonyName: '',
                name: data.displayName,
                place: '',
                number: '',
            };

            this.colonyService.get(data.colonyId).subscribe(colony => {
                if (colony) {
                    resMod.colonyName = colony.name;

                    this.houseService.get(data.houseId, data.colonyId).subscribe(house => {
                        if (house) {

                            resMod.place = house.place;
                            resMod.number = house.number;

                            if (this.house === null) {
                                if (!this.residentsList.find(o => o.id === resMod.id)) {
                                    this.residentsList.push(resMod);
                                }
                            } else {
                                if (this.house.place === house.place) {
                                    if (!this.residentsList.find(o => o.id === resMod.id)) {
                                        this.residentsList.push(resMod);
                                    }
                                }
                            }
                        }
                    });
                }
            });
        });
    }

    clear() {
        this.selectComponent.clear();
        this.selectComponent.close();
        this.house = null;
        this.loadResidents();
    }

    confirm() {
        this.selectComponent.confirm();
        this.loadResidents();
        this.selectComponent.close();
    }
}
