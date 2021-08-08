import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';
import {CalendarComponent} from 'ionic2-calendar';
import {formatDate} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {timer} from 'rxjs';
import {BookingService} from '../booking.service';
import {AreaService} from '../../area.service';
import {BasePage} from '../../../base/base.page';
import {StorageService} from '../../../../sharedServices/storage.service';
import * as moment from 'moment';
import {HouseService} from '../../../resident/house.service';


@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage extends BasePage implements OnInit {

  public event = {
    title: '',
    desc: '',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false
  };

  public startTime: string;
  public endTime: string;
  public areaId = null;
  public collapseCard = false;
  public minDate = moment().format();
  public eventSource = [];
  public viewTitle;
  public calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'es-mx',
    allDayLabel: 'Todo el día',
    noEventsLabel: 'Sin eventos',
    startHour: 6,
    endHour: 24
  };
  public dataLoaded = false;

  @ViewChild(CalendarComponent, {static: false}) myCal: CalendarComponent;

  constructor(
    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private areaService: AreaService,
    private houseService: HouseService,
    protected storageService: StorageService,
    protected toastController: ToastController
  ) {
    super(storageService, toastController);
    // console.log(new Date(), new Date().toISOString());
  }

  ngOnInit() {
    this.areaId = this.route.snapshot.params.id;
    timer(1000).subscribe(() => {
      this.user = this.savedUser;
      this.areaService.get(this.areaId, this.user.colonyId).subscribe(area => {
        if (area) {
          this.area = area;
          // this.resetEvent();
          // tslint:disable-next-line:radix
          this.calendar.startHour = parseInt(area.startHour, 10);
          // tslint:disable-next-line:radix
          this.calendar.endHour = parseInt(area.endHour, 10) + 1;
          this.startTime = moment().format();
          this.endTime = moment().format();
          this.dataLoaded = true;
        }
      });

    });
  }

  onRangeChanged(ev) {
    this.bookingService.getAll(this.areaId, this.user.colonyId).subscribe(obs => {
      const tmp = [];
      obs.forEach(o => {
        const eventCopy = {
          title: o.title,
          startTime: new Date(o.startTime.seconds * 1000),
          endTime: new Date(o.endTime.seconds * 1000),
          allDay: o.allDay,
          desc: o.desc
        };
        tmp.push(eventCopy);
      });
      this.eventSource = tmp;
    });
  }

  getMonthviewHighLevelClass = (date: Date): string => {
    const classResult = '';
    if (this.markDisabled(date)) {
      return 'disabled-day';
    }
    return classResult;
  };

  markDisabled = (date: Date): boolean => {
    const current = new Date();
    const currentDayfromDate = date.getDay();
    const currentYear = current.getFullYear();
    const currentMonth = current.getUTCMonth();
    const currentDay = current.getUTCDate();
    const currentDateWithinHours = new Date(currentYear, currentMonth, currentDay);

    const year = date.getFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const dateWithinHours = new Date(year, month, day);

    const daysOfWeek = this.area.daysOfWeek;
    const compare = dateWithinHours.getTime() < currentDateWithinHours.getTime();
    //
    let exist = true;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i <= daysOfWeek.length; i++) {
      // tslint:disable-next-line:radix
      if (currentDayfromDate === parseInt(daysOfWeek[i])) {
        exist = false;
        break;
      }
    }
    //
    // // @ts-ignore
    // // return compare;
    return compare || exist;
    // return exist;
  };

  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }

  // Create the right event format and reload source
  addEvent() {

    this.booking.title = this.event.title;
    this.booking.allDay = this.event.allDay;
    this.booking.desc = this.event.desc;
    this.booking.startTime = new Date(this.startTime);
    this.booking.endTime = new Date(this.endTime);
    this.booking.userId = this.user.id;

    this.bookingService.getBookingsInDate(this.booking.startTime, this.areaId, this.user.colonyId).then(res => {
      // tslint:disable-next-line:radix
      const min = parseInt(this.area.startHour);
      // tslint:disable-next-line:radix
      const max = parseInt(this.area.endHour);

      const startTime = new Date(this.startTime);
      const startHour = startTime.getHours();
      const endTime = new Date(this.endTime);
      const endHour = endTime.getHours();

      if (res === 0) {

        if (startTime.getTime() < endTime.getTime()) {
          if ((startHour >= min && startHour < max) && (endHour >= min && endHour <= max)) {
            this.bookingService.add(this.booking, this.areaId, this.user.colonyId).then(r => {
              this.event.startTime = new Date(this.startTime).toISOString();
              this.event.endTime = new Date(this.endTime).toISOString();
              this.eventSource.push(this.event);
              this.myCal.loadEvents();
              this.resetEvent();
              this.toast(2000, 'Reserva agregada correctamente', 'success');
            }, e => console.log(e));
          } else {
            this.toast(4000, 'Solo se permiten reservas en el horario comprendido de '
              + this.area.startHour + ' - ' + this.area.endHour, 'danger');
          }

        } else {
          this.toast(4000, 'La fecha inicio debe de ser menor a la de fin', 'danger');
        }

      } else {
        this.toast(4000, 'Ya existe una reserva para el horario seleccionado', 'danger');
      }
    });
  }

  // Change current month/week/day
  next() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  back() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onViewTitleChanged(title) {
    const replaced = title.replace('Week', 'Semana');
    this.viewTitle = replaced;
  }

// Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    const start = formatDate(event.startTime, 'medium', this.locale);
    const end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'Desde: ' + start + '<br><br>Hasta: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

// Time slot was clicked
  onTimeSelected(ev) {
    // debugger;
    const selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

  updateStartTime($event) {
    this.startTime = $event.detail.value;
  }

  updateEndTime($event) {
    this.endTime = $event.detail.value;
  }
}
