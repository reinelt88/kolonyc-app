import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../../sharedServices/storage.service';
import {ActionSheetController, AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {BasePage} from '../../base/base.page';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../product.service';
import {MarketplaceCategoryService} from '../marketplaceCategory.service';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {UploadService} from '../../../sharedServices/upload.service';
import {timer} from 'rxjs';
import {UserService} from '../../users/user.service';
import {Events} from '../../../sharedServices/events.service';

@Component({
    selector: 'app-show-product',
    templateUrl: './show-product.page.html',
    styleUrls: ['./show-product.page.scss'],
})
export class ShowProductPage extends BasePage implements OnInit {

    public productId = null;
    public productStatus = ['nuevo', 'usado'];
    public publicationStatus = ['activo', 'vendido'];
    public showForm = false;
    public publicationDate: string = null;
    public sellerUser = null;
    public ready = false;
    public slideOpts = {
        initialSlide: 0,
        speed: 400
    };

    constructor(
        private loadingController: LoadingController,
        private route: ActivatedRoute,
        private nav: NavController,
        private router: Router,
        private productService: ProductService,
        private userService: UserService,
        private marketplaceCategoryService: MarketplaceCategoryService,
        protected storageService: StorageService,
        protected toastController: ToastController,
        private alertController: AlertController,
        private keyboard: Keyboard,
        private events: Events,
        private uploadService: UploadService,
        private actionCtrl: ActionSheetController,
    ) {
        super(storageService, toastController);
    }


    ngOnInit() {
        timer(1000).subscribe(() => {
            // this.user = this.savedUser;
            this.userService.get(this.savedUser.id).subscribe(user => {
               this.user = user;
            });
            this.productId = this.route.snapshot.params.id;
            if (this.productId) {
                this.loadProduct();
            }
        });
    }

    async loadProduct() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.productService.get(this.productId, this.savedUser.colonyId).subscribe(res => {
            this.product = res;
            this.publicationDate = new Date(res.createdAt.seconds * 1000).toLocaleString();
            this.marketplaceCategoryService.get(res.categoryId).subscribe(category => {
                this.marketplaceCategory = category;
                this.userService.get(res.userId).subscribe(user => {
                   this.sellerUser = user;
                   this.ready = true;
                });
            });
            loading.dismiss();
        });
    }


    openActionSheet() {

        const btn = [
            {
                text: 'Chat con vendedor',
                icon: 'chatboxes',
                handler: () => {
                    this.nav.navigateForward('/chat/' + this.productId + '/' + this.sellerUser.id + '/' + this.user.id);
                }
            }
        ];

        if (this.user.savedProducts.find(index => index === this.productId)) {
            btn.push(
                {
                    text: 'Eliminar producto guardado',
                    icon: 'trash',
                    handler: () => {
                        this.removeProduct();
                    }
                }
            );
        } else {
            btn.push(
                {
                    text: 'Guardar producto',
                    icon: 'bookmark',
                    handler: () => {
                        this.saveProduct();
                    }
                },
            );
        }

        this.actionCtrl.create({
            buttons: btn
        }).then(ac => ac.present());
    }

    saveProduct() {
        // this.userService.get(this.user.id).subscribe(user => {
            const savedProducts = this.user.savedProducts;
            if (!savedProducts.find(index => index === this.productId)) {
                savedProducts.push(this.productId);
                this.userService.update(this.user, this.user.id).then(() => {
                    this.toast(2000, 'Producto guardado', 'success');
                });
            }
        // });
    }

    removeProduct() {
        this.userService.getSnapshot(this.savedUser.id).then(user => {
            debugger;
            if (user) {
                if (user.savedProducts.find(index => index === this.productId)) {
                    user.savedProducts.splice(this.productId, 1);
                    this.userService.update(user, user.id).then(() => {
                        this.toast(2000, 'Producto eliminado', 'success');
                    });
                }
            }

        });
    }

    showPhoto(photo) {
        this.uploadService.showPhoto(photo, this.product.name);
    }

}
