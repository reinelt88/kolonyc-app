import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../sharedServices/auth.service';
import {ToastController} from '@ionic/angular';
import {Keyboard} from '@ionic-native/keyboard/ngx';

@Component({
    selector: 'app-recovery-password',
    templateUrl: './recovery-password.page.html',
    styleUrls: ['./recovery-password.page.scss'],
})
export class RecoveryPasswordPage implements OnInit {

    email: string;

    constructor(
        private authService: AuthService,
        private toastController: ToastController,
        private keyboard: Keyboard,
    ) {
    }

    ngOnInit() {
    }

    resetPassword() {
        return this.authService.resetPassword(this.email).then(() => {
            this.toast();
        });
    }

    async toast() {
        const toast = await this.toastController.create({
            message: 'Por favor revise su correo electrónico',
            duration: 2000,
            position: 'bottom',
            color: 'dark'
        });
        toast.present();
    }

    hideKeyboard() {
        this.keyboard.hide();
        this.resetPassword();
    }

}
