import {Component, OnInit} from '@angular/core';
import {BasePage} from '../../../base/base.page';
import {LoadingController, ToastController} from '@ionic/angular';
import {StorageService} from '../../../../sharedServices/storage.service';
import {AccessTypeService} from '../accessType.service';
import {timer} from 'rxjs';

@Component({
  selector: 'app-list-access-types',
  templateUrl: './list-access-types.page.html',
  styleUrls: ['./list-access-types.page.scss'],
})
export class ListAccessTypesPage extends BasePage implements OnInit {

  public types = [];

  constructor(
    private loadingController: LoadingController,
    private typeService: AccessTypeService,
    protected toastController: ToastController,
    protected storageService: StorageService,
  ) {
    super(storageService, toastController);
  }

  ngOnInit() {
    timer(1000).subscribe(() => {
      this.user = this.savedUser;
      this.loadTypes();
    });
  }

  async loadTypes() {

    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    this.typeService.getAll(this.user.colonyId).subscribe(res => {
      this.types = res;
    });

    loading.dismiss();
  }

}
