import { Component, OnInit } from '@angular/core';
import {ToastController} from '@ionic/angular';
import {StorageService} from '../../../sharedServices/storage.service';
import {BasePage} from '../../base/base.page';
import {Router} from '@angular/router';
import {timer} from 'rxjs';

@Component({
  selector: 'app-payment-home',
  templateUrl: './payment-home.page.html',
  styleUrls: ['./payment-home.page.scss'],
})
export class PaymentHomePage extends BasePage implements OnInit {

  public show = false;
  constructor(
      protected toastController: ToastController,
      protected storageService: StorageService,
  ) {
    super(storageService, toastController);
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    timer(1000).subscribe(() => {
      this.user = this.savedUser;
      this.show = true;
    });
  }


}
