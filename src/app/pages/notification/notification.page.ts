import {Component, OnInit} from '@angular/core';
import {BasePage} from '../base/base.page';
import {LoadingController, ToastController} from '@ionic/angular';
import {StorageService} from '../../sharedServices/storage.service';
import {NotificationService} from './notification.service';
import {timer} from 'rxjs';
import {Notification} from '../../models/notification';
import {Events} from '../../sharedServices/events.service';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.page.html',
    styleUrls: ['./notification.page.scss'],
})
export class NotificationPage extends BasePage implements OnInit {

    public notifications = [];
    public defaultMessage = null;

    constructor(
        private loadingController: LoadingController,
        private notificationService: NotificationService,
        protected toastController: ToastController,
        protected storageService: StorageService,
        private events: Events,
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {
        timer(1000).subscribe(() => {
            this.loadNotifications();
            this.user = this.savedUser;
        });
    }

    async loadNotifications() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.notificationService.getAll(this.user.id).subscribe(res => {

            if (res.length > 0) {
                this.notifications = res;
            } else {
                this.defaultMessage = 'No existen notificaciones pendientes';
            }
            loading.dismiss();
        });
    }

    updateStatus(id: string) {
        this.notificationService.get(id, this.user.id).subscribe(n => {
            n.status = 'read';
            this.notificationService.update(id, n, this.user.id).then(u => {
                this.notifications = [];
                this.loadNotifications();
            });
        });
    }

    ionViewDidLeave() {
        // console.log('me fui');
        this.notificationService.getUnreads(this.user.id).then(res => {
            res.forEach(n => {
                const data = n.data();
                const notification: Notification = {
                    title: data.title,
                    status: 'read'
                };

                this.notificationService.update(n.id, notification, this.user.id).then(() => {
                    this.events.publish('userNotification', []);
                });
            });
        });
    }

}
