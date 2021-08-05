import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../users/user.service';
import {StorageService} from '../../sharedServices/storage.service';
import {ActionSheetController, LoadingController, ToastController} from '@ionic/angular';
import {AuthService} from '../../sharedServices/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {BasePage} from '../base/base.page';
import {ColonyService} from '../colony/colony.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {UploadService} from '../../sharedServices/upload.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {Router} from '@angular/router';
import {timer} from 'rxjs';
import {Events} from '../../sharedServices/events.service';


@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.page.html',
    styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage extends BasePage implements OnInit {

    // private docId = '';
    public form: FormGroup;
    public attempt = false;
    public defaultErrorMessage = 'Por favor ingrese un valor válido';

    public base64Image = null;
    public  croppedImage = null;
    @ViewChild(ImageCropperComponent, {static: false}) angularCropper: ImageCropperComponent;

    constructor(private userService: UserService,
                protected storageService: StorageService,
                private loadingController: LoadingController,
                protected toastController: ToastController,
                private authService: AuthService,
                private events: Events,
                private afs: AngularFirestore,
                private storage: AngularFireStorage,
                private actionCtrl: ActionSheetController,
                private colonyService: ColonyService,
                private formBuilder: FormBuilder,
                private keyboard: Keyboard,
                private uploadService: UploadService,
                private router: Router
    ) {
        super(storageService, toastController);
        this.form = formBuilder.group(
            {
                email: ['', Validators.compose([Validators.required, Validators.email])],
                displayName: ['', Validators.compose([Validators.required, Validators.min(5)])],
                phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
            });
    }

    ngOnInit() {
        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            this.loadProfile();
        });
    }


    async loadProfile() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.userService.getByUid(this.user.uid).then(res => {
            this.user = res;
            this.form.get('email').setValue(res.email);
            this.form.get('displayName').setValue(res.displayName);
            this.form.get('phone').setValue(res.phone);

            if (res.colonyId) {
                this.colonyService.get(res.colonyId).subscribe(col => this.colony = col);
            }

        });

        loading.dismiss();

    }

    async updateProfile() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        if (this.form.valid) {
            this.user.displayName = this.form.value.displayName;
            this.user.phone = this.form.value.phone;
            this.userService.update(this.user, this.user.id).then(() => {
                this.colonyService.update(this.colony, this.user.colonyId).then(() => {
                    this.attempt = false;
                    this.userService.updateStorageAndEvents(this.user);
                    this.toast(2000, 'Actualización exitosa', 'success');
                });
            });
        } else {
            this.attempt = true;
        }

        loading.dismiss();
    }

    resetPassword() {
        return this.authService.resetPassword(this.user.email).then(() => {
            this.toast(5000, 'Por favor siga las instrucciones recibidas en su correo electrónico y acceda con su nueva contraseña', 'dark');
            this.router.navigateByUrl('/logout');
        });
    }

    usePaypal($event) {
        this.colony.usePaypal = $event.detail.checked;
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
        const path = 'user-profile';

        if (method === 'takePicture') {
            this.uploadService.takePicture(path).then((res) => {
                this.events.subscribe(path, (url) => {
                    this.updateImage(url);
                });
            });
        } else if (method === 'getGallery') {

            this.uploadService.getImages(path, 1);
            this.events.subscribe(path, (url) => {
                this.updateImage(url);
                loading.dismiss();
            });

        } else if (method === 'crop') {
            this.uploadService.uploadImage(this.croppedImage, path);
            this.events.subscribe(path, (url) => {
                this.updateImage(url);
                this.croppedImage = null;
                this.base64Image = null;
            });
        }

        loading.dismiss();
        this.toast(2000, 'Carga completada', 'success');
    }

    updateImage(url: string) {
        this.user.profilePicture = url;
        this.userService.update(this.user, this.user.id).then(() => {

            this.userService.updateStorageAndEvents(this.user);
        });
    }

    showPhoto() {
        this.uploadService.showPhoto(this.user.profilePicture, this.user.displayName);
    }

    async cropImage() {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.uploadService.convertFileToDataURLviaFileReader(this.user.profilePicture).subscribe( base64 => {
            this.base64Image =  base64;
            loading.dismiss();
        });
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

}
