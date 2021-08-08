import {Component, OnInit} from '@angular/core';
import {BasePage} from '../../base/base.page';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {UploadService} from '../../../sharedServices/upload.service';
import {StorageService} from '../../../sharedServices/storage.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {AreaService} from '../area.service';
import {timer} from 'rxjs';
import {BookingService} from '../booking/booking.service';
import {Events} from '../../../sharedServices/events.service';

@Component({
  selector: 'app-area-details',
  templateUrl: './area-details.page.html',
  styleUrls: ['./area-details.page.scss'],
})
export class AreaDetailsPage extends BasePage implements OnInit {

  public areaId = null;
  public form: FormGroup;
  public attempt = false;
  public defaultErrorMessage = 'Por favor ingrese un valor válido';
  public bookings = [];

  public daysOfWeek = [
    {id: 1, name: 'Lunes'},
    {id: 2, name: 'Martes'},
    {id: 3, name: 'Miércoles'},
    {id: 4, name: 'Jueves'},
    {id: 5, name: 'Viernes'},
    {id: 6, name: 'Sábado'},
    {id: 0, name: 'Domingo'},
  ];

  public hours = [
    {id: '00:00', name: '00:00'},
    {id: '01:00', name: '01:00'},
    {id: '02:00', name: '02:00'},
    {id: '03:00', name: '03:00'},
    {id: '04:00', name: '04:00'},
    {id: '05:00', name: '05:00'},
    {id: '06:00', name: '06:00'},
    {id: '07:00', name: '07:00'},
    {id: '08:00', name: '08:00'},
    {id: '09:00', name: '09:00'},
    {id: '10:00', name: '10:00'},
    {id: '11:00', name: '11:00'},
    {id: '12:00', name: '12:00'},
    {id: '13:00', name: '13:00'},
    {id: '14:00', name: '14:00'},
    {id: '15:00', name: '15:00'},
    {id: '16:00', name: '16:00'},
    {id: '17:00', name: '17:00'},
    {id: '18:00', name: '18:00'},
    {id: '19:00', name: '19:00'},
    {id: '20:00', name: '20:00'},
    {id: '21:00', name: '21:00'},
    {id: '22:00', name: '22:00'},
    {id: '23:00', name: '23:00'},
    {id: '224:00', name: '24:00'},
  ];

  constructor(
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private nav: NavController,
    private router: Router,
    private areaService: AreaService,
    private uploadService: UploadService,
    protected storageService: StorageService,
    protected toastController: ToastController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private keyboard: Keyboard,
    private events: Events,
    private bookingService: BookingService,
  ) {
    super(storageService, toastController);
    this.form = formBuilder.group(
      {
        name: ['', Validators.compose([Validators.required, Validators.min(5)])],
        picture: [''],
        daysOfWeek: ['', Validators.required],
        startHour: ['', Validators.required],
        endHour: ['', Validators.required],
      });
  }

  ngOnInit() {
    timer(1000).subscribe(() => {
      this.areaId = this.route.snapshot.params.id;
      this.user = this.savedUser;

      if (this.areaId) {
        this.loadArea();
      }
    });
  }

  async loadArea() {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    this.areaService.get(this.areaId, this.user.colonyId).subscribe(res => {
      this.area = res;

      this.form.get('name').setValue(res.name);
      this.form.get('picture').setValue(res.picture);
      this.form.get('daysOfWeek').setValue(res.daysOfWeek);
      this.form.get('startHour').setValue(res.startHour);
      this.form.get('endHour').setValue(res.endHour);

      this.bookingService.getNextBookings(this.areaId, this.user.colonyId).then(bookings => {
        this.bookings = bookings;
        // console.log(bookings);
      });

      loading.dismiss();
    });

  }

  async saveArea() {

    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    if (this.form.valid) {
      this.form.value.picture = this.area.picture;
      this.area.name = this.form.value.name;
      this.area.daysOfWeek = this.form.value.daysOfWeek;
      this.area.startHour = this.form.value.startHour;
      this.area.endHour = this.form.value.endHour;

      if (this.areaId) {

        this.areaService.update(this.areaId, this.area, this.user.colonyId).then(() => {
          this.attempt = false;
          this.toast(2000, 'Área actualizada correctamente', 'success');
          this.nav.navigateForward('/list-areas');
        });
      } else {
        this.areaService.add(this.area, this.user.colonyId).then(() => {
          this.attempt = false;
          this.toast(2000, 'Área agregada correctamente', 'success');
          this.nav.navigateForward('/list-areas');
        });
      }
    } else {
      this.attempt = true;
    }

    loading.dismiss();
  }

  remove() {
    this.areaService.remove(this.areaId, this.user.colonyId);
    this.nav.navigateForward('/list-areas');
  }

  async confirmMessage() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'Estas seguro que quieres eliminar el area?',
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

  // *******************************Image managment

  async loadImage(method: string) {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();
    const path = 'areas';

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

    if (this.areaId) {
      this.areaService.update(this.areaId, this.area, this.user.colonyId).then(() => {
      });
    }
  }

  showPhoto() {
    this.uploadService.showPhoto(this.colony.picture, this.colony.name);
  }
}
