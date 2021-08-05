import {Component, OnInit} from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular';
import {StorageService} from '../../../sharedServices/storage.service';
import {BasePage} from '../../base/base.page';
import {timer} from 'rxjs';
import {HouseService} from '../../resident/house.service';
import {ColonyService} from '../../colony/colony.service';
import * as moment from 'moment';
import {PaymentService} from '../payment.service';

@Component({
    selector: 'app-pending-payments',
    templateUrl: './pending-payments.page.html',
    styleUrls: ['./pending-payments.page.scss'],
})
export class PendingPaymentsPage extends BasePage implements OnInit {

    public nodes = [];
    public colonyType = '';

    constructor(
        protected toastController: ToastController,
        protected storageService: StorageService,
        private loadingController: LoadingController,
        private houseService: HouseService,
        private colonyService: ColonyService,
        private paymentService: PaymentService
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.nodes = [];
        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            this.loadItems();
        });
    }

    async loadItems() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.colonyService.get(this.user.colonyId).subscribe(colony => {
            if (colony) {
                this.colony = colony;
                this.colonyType = (this.colony.type === 'vertical') ? 'Edificio' : 'Calle';

                if (this.user.role === 'RESIDENT') {
                    this.houseService.get(this.user.houseId, this.user.colonyId).subscribe(house => {
                        house.id = this.user.houseId;
                        this.processNodes([house]);
                    });
                } else {
                    this.houseService.getAll(this.user.colonyId).subscribe(items => {
                        this.processNodes(items);
                    });
                }

            }
        });

        loading.dismiss();
    }

    processNodes(items: any) {

        const startDate = moment(this.colony.createdAt.seconds * 1000).toDate();
        const endDate = moment().toDate();

        const nodes = [];
        items.forEach(item => {
            const node = {
                location: item,
                payments: []
            };
            const months = this.getMonths(startDate, endDate);

            months.forEach(m => {
                const month = m.month + 1;
                const year = m.year;
                this.paymentService.getByHouseAndMonthAndYearApproved(this.user.colonyId, item.id, month, year)
                    .then(payments => {

                        const monthName = this.months.filter(mn => {
                            return mn.id === month;
                        });

                        const paymentNode: any = {
                            month: monthName[0].name,
                            year: m.year,
                            paid: payments.docs.length > 0
                        };

                        node.payments.push(paymentNode);
                    });
            });
            nodes.push(node);
        });
        this.nodes = nodes;
    }

    getMonths(fromDate, toDate) {
        const fromYear = fromDate.getFullYear();
        const fromMonth = fromDate.getMonth();
        const toYear = toDate.getFullYear();
        const toMonth = toDate.getMonth();
        const months = [];
        for (let year = fromYear; year <= toYear; year++) {
            let month = year === fromYear ? fromMonth : 0;
            const monthLimit = year === toYear ? toMonth : 11;
            for (; month <= monthLimit; month++) {
                months.push({year, month});
            }
        }
        return months;
    }

}
