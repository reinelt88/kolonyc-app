import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BasePage} from '../../base/base.page';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../../sharedServices/storage.service';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {MarketplaceCategoryService} from '../marketplaceCategory.service';
import {Events} from "../../../sharedServices/events.service";

@Component({
    selector: 'app-marketplace-category-details',
    templateUrl: './marketplace-category-details.page.html',
    styleUrls: ['./marketplace-category-details.page.scss'],
})
export class MarketplaceCategoryDetailsPage extends BasePage implements OnInit {

    public marketplaceCategoryId = null;
    public form: FormGroup;
    public attempt = false;
    public defaultErrorMessage = 'Por favor ingrese un valor válido';

    constructor(
        private loadingController: LoadingController,
        private route: ActivatedRoute,
        private nav: NavController,
        private router: Router,
        private marketplaceCategoryService: MarketplaceCategoryService,
        protected storageService: StorageService,
        protected toastController: ToastController,
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private keyboard: Keyboard,
        private events: Events
    ) {
        super(storageService, toastController);
        this.form = formBuilder.group(
            {
                name: ['', Validators.compose([Validators.required, Validators.min(5)])],
            });
    }

    ngOnInit() {
        this.marketplaceCategoryId = this.route.snapshot.params.id;

        if (this.marketplaceCategoryId) {
            this.loadMarketplaceCategory();
        }

    }

    async loadMarketplaceCategory() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.marketplaceCategoryService.get(this.marketplaceCategoryId).subscribe(res => {
            this.marketplaceCategory = res;

            this.form.get('name').setValue(res.name);

            loading.dismiss();
        });

    }

    async saveMarketplaceCategory() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        if (this.form.valid) {
            this.marketplaceCategory.name = this.form.value.name;

            if (this.marketplaceCategoryId) {
                this.marketplaceCategoryService.update(this.marketplaceCategory, this.marketplaceCategoryId).then(() => {
                    this.attempt = false;
                    this.toast(2000, 'Categoría actualizada correctamente', 'success');
                    this.nav.navigateForward('/list-marketplace-categories');
                });
            } else {
                this.marketplaceCategoryService.add(this.marketplaceCategory).then(() => {
                    this.attempt = false;
                    this.toast(2000, 'Categoría agregada correctamente', 'success');
                    this.nav.navigateForward('/list-marketplace-categories');
                });
            }
        } else {
            this.attempt = true;
        }

        loading.dismiss();
    }

    remove() {
        this.marketplaceCategoryService.remove(this.marketplaceCategoryId);
        this.toast(2000, 'Categoría eliminada correctamente', 'success');
        this.nav.navigateForward('/list-marketplace-categories');
    }

    async confirmMessage() {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar la categoría?',
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

}
