import {Component, OnInit} from '@angular/core';
import {BasePage} from '../../../base/base.page';
import {StorageService} from '../../../../sharedServices/storage.service';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {ExpenseService} from '../expense.service';
import {timer} from 'rxjs';
import {ExpenseTypeService} from '../../expenseType.service';
import {ExpenseType} from '../../../../models/expenseType';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {now} from 'moment';
import {UploadService} from '../../../../sharedServices/upload.service';
import {Events} from '../../../../sharedServices/events.service';

@Component({
    selector: 'app-expense-details',
    templateUrl: './expense-details.page.html',
    styleUrls: ['./expense-details.page.scss'],
})
export class ExpenseDetailsPage extends BasePage implements OnInit {

    public expenseTypes: ExpenseType[];
    public form: FormGroup;
    public attempt = false;
    public expenseId = null;
    private colonyId = null;


    constructor(
        protected storageService: StorageService,
        protected toastController: ToastController,
        private route: ActivatedRoute,
        private nav: NavController,
        private router: Router,
        private loadingController: LoadingController,
        private expenseService: ExpenseService,
        private expenseTypeService: ExpenseTypeService,
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
        this.expenseId = this.route.snapshot.params.id;
        timer(1000).subscribe(() => {

            this.colonyId = this.savedUser.colonyId;

            if (this.expenseId) {
                this.loadExpense();
            }

            this.loadExpenseTypes();

        });
    }


    loadExpenseTypes() {
        this.expenseTypeService.getAll(this.savedUser.colonyId).subscribe(data => this.expenseTypes = data);
    }

    async loadExpense() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.expenseService.get(this.expenseId, this.colonyId).subscribe(res => {
            this.expense = res;

            if (this.expense.evidence === '') {
                this.expense.evidence = this.noImage;
            }

            this.form.get('description').setValue(res.description);
            this.form.get('amount').setValue(res.amount);
            this.form.get('type').setValue(res.type);
            this.form.get('evidence').setValue(res.evidence);
        });

        loading.dismiss();

    }

    async saveExpense() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        if (this.form.valid) {
            if (this.expenseId) {
                this.expenseService.update(this.expenseId, this.form.value, this.colonyId).then(() => {
                    this.attempt = false;
                    this.toast(2000, 'Gasto actualizado correctamente', 'success');
                    this.nav.navigateForward('/finances-home/expenses');
                });
            } else {
                this.expenseService.add(this.form.value, this.colonyId).then(() => {
                    this.attempt = false;
                    this.toast(2000, 'Gasto agregado correctamente', 'success');
                    this.nav.navigateForward('/finances-home/expenses');
                });
            }
        } else {
            this.attempt = true;
        }

        loading.dismiss();
    }

    removeExpense() {
        this.expenseService.remove(this.expenseId, this.colonyId);
        this.nav.navigateForward('/finances-home/expenses');
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
                        this.addExpenseType(data);
                    }
                }
            ]
        });

        await alert.present();
    }

    addExpenseType(data) {

        if (data.name !== '') {
            this.expenseType.name = data.name;

            this.expenseTypeService.getByName(this.savedUser.colonyId, data.name).then(res => {
                if (res.docs.length > 0) {
                    this.toast(2000, 'El tipo de gasto ya se encuentra en el sistema', 'danger');
                } else {
                    this.expenseTypeService.add(this.expenseType, this.savedUser.colonyId).then(() => {
                        this.toast(2000, 'Tipo de gasto agregado correctamente', 'success');
                    });
                }
            });
        }
    }

    async confirmMessage() {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar el gasto?',
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
                        this.removeExpense();
                    }
                }
            ]
        });

        await alert.present();
    }

    async delExpenseTypeConfirmMessage(id: string) {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que deseas eliminar el tipo de gasto seleccionado?',
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
                        this.removeExpenseType(id);
                    }
                }
            ]
        });

        await alert.present();
    }

    removeExpenseType(id: string) {
        this.form.get('type').setValue('');
        this.expenseTypeService.remove(id, this.colonyId);
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
        const path = 'expense-evidences';

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

        if (this.expenseId) {
            this.expenseService.update(this.expenseId, this.receipt, this.savedUser.colonyId).then(() => {});
        }
    }

    showPhoto() {
        this.uploadService.showPhoto(this.expense.evidence, this.expense.description);
    }

}
