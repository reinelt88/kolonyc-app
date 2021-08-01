import { Component } from '@angular/core';
import {BasePage} from './pages/base/base.page';
import * as moment from 'moment';
import {LoadingController, MenuController, Platform, ToastController} from '@ionic/angular';
import {AuthService} from './sharedServices/auth.service';
import {Router} from '@angular/router';
import {StorageService} from './sharedServices/storage.service';
import {HouseService} from './pages/resident/house.service';
import {UserService} from './pages/users/user.service';
import {ColonyService} from './pages/colony/colony.service';
import {PaymentService} from './pages/payment/payment.service';
import {Events} from './sharedServices/events.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {FCM} from '@ionic-native/fcm/ngx';
import { SplashScreen } from '@capacitor/splash-screen';
import {timer} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent extends BasePage {
  public appPages = [];
  displayName = 'Jhon Doe';
  profilePicture = 'https://w.wallhaven.cc/full/6k/wallhaven-6kre3q.jpg';
  isLoggedIn = false;
  role = null;
  // showSplash = true;
  public showRoleSwitch = false;
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private menuController: MenuController,
    protected toastController: ToastController,
    protected storageService: StorageService,
    private events: Events,
    private loadingController: LoadingController,
    private fcm: FCM,
    private houseService: HouseService,
    private userService: UserService,
    private colonyService: ColonyService,
    private paymentService: PaymentService,
  ) {
    super(storageService, toastController);
    this.initializeApp();
    /**
     * Cuando se realiza un login
     */
    this.events.subscribe('userChange', (res) => {
      this.manageProfileData(res);
    });

    timer(1000).subscribe(() => {
      this.manageProfileData(this.savedUser);
    });
  }

  async initializeApp() {
    try {
      await SplashScreen.hide();
      this.notificationSetup();
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }

  manageProfileData(res) {


    if (res.id !== '') {
      this.displayName = (res.displayName) ? res.displayName : res.email;
      this.profilePicture = res.profilePicture;
      this.isLoggedIn = true;
      this.role = res.role;

      if (res.role === 'ADMIN') {
        this.houseService.getResidentByUid(res.colonyId, res.id).then(r => {
          if (r) {
            this.showRoleSwitch = true;
          }
        });
      } else {
        this.userService.getByEmailAndColony(res.colonyId, res.email).then(rs => {
          if (rs.docs.length > 0) {
            rs.docs.forEach(d => {
              const data = d.data();
              this.showRoleSwitch = data.role === 'ADMIN';
            });
          } else {
            this.showRoleSwitch = false;
          }
        });
      }

      const home = {
        title: 'Inicio',
        url: '/',
        icon: 'cube',
        color: '#E63135'
      };

      const finances = {
        title: 'Finanzas de la colonia',
        url: '/finances-home/receipts',
        icon: 'logo-usd'
      };

      const users = {
        title: 'Usuarios',
        url: '/list-users',
        icon: 'people',
        color: '#0CA9EA'
      };

      const colonies = {
        title: 'Colonias',
        url: '/list-colonies',
        icon: 'home',
        color: '#78BD43'
      };

      const accesses = {
        title: 'Accesos',
        url: '/list-accesses',
        icon: 'close-circle-outline',
        color: '#FFD439'
      };

      const residents = {
        title: 'Residentes',
        url: '/list-residents',
        icon: 'people',
        color: '#0CA9EA'
      };

      const security = {
        title: 'Guardias de seguridad',
        url: '/list-security-guards',
        icon: 'people',
        color: '#78BD43'
      };

      const proccess = {
        title: 'Procesar acceso',
        url: '/process-access',
        icon: 'qr-scanner',
        color: '#78BD43'
      };

      const payment = {
        title: 'Pagos de mensualidad',
        url: '/payment-home/list',
        icon: 'cash',
        color: '#ff0067'
      };

      const paymentPendings = {
        title: 'Pagos de mensualidad',
        url: '/payment-home/pendings',
        icon: 'cash',
        color: '#ff0067'
      };

      const areas = {
        title: 'Areas comunes',
        url: '/list-areas',
        icon: 'football',
        color: '#0CA9EA'
      };

      const poll = {
        title: 'Encuestas',
        url: '/list-polls',
        icon: 'checkbox-outline',
        color: '#E63135'
      };

      const marketplaceCategory = {
        title: 'Marketplace',
        url: '/list-marketplace-categories',
        icon: 'cart',
        color: '#E63135'
      };

      const marketplace = {
        title: 'Marketplace',
        url: '/list-products',
        icon: 'cart',
        color: '#000000'
      };


      if (res.role === 'SUPERADMIN') {
        // this.appPages = [ home, colonies, users, accesses, finances, marketplaceCategory];
        this.appPages = [ home, colonies, users, accesses, finances];
      } else if (res.role === 'ADMIN') {
        // this.appPages = [ home, residents, security, accesses, finances, payment, areas, poll, marketplace];
        this.appPages = [ home, residents, security, accesses, finances, payment, areas, poll];

      } else if (res.role === 'RESIDENT') {

        this.colonyService.get(this.savedUser.colonyId).subscribe(colony => {
          this.houseService.getResidentByUid(this.savedUser.colonyId, this.savedUser.id).then(resident => {
            this.houseService.getHouseByResident(this.savedUser.colonyId, resident.id).then(house => {
              const startDate = moment(colony.createdAt.seconds * 1000).toDate();
              const endDate = moment().toDate();

              const months = this.getMonths(startDate, endDate);

              const promises = [];
              months.forEach(item => {
                promises.push(this.paymentService.getByHouseAndMonthAndYearApprovedQty(
                  this.savedUser.colonyId, house.id, item.month + 1 , item.year
                ));
              });

              Promise.all(promises).then(values => {
                let qty = 0;
                values.forEach(v => {
                  if (v === 0) {
                    qty++;
                  }
                });

                if (qty > 2) {
                  this.appPages = [ home, payment];
                } else {
                  this.appPages = [ home, residents, security, accesses, finances, payment, areas, poll];
                }

              }, reason => {
                console.log(reason);
              });

            });
          });
        });
        // this.appPages = [ home, accesses, finances, payment, areas, poll, marketplace];
        // this.appPages = [ home, accesses, finances, payment, areas, poll];
      } else if (res.role === 'SECURITY') {
        this.appPages = [ home, accesses, proccess, paymentPendings];
      }
    }
  }

  roleChange($event) {
    this.menuController.close();
    this.router.navigateByUrl('/user-switch');
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

  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 6000
    });
    toast.present();
  }

  private notificationSetup() {
    this.fcm.onNotification().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          console.log(msg);
          this.presentToast(msg.body);
        }
      });
  }


}
