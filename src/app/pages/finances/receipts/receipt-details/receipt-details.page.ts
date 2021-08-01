import {Component, OnInit} from '@angular/core';
import {ReceiptType} from '../../../../models/receiptType';
import {StorageService} from '../../../../sharedServices/storage.service';
import {AlertController, LoadingController, NavController, Platform, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {ReceiptService} from '../receipt.service';
import {ReceiptTypeService} from '../../receiptType.service';
import {BasePage} from '../../../base/base.page';
import {timer} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {now} from 'moment';
import {UploadService} from '../../../../sharedServices/upload.service';
import {Events} from '../../../../sharedServices/events.service';

@Component({
    selector: 'app-receipt-details',
    templateUrl: './receipt-details.page.html',
    styleUrls: ['./receipt-details.page.scss'],
})
export class ReceiptDetailsPage extends BasePage implements OnInit {

    public receiptId = null;
    private colonyId = null;
    public receiptTypes: ReceiptType[];
    public form: FormGroup;
    public attempt = false;


    constructor(
        protected storageService: StorageService,
        protected toastController: ToastController,
        private route: ActivatedRoute,
        private nav: NavController,
        private router: Router,
        private loadingController: LoadingController,
        private receiptService: ReceiptService,
        private receiptTypeService: ReceiptTypeService,
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private uploadService: UploadService,
        private events: Events,
    ) {
        super(storageService, toastController);
        this.form = formBuilder.group(
            {
                description: ['', Validators.required],
                amount: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.min(1)])],
                type: ['', Validators.required],
                evidence: [''],
                createdAt: [new Date(now())]
            });
    }

    ngOnInit() {
        this.receiptId = this.route.snapshot.params.id;
        timer(1000).subscribe(() => {

            this.colonyId = this.savedUser.colonyId;

            if (this.receiptId) {
                this.loadReceipt();
            }

            this.loadReceiptTypes();

        });
    }

    loadReceiptTypes() {
        this.receiptTypeService.getAll(this.savedUser.colonyId).subscribe(data => this.receiptTypes = data);
    }

    async loadReceipt() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.receiptService.get(this.receiptId, this.colonyId).subscribe(res => {
            this.receipt = res;

            if (this.receipt.evidence === '') {
                this.receipt.evidence = this.noImage;
            }

            this.form.get('description').setValue(res.description);
            this.form.get('amount').setValue(res.amount);
            this.form.get('type').setValue(res.type);
            this.form.get('evidence').setValue(res.evidence);
        });

        loading.dismiss();

    }

    async saveReceipt() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        if (this.form.valid) {
            if (this.receiptId) {
                this.receiptService.update(this.receiptId, this.form.value, this.colonyId).then(() => {
                    this.attempt = false;
                    this.toast(2000, 'Ingreso actualizado correctamente', 'success');
                    this.nav.navigateForward('/finances-home/receipts');
                });
            } else {
                this.receiptService.add(this.form.value, this.colonyId).then(() => {
                    this.attempt = false;
                    this.toast(2000, 'Ingreso agregado correctamente', 'success');
                    this.nav.navigateForward('/finances-home/receipts');
                });
            }
        } else {
            this.attempt = true;
        }

        loading.dismiss();
    }

    removeReceipt() {
        this.receiptService.remove(this.receiptId, this.colonyId);
        this.nav.navigateForward('/finances-home/receipts');
    }

    removeReceiptType(id: string) {
        this.form.get('type').setValue('');
        this.receiptTypeService.remove(id, this.colonyId);
    }

    async presentAlertPrompt() {
        const alert = await this.alertController.create({
            header: 'Agregar tipo',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Nombre',
                },
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        console.log('Confirm Ok');
                        this.addReceiptType(data);
                    }
                }
            ]
        });

        await alert.present();
    }

    addReceiptType(data) {
        if (data.name !== '') {
            this.receiptType.name = data.name;

            this.receiptTypeService.getByName(this.savedUser.colonyId, data.name).then(res => {
                if (res.docs.length > 0) {
                    this.toast(2000, 'El tipo de ingreso ya se encuentra en el sistema', 'danger');
                } else {
                    this.receiptTypeService.add(this.receiptType, this.savedUser.colonyId).then(() => {
                        this.toast(2000, 'Tipo de ingreso agregado correctamente', 'success');
                    });
                }
            });
        }
    }

    async confirmMessage() {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar el ingreso?',
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
                        this.removeReceipt();
                    }
                }
            ]
        });

        await alert.present();
    }

    async delReceiptTypeConfirmMessage(id: string) {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que deseas eliminar el tipo de ingreso seleccionado?',
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
                        this.removeReceiptType(id);
                    }
                }
            ]
        });

        await alert.present();
    }


    // *******************************Image managment

    async loadImage(method: string) {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();
        const path = 'receipt-evidences';

        if (method === 'takePicture') {
            this.uploadService.takePicture(path).then((res) => {
                this.events.subscribe(path, (url) => {
                    this.updateImage(url);
                });
            });
        } else {
            this.uploadService.getImages(path, 1);
            this.events.subscribe(path, (url) => {
                this.updateImage(url);
                loading.dismiss();
            });
        }

        loading.dismiss();
        this.toast(2000, 'Carga completada', 'success');
    }

    updateImage(url: string) {
        this.receipt.evidence = url;
        this.form.get('evidence').setValue(url);

        if (this.receiptId) {
            this.receiptService.update(this.receiptId, this.receipt, this.savedUser.colonyId).then(() => {});
        }
    }

    showPhoto() {
        this.uploadService.showPhoto(this.receipt.evidence, this.receipt.description);
    }
}
