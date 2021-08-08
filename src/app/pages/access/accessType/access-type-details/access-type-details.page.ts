import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../../../sharedServices/storage.service';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {BasePage} from '../../../base/base.page';
import {timer} from 'rxjs';
import {AccessTypeService} from '../accessType.service';
import {Events} from '../../../../sharedServices/events.service';

@Component({
  selector: 'app-access-type-details',
  templateUrl: './access-type-details.page.html',
  styleUrls: ['./access-type-details.page.scss'],
})
export class AccessTypeDetailsPage extends BasePage implements OnInit {
  public typeId = null;
  public form: FormGroup;
  public attempt = false;
  public defaultErrorMessage = 'Por favor ingrese un valor válido';

  constructor(
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private nav: NavController,
    private router: Router,
    protected storageService: StorageService,
    protected toastController: ToastController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private keyboard: Keyboard,
    private events: Events,
    private typeService: AccessTypeService
  ) {
    super(storageService, toastController);
    this.form = formBuilder.group(
      {
        name: ['', Validators.compose([Validators.required, Validators.min(5)])],
      });
  }


  ngOnInit() {
    timer(1000).subscribe(() => {
      this.user = this.savedUser;
      this.typeId = this.route.snapshot.params.id;
      if (this.typeId) {
        this.loadType();
      }
    });
  }

  async loadType() {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    this.typeService.get(this.typeId, this.savedUser.colonyId).subscribe(res => {
      this.accessType = res;
      this.form.get('name').setValue(res.name);
      loading.dismiss();
    });
  }

  async saveType() {

    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    if (this.form.valid) {

      this.accessType.name = this.form.value.name;

      if (this.typeId) {
        this.typeService.update(this.accessType, this.typeId, this.user.colonyId).then(() => {
          this.attempt = false;
          this.toast(2000, 'Tipo de acceso actualizado correctamente', 'success');
          this.nav.navigateForward('/list-access-types');
        });
      } else {
        this.typeService.add(this.accessType, this.user.colonyId).then(() => {
          this.attempt = false;
          this.toast(2000, 'Tipo de acceso agregado correctamente', 'success');
          this.nav.navigateForward('/list-access-types');
        });
      }
    } else {
      this.attempt = true;
    }

    loading.dismiss();
  }

  remove() {
    this.typeService.remove(this.typeId, this.user.colonyId);
    this.toast(2000, 'Tipo de acceso eliminado correctamente', 'success');
    this.nav.navigateForward('/list-access-types');
  }

  async confirmMessage() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'Estas seguro que quieres eliminar el tipo de acceso?',
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
}
