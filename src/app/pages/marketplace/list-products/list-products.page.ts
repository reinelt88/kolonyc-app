import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, LoadingController, ToastController} from '@ionic/angular';
import {StorageService} from '../../../sharedServices/storage.service';
import {BasePage} from '../../base/base.page';
import {timer} from 'rxjs';
import {ProductService} from '../product.service';
import {Product} from '../../../models/product';
import {IonicSelectableComponent} from 'ionic-selectable';
import {MarketplaceCategoryService} from '../marketplaceCategory.service';


@Component({
    selector: 'app-list-products',
    templateUrl: './list-products.page.html',
    styleUrls: ['./list-products.page.scss'],
})
export class ListProductsPage extends BasePage implements OnInit {

    public products: Product[];
    public categories = [];
    public category = null;

    // @ts-ignore
    @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
    @ViewChild(IonInfiniteScroll, {static: false}) ionInfiniteScroll: IonInfiniteScroll;

    constructor(
        private marketplaceCategoryService: MarketplaceCategoryService,
        private loadingController: LoadingController,
        protected toastController: ToastController,
        protected storageService: StorageService,
        private productService: ProductService
    ) {
        super(storageService, toastController);

    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.products = [];
        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            this.marketplaceCategoryService.getAll().subscribe(res => {
                this.categories = res;
            });
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

        this.productService.getAll(this.user.colonyId).subscribe(res => {
            this.products = res;
            console.log(res);
        });


        loading.dismiss();
    }

    clear() {
        this.selectComponent.clear();
        this.selectComponent.close();
        this.category = null;
        this.loadProducts();
    }

    confirm() {
        this.selectComponent.confirm();
        this.loadProducts();
        this.selectComponent.close();
    }

    // load(event) {
    //
    //     setTimeout(() => {
    //         console.log('Done');
    //
    //         const product: Product = this.products[this.products.length - 1];
    //
    //         if (product) {
    //
    //             this.productService.getPaginatedResults(this.user.colonyId, product.id).subscribe(res => {
    //                 // console.log(res);
    //                 // res.forEach(p => {
    //                 //     this.products.push(p);
    //                 // });
    //                 // console.log(this.products);
    //                 console.log(res);
    //             });
    //         }
    //
    //         event.target.complete();
    //
    //         // if (this.dataList.length === 100) {
    //         //     event.target.disabled = true;
    //         // }
    //     }, 500);
    // }

}
