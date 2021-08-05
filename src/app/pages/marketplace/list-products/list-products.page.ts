import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, IonInfiniteScroll, LoadingController, NavController, ToastController} from '@ionic/angular';
import {StorageService} from '../../../sharedServices/storage.service';
import {BasePage} from '../../base/base.page';
import {timer} from 'rxjs';
import {ProductService} from '../product.service';
import {Product} from '../../../models/product';
import {IonicSelectableComponent} from 'ionic-selectable';
import {MarketplaceCategoryService} from '../marketplaceCategory.service';
import {UserService} from '../../users/user.service';


@Component({
    selector: 'app-list-products',
    templateUrl: './list-products.page.html',
    styleUrls: ['./list-products.page.scss'],
})
export class ListProductsPage extends BasePage implements OnInit {

    public products: Product[];
    public categories = [];
    public category = null;
    public dataList = [];
    public total = 0;
    public offsetProduct = null;
    public userId = null;

    @ViewChild('selectComponent', {static: false}) selectComponent: IonicSelectableComponent;
    @ViewChild(IonInfiniteScroll, {static: false}) ionInfiniteScroll: IonInfiniteScroll;

    constructor(
        private marketplaceCategoryService: MarketplaceCategoryService,
        private loadingController: LoadingController,
        protected toastController: ToastController,
        protected storageService: StorageService,
        private productService: ProductService,
        private actionCtrl: ActionSheetController,
        private nav: NavController,
        protected userService: UserService,
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
                this.productService.getAllActived(this.savedUser.colonyId).subscribe(products => {
                    this.total = products.length;
                });
            });

            this.loadProducts(null, true);
        });
    }

    getOffset() {
        if (this.dataList.length > 0) {
            return this.dataList[this.dataList.length - 1];
        } else {
            return null;
        }
    }

    async loadProducts(offset: any, clear: boolean) {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        if (clear) { this.dataList = []; }
        this.productService.getPaginatedResults(this.user.colonyId, offset, this.category, this.userId).then(res => {
            if (res) {
                res.forEach(r => {
                    if (!this.dataList.find(x => x.id === r.id)) {
                        this.dataList.push(r);
                    }
                });
                if (this.category != null) {
                    this.total = this.dataList.length;
                }
            }
        });

        loading.dismiss();
    }

    clear() {
        this.selectComponent.clear();
        this.selectComponent.close();
        this.category = null;
        this.loadProducts(null, true);
    }

    confirm() {
        this.selectComponent.confirm();
        this.loadProducts(null, true);
        this.selectComponent.close();
    }

    load(event) {

        setTimeout(() => {
            this.loadProducts(this.getOffset(), false);

            event.target.complete();

            if (this.dataList.length === this.total) {
                event.target.disabled = true;
                this.toast(4000, 'Ya no existen más productos', 'dark');
            }
        }, 500);
    }

    myProducts() {
        if (this.userId == null) {
            this.userId = this.user.id;
            this.loadProducts(null, true);
        } else {
            this.userId = null;
            this.loadProducts(null, true);
        }
    }

    openActionSheet() {

        const btn = [
            {
                text: 'Mis chats',
                icon: 'chatboxes',
                handler: () => {
                    this.nav.navigateForward('/list-chats');
                }
            },
            {
                text: 'Mis productos',
                icon: 'funnel',
                handler: () => {
                    this.myProducts();
                }
            },
            {
                text: 'Productos guardados',
                icon: 'bookmark',
                handler: () => {
                    this.nav.navigateForward('/saved-products');
                }
            },
            {
                text: 'Todos los productos',
                icon: 'apps',
                handler: () => {
                    this.myProducts();
                }
            },
        ];

        this.actionCtrl.create({
            buttons: btn
        }).then(ac => ac.present());
    }

}
