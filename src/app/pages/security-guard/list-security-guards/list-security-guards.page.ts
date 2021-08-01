import { Component, OnInit } from '@angular/core';
import {StorageService} from '../../../sharedServices/storage.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {UserService} from '../../users/user.service';
import {ColonyService} from '../../colony/colony.service';
import {SecurityService} from '../security.service';
import {BasePage} from '../../base/base.page';
import {User} from '../../../models/user';

@Component({
  selector: 'app-list-security-guards',
  templateUrl: './list-security-guards.page.html',
  styleUrls: ['./list-security-guards.page.scss'],
})
export class ListSecurityGuardsPage extends BasePage implements OnInit {

  user: User;

  securitiesList = [];

  constructor(
      protected storageService: StorageService,
      protected toastController: ToastController,
      private loadingController: LoadingController,
      private userService: UserService,
      private colonyService: ColonyService,
      private securityService: SecurityService,
  ) {
    super(storageService, toastController);
    this.loadSecurities();
  }

  ngOnInit() {
  }

  async loadSecurities() {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    this.securityService.getAll(this.savedUser.colonyId).subscribe(res => {

      this.securitiesList = [];
      res.forEach(security => {

        const secMod: any = {
          id: security.id,
          profilePicture: '',
          colonyName: '',
          name: ''
        };

        this.userService.get(security.userId).subscribe(user => {
          secMod.profilePicture = user.profilePicture;
          secMod.name = user.displayName;

          this.colonyService.get(user.colonyId).subscribe(colony => {
            secMod.colonyName = colony.name;
          });

        });

        this.securitiesList.push(secMod);
        if (!this.securitiesList.find(o => o.id === secMod.id)) {
          this.securitiesList.push(secMod);
        }

      });

    });

    loading.dismiss();
  }

}
