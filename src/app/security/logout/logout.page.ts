import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController} from '@ionic/angular';
import {AuthService} from '../../sharedServices/auth.service';
import {Router} from '@angular/router';
import {StorageService} from '../../sharedServices/storage.service';
import {BasePage} from '../../pages/base/base.page';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage extends BasePage implements OnInit {

  constructor(
      private authService: AuthService,
      private router: Router,
      private angularFireAuth: AngularFireAuth,
      private menuController: MenuController,
      protected toastController: ToastController,
      protected storageService: StorageService,
  ) {
    super(storageService, toastController);
  }

  ngOnInit() {
  }

  logout() {
    this.storageService.remove('user');
    this.storageService.clear();
    this.menuController.close();
    this.savedUser = null;
    this.storageService.setObject('user', null);
    this.angularFireAuth.signOut().then(() => {
      this.router.navigateByUrl('/login');
    });
  }

  ionViewWillEnter() {
      this.logout();
  }

}
