import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../../../sharedServices/storage.service';
import {User} from '../../../models/user';
import {ColonyService} from '../../colony/colony.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {UserService} from '../../users/user.service';
import {ResidentService} from '../resident.service';
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
        private residentService: ResidentService,
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
        if (this.house === null) {
            this.houseService.getAll(this.user.colonyId).subscribe(houses => {
                this.residentsList = [];
                houses.forEach(h => {
                  this.userService.getResidentsByHouse(h.id).then(res => {
                    if (!res.empty) {
                      const residents: any = [];
                      res.docs.forEach(d => {
                        const data: any = d.data();
                        data.id = d.id;
                        residents.push(data);
                      });
                      this.proccessList(residents, h);
                    }
                  }, error => console.log(error));
                });
            });
        } else {
            this.residentsList = [];
            this.houseService.get(this.house.id, this.user.colonyId).subscribe(house => {
                this.houseService.getByAllByPlace(this.user.colonyId, house.place).then(houses => {
                  this.residentsList = [];
                  houses.forEach(h => {
                    this.userService.getResidentsByHouse(h.id).then(res => {
                      if (!res.empty) {
                        const residents: any = [];
                        res.docs.forEach(d => {
                          const data: any = d.data();
                          data.id = d.id;
                          residents.push(data);
                        });
                        this.proccessList(residents, h);
                      }
                    }, error => console.log(error));
                  });
                });
            });
        }

        loading.dismiss();
    }

    proccessList(res, h) {
        res.forEach(resident => {
            const resMod: any = {
                id: resident.id,
                profilePicture: resident.profilePicture,
                colonyName: '',
                name: resident.displayName,
                place: h.place,
                number: h.number,
            };

            this.colonyService.get(resident.colonyId).subscribe(colony => {
                resMod.colonyName = colony.name;
            });

            this.residentsList.push(resMod);
            if (!this.residentsList.find(o => o.id === resMod.id)) {
                this.residentsList.push(resMod);
            }

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
        console.log(this.house);
        this.loadResidents();
        this.selectComponent.close();
    }
}
