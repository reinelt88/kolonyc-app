import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {ColonyService} from '../../colony/colony.service';
import {BasePage} from '../../base/base.page';
import {StorageService} from '../../../sharedServices/storage.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.page.html',
  styleUrls: ['./list-users.page.scss'],
})
export class ListUsersPage extends BasePage implements OnInit {

  users = [];

  constructor(
    private userService: UserService,
    private colonyService: ColonyService,
    private loadingController: LoadingController,
    protected storageService: StorageService,
    protected toastController: ToastController
  ) {
    super(storageService, toastController);
    this.loadUsers();
  }

  ngOnInit() {

  }

  async loadUsers() {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    this.userService.getAll().subscribe((data) => {

      this.users = [];
      data.forEach(user => {

        const userMod: any = {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          colonyName: '',
          profilePicture: user.profilePicture,
          role: user.role
        };

        if (user.colonyId !== undefined && user.colonyId !== '') {
          this.colonyService.get(user.colonyId).subscribe((colony) => {
            userMod.colonyName = colony.name;
          });
        }

        this.users.push(userMod);
      });
    });

    loading.dismiss();

  }
}
