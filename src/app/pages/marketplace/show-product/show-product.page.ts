import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../../sharedServices/storage.service';
import {ToastController} from '@ionic/angular';
import {BasePage} from '../../base/base.page';

@Component({
    selector: 'app-show-product',
    templateUrl: './show-product.page.html',
    styleUrls: ['./show-product.page.scss'],
})
export class ShowProductPage extends BasePage implements OnInit {

    public productId = null;

    constructor(
        protected storageService: StorageService,
        protected toastController: ToastController,
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {
    }

}
