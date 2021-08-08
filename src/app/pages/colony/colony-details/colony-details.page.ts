import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController, ToastController, AlertController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../../sharedServices/storage.service';
import {ColonyService} from '../colony.service';
import {UploadService} from '../../../sharedServices/upload.service';
import {BasePage} from '../../base/base.page';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {Events} from '../../../sharedServices/events.service';

@Component({
  selector: 'app-colony-details',
  templateUrl: './colony-details.page.html',
  styleUrls: ['./colony-details.page.scss'],
})
export class ColonyDetailsPage extends BasePage implements OnInit {

  public colonyId = null;
  public form: FormGroup;
  public attempt = false;
  public defaultErrorMessage = 'Por favor ingrese un valor válido';

  constructor(
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private nav: NavController,
    private router: Router,
    private colonyService: ColonyService,
    private uploadService: UploadService,
    protected storageService: StorageService,
    protected toastController: ToastController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private keyboard: Keyboard,
    private events: Events
  ) {
    super(storageService, toastController);
    this.buildForm();
    this.setReferenceNumberValidators();
  }

  buildForm() {
    this.form = this.formBuilder.group(
      {
        name: ['', Validators.compose([Validators.required, Validators.min(5)])],
        postalCode: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(5), Validators.minLength(5)])],
        street: ['', Validators.required],
        number: ['', Validators.required],
        municipality: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        type: ['', Validators.required],
        picture: [''],
        usePaypal: [false],
        paypalClientId: [''],
        paypalClientSecret: [''],
      });
  }

  setReferenceNumberValidators() {
    const paypalClientId = this.form.get('paypalClientId');
    const paypalClientSecret = this.form.get('paypalClientSecret');

    this.form.get('usePaypal').valueChanges
      .subscribe(type => {
        if (type) {
          paypalClientId.setValidators([Validators.required]);
          paypalClientSecret.setValidators([Validators.required]);
        } else {
          paypalClientId.setValidators(null);
          paypalClientSecret.setValidators(null);
        }

        paypalClientId.updateValueAndValidity();
        paypalClientSecret.updateValueAndValidity();
      });
  }

  ngOnInit() {
    this.colonyId = this.route.snapshot.params.id;

    if (this.colonyId) {
      this.loadColony();
    }

  }

  async loadColony() {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    this.colonyService.get(this.colonyId).subscribe(res => {
      this.colony = res;

      this.form.get('name').setValue(res.name);
      this.form.get('postalCode').setValue(res.address.postalCode);
      this.form.get('street').setValue(res.address.street);
      this.form.get('number').setValue(res.address.number);
      this.form.get('municipality').setValue(res.address.municipality);
      this.form.get('state').setValue(res.address.state);
      this.form.get('country').setValue(res.address.country);
      this.form.get('picture').setValue(res.picture);
      this.form.get('type').setValue(res.type);
      this.form.get('usePaypal').setValue(res.usePaypal);
      this.form.get('paypalClientId').setValue(res.paypalClientId);
      this.form.get('paypalClientSecret').setValue(res.paypalClientSecret);

      loading.dismiss();
    });

  }

  async saveColony() {

    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    if (this.form.valid) {
      this.form.value.picture = this.colony.picture;
      this.colony.name = this.form.value.name;
      this.colony.type = this.form.value.type;
      this.colony.address.postalCode = this.form.value.postalCode;
      this.colony.address.state = this.form.value.state;
      this.colony.address.country = this.form.value.country;
      this.colony.address.municipality = this.form.value.municipality;
      this.colony.address.street = this.form.value.street;
      this.colony.address.number = this.form.value.number;
      if (this.form.value.paypalClientId !== undefined) {
        this.colony.paypalClientId = this.form.value.paypalClientId;
      }

      if (this.form.value.paypalClientSecret) {
        this.colony.paypalClientSecret = this.form.value.paypalClientSecret;
      }

      if (this.colonyId) {

        this.colonyService.update(this.colony, this.colonyId).then(() => {
          this.attempt = false;
          this.toast(2000, 'Colonia actualizada correctamente', 'success');
          this.nav.navigateForward('/list-colonies');
        });
      } else {
        this.colonyService.add(this.colony).then(() => {
          this.attempt = false;
          this.toast(2000, 'Colonia agregada correctamente', 'success');
          this.nav.navigateForward('/list-colonies');
        });
      }
    } else {
      this.attempt = true;
    }

    loading.dismiss();
  }

  remove() {
    this.colonyService.remove(this.colonyId);
    this.toast(2000, 'Colonia eliminada correctamente', 'success');
    this.nav.navigateForward('/list-colonies');
  }

  async confirmMessage() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'Estas seguro que quieres eliminar la colonia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.remove();
          }
        }
      ]
    });

    await alert.present();
  }

  hideKeyboard() {
    this.keyboard.hide();
  }

  usePaypal($event) {
    this.colony.usePaypal = $event.detail.checked;
    this.form.get('usePaypal').setValue($event.detail.checked);
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
    const path = 'colonies';

    if (method === 'takePicture') {
      this.uploadService.takePicture(path).then((res) => {
        this.events.subscribe(path, (url) => {
          this.updateImage(url);
        });
      });
    } else {
      this.uploadService.getImages(path, 1);
      this.events.subscribe(path, (url) => {
        this.updateImage(url);
        loading.dismiss();
      });
    }

    loading.dismiss();
    this.toast(2000, 'Carga completada', 'success');
  }

  updateImage(url: string) {
    this.colony.picture = url;

    if (this.colonyId) {
      this.colonyService.update(this.colony, this.colonyId).then(() => {
      });
    }
  }

  showPhoto() {
    this.uploadService.showPhoto(this.colony.picture, this.colony.name);
  }


}
