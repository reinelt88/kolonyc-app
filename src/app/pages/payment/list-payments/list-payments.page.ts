import {Component, OnInit, ViewChild} from '@angular/core';
import {BasePage} from '../../base/base.page';
import {StorageService} from '../../../sharedServices/storage.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {timer} from 'rxjs';
import {PaymentService} from '../payment.service';
import {Payment} from '../../../models/payment';
import {HouseService} from '../../resident/house.service';
import {ColonyService} from '../../colony/colony.service';
import {IonicSelectableComponent} from 'ionic-selectable';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {Storage} from '@ionic/storage';
import {Events} from '../../../sharedServices/events.service';

@Component({
    selector: 'app-list-payments',
    templateUrl: './list-payments.page.html',
    styleUrls: ['./list-payments.page.scss'],
})
export class ListPaymentsPage extends BasePage implements OnInit {

    public payments = [];
    public colonyType = '';
    public colonyId = null;
    public houses = [];
    public house = null;
    public searchTerm = null;
    public showList = false;

    @ViewChild('selectComponent', {static: false}) selectComponent: IonicSelectableComponent;
    constructor(
        protected storageService: StorageService,
        private loadingController: LoadingController,
        protected toastController: ToastController,
        private paymentService: PaymentService,
        private houseService: HouseService,
        private colonyService: ColonyService,
        private keyboard: Keyboard,
        public storage: Storage,
        private events: Events,
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {
        this.events.subscribe('userChange', (res) => {
            this.savedUser = res;
        });

        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            this.loadPayments();
        });
    }

    ionViewWillEnter() {
        this.events.subscribe('paymentAdd', () => {
            this.loadPayments();
        });
    }

    async loadPayments() {
        this.payments = [];
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.colonyService.get(this.user.colonyId).subscribe(col => {
            this.colony = col;
            this.colonyType = (this.colony.type === 'vertical') ? 'Edificio' : 'Calle';

            this.houseService.getAll(this.user.colonyId).subscribe(houses => {
                houses.forEach(house => {
                    if (!this.houses.find(h => h.place === house.place)) {
                        this.houses.push(house);
                    }
                });
            });
        });

        if (this.user.role === 'ADMIN') {
            if (this.house === null) {
                this.paymentService.getAll(this.user.colonyId).subscribe(payments => {
                    this.process(payments);
                });
            } else {
                this.houseService.getByAllByPlace(this.user.colonyId, this.house.place).then(houses => {
                    houses.forEach(h => {
                        this.paymentService.getAllByHouseId(this.user.colonyId, h.id).then(payments => {
                            if (payments.docs.length > 0) {
                                const paymentsList = [];
                                payments.docs.forEach(d => {
                                    const payment = d.data();
                                    payment.id = d.id;
                                    paymentsList.push(payment);
                                });
                                this.process(paymentsList);
                            } else {
                                this.showList = true;
                            }
                        });
                    });
                });
            }
        } else {
           this.paymentService.getAllByHouseId(this.user.colonyId, this.user.houseId).then(payments => {
               if (payments.docs.length > 0) {
                   const paymentsList: any = [];
                   payments.docs.forEach(d => {
                       const payment: any = d.data();
                       payment.id = d.id;
                       paymentsList.push(payment);
                   });
                   this.process(paymentsList);
               } else {
                   this.showList = true;
               }
           });
        }

        loading.dismiss();
    }

    process(payments) {
        this.payments = [];
        payments.forEach((p: Payment) => {

            const month = this.months.filter(m => {
                return m.id === p.month;
            });

            const paymentMod: any = {
                id: p.id,
                status: p.status,
                month: month[0].name,
                year: p.year,
                evidence: p.evidence,
                referenceNumber: p.referenceNumber,
                type: p.type,
                houseId: '',
                amount: p.amount,
                createdAt: new Date(p.createdAt.seconds * 1000).toISOString(),
            };

            this.houseService.get(p.houseId, this.user.colonyId).subscribe(house => {
                paymentMod.houseId = this.colonyType + ' ' + house.place + ' - ' + house.number;
            });

            this.payments.push(paymentMod);
        });
        this.showList = true;
    }

    clear() {
        this.selectComponent.clear();
        this.selectComponent.close();
        this.house = null;
        this.loadPayments();
    }

    confirm() {
        this.selectComponent.confirm();
        this.loadPayments();
        this.selectComponent.close();
    }

    search($event) {
        const query = $event.target.value;

        if (!query) {
            this.loadPayments();
        }

        this.payments = this.payments.filter((payment) => {
            return JSON.stringify(payment).toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
    }

    hideKeyboard() {
        this.keyboard.hide();
    }

}
