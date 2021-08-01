import { Component, OnInit } from '@angular/core';
import {BasePage} from '../../base/base.page';
import {LoadingController, ToastController} from '@ionic/angular';
import {StorageService} from '../../../sharedServices/storage.service';
import {MarketplaceCategoryService} from '../marketplaceCategory.service';
import {Colony} from '../../../models/colony';
import {MarketplaceCategory} from '../../../models/marketplaceCategory';

@Component({
  selector: 'app-list-marketplace-categories',
  templateUrl: './list-marketplace-categories.page.html',
  styleUrls: ['./list-marketplace-categories.page.scss'],
})
export class ListMarketplaceCategoriesPage extends BasePage implements OnInit {

  public categories: MarketplaceCategory[];

  constructor(
      private marketplaceCategoryService: MarketplaceCategoryService,
      private loadingController: LoadingController,
      protected toastController: ToastController,
      protected storageService: StorageService,
  ) {
    super(storageService, toastController);
  }


  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    this.marketplaceCategoryService.getAll().subscribe(res => {
      loading.dismiss();

      this.categories = res;

    });

  }


}
