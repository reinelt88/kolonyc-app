import {Component, OnInit} from '@angular/core';
import {BasePage} from '../../base/base.page';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {MarketplaceCategoryService} from '../marketplaceCategory.service';
import {StorageService} from '../../../sharedServices/storage.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {ProductService} from '../product.service';
import {timer} from 'rxjs';
import {MarketplaceCategory} from '../../../models/marketplaceCategory';
import {UploadService} from '../../../sharedServices/upload.service';
import {Events} from '../../../sharedServices/events.service';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.page.html',
    styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage extends BasePage implements OnInit {

    public productId = null;
    public form: FormGroup;
    public attempt = false;
    public defaultErrorMessage = 'Por favor ingrese un valor válido';
    public categories: MarketplaceCategory[];
    public productStatus = ['nuevo', 'usado'];
    public publicationStatus = ['activo', 'vendido'];
    public showForm = false;

    constructor(
        private loadingController: LoadingController,
        private route: ActivatedRoute,
        private nav: NavController,
        private router: Router,
        private productService: ProductService,
        private marketplaceCategoryService: MarketplaceCategoryService,
        protected storageService: StorageService,
        protected toastController: ToastController,
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private keyboard: Keyboard,
        private events: Events,
        private uploadService: UploadService,
    ) {
        super(storageService, toastController);
        this.form = formBuilder.group(
            {
                name: ['', Validators.compose([Validators.required, Validators.min(5)])],
                description: ['', Validators.compose([Validators.required, Validators.min(5)])],
                // price: ['', Validators.required],
                // offerPrice: ['', Validators.required],
                price: ['',  Validators.compose([Validators.pattern('[0-9]*'), Validators.required])],
                offerPrice: ['', Validators.compose([Validators.pattern('[0-9]*')])],
                productStatus: ['', Validators.required],
                publicationStatus: ['', Validators.required],
                showPhone: [false, Validators.required],
                categoryId: ['', Validators.required],
            });
    }


    ngOnInit() {

        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            this.productId = this.route.snapshot.params.id;

            if (this.productId) {
                this.loadProduct();
            }

            this.marketplaceCategoryService.getAll().subscribe(categories => {
                this.categories = categories;
                this.showForm = true;
            });
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

            this.form.get('name').setValue(res.name);
            this.form.get('description').setValue(res.description);
            this.form.get('price').setValue(res.price);
            this.form.get('offerPrice').setValue(res.offerPrice);
            this.form.get('productStatus').setValue(res.productStatus);
            this.form.get('publicationStatus').setValue(res.publicationStatus);
            this.form.get('categoryId').setValue(res.categoryId);

            loading.dismiss();
        });
    }

    async saveProduct() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        if (this.form.valid) {

            this.product.name = this.form.value.name;
            this.product.description = this.form.value.description;
            this.product.price = this.form.value.price;
            this.product.offerPrice = this.form.value.offerPrice;
            this.product.productStatus = this.form.value.productStatus;
            this.product.publicationStatus = this.form.value.publicationStatus;
            this.product.categoryId = this.form.value.categoryId;
            this.product.userId = this.user.id;

            if (this.productId) {
                this.productService.update(this.productId, this.product, this.user.colonyId).then(() => {
                    this.attempt = false;
                    this.toast(2000, 'Producto actualizado correctamente', 'success');
                    this.nav.navigateForward('/list-products');
                });
            } else {
                this.productService.add(this.product, this.user.colonyId).then(() => {
                    this.attempt = false;
                    this.toast(2000, 'Producto agregado correctamente', 'success');
                    this.nav.navigateForward('/list-products');
                });
            }
        } else {
            this.attempt = true;
        }

        loading.dismiss();
    }

    remove() {
        this.productService.remove(this.productId, this.user.colonyId);
        this.toast(2000, 'Producto eliminado correctamente', 'success');
        this.nav.navigateForward('/list-products');
    }

    async confirmMessage() {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar el producto?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Ok',
                    handler: () => {
                        console.log('Confirm Okay');
                        this.remove();
                    }
                }
            ]
        });

        await alert.present();
    }

    hideKeyboard() {
        this.keyboard.hide();
    }

    showPhone($event) {
        this.product.showPhone = $event.detail.checked;
    }

    // *******************************Image managment

    async loadImage() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();
        const path = 'products';

        this.uploadService.getImages(path, 6);
        this.events.subscribe(path, (url) => {
            this.updateImage(url);
            loading.dismiss();
        });
        // this.uploadService.getImages(path, 5).then((res) => {
        //     this.events.subscribe(path, (url) => {
        //         this.updateImage(url);
        //         loading.dismiss();
        //     });
        // });


        loading.dismiss();
        this.toast(2000, 'Carga completada', 'success');
    }

    updateImage(url: string) {

        const found =  this.product.pictures.find(x => x === url);

        if (!found) {
            // @ts-ignore
            this.product.pictures.push(url);
        }

        if (this.productId) {
            this.productService.update(this.productId, this.product, this.user.colonyId).then(() => {});
        }
    }

    showPhoto(photo) {
        this.uploadService.showPhoto(photo, this.product.name);
    }


}
