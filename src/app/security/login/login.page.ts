import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../sharedServices/auth.service';
import {ToastController} from '@ionic/angular';
import {StorageService} from '../../sharedServices/storage.service';
import {BasePage} from '../../pages/base/base.page';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {Events} from '../../sharedServices/events.service';
import {timer} from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BasePage implements OnInit {
    public form: FormGroup;
    public attempt = false;
    public defaultErrorMessage = 'Por favor ingrese un valor válido';

    constructor(
        private router: Router,
        private authService: AuthService,
        protected toastController: ToastController,
        protected storageService: StorageService,
        private formBuilder: FormBuilder,
        private keyboard: Keyboard,
        private events: Events
    ) {

        super(storageService, toastController);
        this.form = formBuilder.group(
            {
                email: ['', Validators.compose([Validators.required, Validators.email])],
                password: ['', Validators.required],
            });
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
      this.events.subscribe('loginError', (res) => {
          this.toast(4000, res, 'danger');
      });
      timer(1000).subscribe(() => {
        this.storageService.getObject('user').then(user => {
          if (user) {
            this.router.navigateByUrl('/home');
          }
        });
      });
    }

    async onLogin() {

        if (this.form.valid) {
            const user = await this.authService.onLogin(this.form.value.email.toLowerCase(), this.form.value.password);
            if (user) {
                this.toast(2000, 'Acceso correcto', 'dark');
                this.router.navigateByUrl('/home');
            } else {
                this.attempt = true;
                this.toast(4000, 'Credenciales incorrectas', 'danger');
            }
        } else {
            this.attempt = true;
        }

    }

    hideKeyboard() {
        this.keyboard.hide();
        this.onLogin();
    }
}
