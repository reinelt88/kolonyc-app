import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../sharedServices/storage.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {BasePage} from '../base/base.page';
import {timer} from 'rxjs';
import {Storage} from '@ionic/storage';
import {NotificationService} from '../notification/notification.service';
import {HouseService} from '../resident/house.service';
import * as moment from 'moment';
import {PaymentService} from '../payment/payment.service';
import {ColonyService} from '../colony/colony.service';
import {Events} from '../../sharedServices/events.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage extends BasePage implements OnInit {

    public cards = [];
    public notificationQuantity = null;

    constructor(
        protected storageService: StorageService,
        private loadingController: LoadingController,
        protected toastController: ToastController,
        public storage: Storage,
        private notificationService: NotificationService,
        private events: Events,
        private houseService: HouseService,
        private paymentService: PaymentService,
        private colonyService: ColonyService
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.loading();
        this.events.subscribe('userNotification', () => {
            timer(1000).subscribe(() => {
                this.loadNotifications();
            });
        });
    }

    async loading() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        timer(1000).subscribe(() => {
            this.loadData();

            timer(1000).subscribe(() => {
                this.loadCards();
                this.loadNotifications();
                loading.dismiss();
            });
        });
    }

    loadNotifications() {
        if (this.savedUser.id) {
            this.notificationService.getUnreads(this.savedUser.id).then(res => {
                if (res.docs.length > 0) {
                    this.notificationQuantity = res.docs.length;
                } else {
                    this.notificationQuantity = null;
                }
            });
        }

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

    loadCards() {

        const colonies = {
            route: '/list-colonies',
            title: 'Colonias',
            src: '../../../assets/colonias.png'
        };

        const users = {
            route: '/list-users',
            title: 'Usuarios',
            src: '../../../assets/usuarios.png'
        };

        const accesses = {
            route: '/list-accesses',
            title: 'Accesos',
            src: '../../../assets/control-accesos.png'
        };

        const residents = {
            route: '/list-residents',
            title: 'Residentes',
            src: '../../../assets/usuarios.png'
        };

        const security = {
            route: '/list-security-guards',
            title: 'Guardias de seguridad',
            src: '../../../assets/guardias-seguridad.png'
        };

        const finances = {
            route: '/finances-home/receipts',
            title: 'Finanzas de la colonia',
            src: '../../../assets/finanzas.png'
        };

        const proccess = {
            route: '/process-access',
            title: 'Procesar acceso',
            src: '../../../assets/qr.jpg'
        };

        const payment = {
            route: '/payment-home/list',
            title: 'Pagos de mensualidad',
            src: '../../../assets/pagos.png'
        };

        const paymentPendings = {
            route: '/payment-home/pendings',
            title: 'Pagos mensualidad',
            src: '../../../assets/pagos.png'
        };

        const areas = {
            route: '/list-areas',
            title: 'Áreas comunes',
            src: '../../../assets/areas-comunes.png'
        };

        const poll = {
            route: '/list-polls',
            title: 'Encuestas',
            src: '../../../assets/encuestas.png'
        };

        const categories = {
            route: '/list-marketplace-categories',
            title: 'Marketplace',
            src: '../../../assets/categorias-marketplace.png'
        };

        const marketplace = {
            route: '/list-products',
            title: 'Marketplace',
            src: '../../../assets/categorias-marketplace.png'
        };

      if (this.savedUser.role === 'SUPERADMIN') {

        this.cards = [colonies, users, accesses, finances, categories];

      } else if (this.savedUser.role === 'ADMIN') {

        this.cards = [residents, security, accesses, payment, finances, areas, poll, marketplace];

      } else if (this.savedUser.role === 'RESIDENT') {

        this.colonyService.get(this.savedUser.colonyId).subscribe(colony => {
          const startDate = moment(colony.createdAt.seconds * 1000).toDate();
          const endDate = moment().toDate();

          const months = this.getMonths(startDate, endDate);

          const promises = [];
          months.forEach(item => {
            promises.push(this.paymentService.getByHouseAndMonthAndYearApprovedQty(
              this.savedUser.colonyId,
              this.savedUser.houseId,
              item.month + 1,
              item.year));
          });

          Promise.all(promises).then(values => {
            let qty = 0;
            values.forEach(v => {
              if (v === 0) {
                qty++;
              }
            });

            if (qty > 2) {
              this.cards = [payment];
              this.toast(8000, 'Tiene más de 2 meses sin pagar su mensualidad, por favor realice el pago' +
                ' correspondiente para disfrutar de los beneficios de Kolonyc', 'danger');
            } else {
              this.cards = [accesses, payment, finances, areas, poll, marketplace];
            }

          }, reason => {
            console.log(reason);
          });

        });

        // this.cards = [accesses, finances, payment, areas, poll, marketplace];


      } else if (this.savedUser.role === 'SECURITY') {

        this.cards = [accesses, proccess, paymentPendings];

      } else {
        this.cards = [];
      }

    }


}
