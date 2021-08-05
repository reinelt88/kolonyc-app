import {Component, OnInit} from '@angular/core';
import {BasePage} from '../../base/base.page';
import {LoadingController, ToastController} from '@ionic/angular';
import {StorageService} from '../../../sharedServices/storage.service';
import {timer} from 'rxjs';
import {ProductService} from '../product.service';
import {UserService} from '../../users/user.service';

@Component({
    selector: 'app-saved-products',
    templateUrl: './saved-products.page.html',
    styleUrls: ['./saved-products.page.scss'],
})
export class SavedProductsPage extends BasePage implements OnInit {

    public products = [];

    constructor(
        protected toastController: ToastController,
        protected storageService: StorageService,
        protected productService: ProductService,
        private loadingController: LoadingController,
        protected userService: UserService,
    ) {
        super(storageService, toastController);
    }

    ionViewWillEnter() {
        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            this.loadProducts();
        });
    }

    async loadProducts() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.products = [];
        this.userService.get(this.user.id).subscribe(user => {
            if (user) {
                const savedProducts = user.savedProducts;
                if (savedProducts.length > 0) {
                    const arrProducts = [];
                    const promises = [];

                    savedProducts.forEach(productId => {
                        promises.push(
                            this.productService.getPromise(productId, this.user.colonyId)
                        );
                    });

                    Promise.all(promises).then(values => {
                        console.log(values);
                        values.forEach(p => {
                            if (p) {
                                // console.log(p);
                                const prod = p.data();
                                prod.id = p.id;
                                arrProducts.push(prod);
                            }
                        });
                    }, reason => {
                        console.log(reason);
                    });

                    this.products = arrProducts;
                    console.log(this.products);
                }
            }
        });

        loading.dismiss();
    }

    ngOnInit() {
    }

}
