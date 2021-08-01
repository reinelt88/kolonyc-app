import {Component, OnInit} from '@angular/core';
import {BasePage} from '../../pages/base/base.page';
import {StorageService} from '../../sharedServices/storage.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {timer} from 'rxjs';
import {Router} from '@angular/router';
import {Events} from '../../sharedServices/events.service';

@Component({
    selector: 'app-user-switch',
    templateUrl: './user-switch.page.html',
    styleUrls: ['./user-switch.page.scss'],
})
export class UserSwitchPage extends BasePage implements OnInit {

    public user;

    constructor(
        protected storageService: StorageService,
        private events: Events,
        private loadingController: LoadingController,
        protected toastController: ToastController,
        private router: Router,
    ) {
        super(storageService, toastController);

    }

    ionViewWillEnter() {

    }

    ngOnInit() {
        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            if (this.savedUser.role === 'ADMIN') {
                this.savedUser.role = 'RESIDENT';
                this.storageService.setObject('user', this.savedUser);
                this.events.publish('userChange', this.savedUser);
                this.router.navigateByUrl('/home');
            } else {
                this.savedUser.role = 'ADMIN';
                this.storageService.setObject('user', this.savedUser);
                this.events.publish('userChange', this.savedUser);
                this.router.navigateByUrl('/home');
            }
        });
    }

}
