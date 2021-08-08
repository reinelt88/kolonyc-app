import {Component, OnInit} from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular';
import {ColonyService} from '../colony.service';
import {Colony} from '../../../models/colony';
import {BasePage} from '../../base/base.page';
import {StorageService} from '../../../sharedServices/storage.service';

@Component({
  selector: 'app-list-colonies',
  templateUrl: './list-colonies.page.html',
  styleUrls: ['./list-colonies.page.scss'],
})
export class ListColoniesPage extends BasePage implements OnInit {

  colonies: Colony[];

  constructor(
    private loadingController: LoadingController,
    private colonyServices: ColonyService,
    protected toastController: ToastController,
    protected storageService: StorageService,
  ) {
    super(storageService, toastController);
  }

  ngOnInit() {
    this.loadColonies();
  }

  async loadColonies() {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    this.colonyServices.getAll().subscribe(res => {
      loading.dismiss();

      this.colonies = res;

    });

  }

}
