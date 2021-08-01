import { Component, OnInit } from '@angular/core';
import {BasePage} from '../../base/base.page';
import {ToastController} from '@ionic/angular';
import {StorageService} from '../../../sharedServices/storage.service';

@Component({
  selector: 'app-finances-home',
  templateUrl: './finances-home.page.html',
  styleUrls: ['./finances-home.page.scss'],
})
export class FinancesHomePage extends BasePage implements OnInit {

  constructor(
      protected toastController: ToastController,
      protected storageService: StorageService,
  ) {
    super(storageService, toastController);
  }

  ngOnInit() {
  }

}
