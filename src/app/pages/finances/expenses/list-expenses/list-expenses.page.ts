import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../../../sharedServices/storage.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {BasePage} from '../../../base/base.page';
import {ExpenseService} from '../expense.service';
import {timer} from 'rxjs';
import {ExpenseTypeService} from '../../expenseType.service';
import {now} from 'moment';
import {Colony} from '../../../../models/colony';
import {ColonyService} from '../../../colony/colony.service';

@Component({
    selector: 'app-list-expenses',
    templateUrl: './list-expenses.page.html',
    styleUrls: ['./list-expenses.page.scss'],
})
export class ListExpensesPage extends BasePage implements OnInit {

    public expenses = [];
    public colonyId = null;
    colonies: Colony[];

    constructor(
        protected storageService: StorageService,
        protected toastController: ToastController,
        private loadingController: LoadingController,
        private expenseService: ExpenseService,
        private expenseTypeService: ExpenseTypeService,
        private colonyServices: ColonyService,
    ) {
        super(storageService, toastController);

    }

    ngOnInit() {

        timer(1000).subscribe(() => {

            if (this.savedUser.role === 'SUPERADMIN') {
                this.loadColonies();
            } else {
                this.loadExpenses(this.savedUser.colonyId);
            }

        });

    }

    loadColonies() {
        this.colonyServices.getAll().subscribe(res => {
            this.colonyId = res[0].id;
            this.colonies = res;
        });
    }

    listChange($event) {
        this.loadExpenses($event.detail.value);
    }

    async loadExpenses(colonyId: string) {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.expenseService.getAll(colonyId).subscribe(res => {

            this.expenses = [];
            res.forEach(expense => {

                const expenseMod: any = {
                    id: expense.id,
                    description: expense.description,
                    type: '',
                    amount: expense.amount,
                    createdAt: (expense.createdAt === null) ? new Date(now()).toISOString() : new Date(expense.createdAt.seconds * 1000).toISOString(),
                };

                this.expenseTypeService.get(expense.type, colonyId).subscribe(data => {
                    expenseMod.type = data.name;
                    this.expenses.push(expenseMod);
                });


            });
            loading.dismiss();
        });
    }

}
