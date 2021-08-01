import { Component, OnInit } from '@angular/core';
import {Area} from '../../../models/area';
import {BasePage} from '../../base/base.page';
import {LoadingController, ToastController} from '@ionic/angular';
import {StorageService} from '../../../sharedServices/storage.service';
import {AreaService} from '../area.service';
import {timer} from 'rxjs';

@Component({
  selector: 'app-list-areas',
  templateUrl: './list-areas.page.html',
  styleUrls: ['./list-areas.page.scss'],
})
export class ListAreasPage extends BasePage implements OnInit {

  areas: Area[];

  constructor(
      private loadingController: LoadingController,
      private areaService: AreaService,
      protected toastController: ToastController,
      protected storageService: StorageService,
  ) {
    super(storageService, toastController);
  }

  ngOnInit() {
    timer(1000).subscribe(() => {
      this.user = this.savedUser;
      this.loadAreas();
    });
  }

  async loadAreas() {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    this.areaService.getAll(this.user.colonyId).subscribe(res => {
      loading.dismiss();
      this.areas = res;
    });

  }

}
