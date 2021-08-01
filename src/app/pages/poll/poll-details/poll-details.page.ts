import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BasePage} from '../../base/base.page';
import {StorageService} from '../../../sharedServices/storage.service';
import {AlertController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {PollService} from '../poll.service';
import {PollOptionService} from '../pollOption.service';
import {timer} from 'rxjs';
import * as moment from 'moment';
import {PollOption} from '../../../models/pollOption';
import {PushNotification} from '../../../models/pushNotification';
import {HttpService} from '../../../sharedServices/http.service';
import {UserService} from '../../users/user.service';


@Component({
    selector: 'app-poll-details',
    templateUrl: './poll-details.page.html',
    styleUrls: ['./poll-details.page.scss'],
})
export class PollDetailsPage extends BasePage implements OnInit {

    public pollId = null;
    public show = false;
    public form: FormGroup;
    public attempt = false;
    public defaultErrorMessage = 'Por favor ingrese un valor válido';
    public minDate: string = moment().format();
    public endDate: string = moment().format();
    public pollOptions = [];
    public selectedOptionId = '';
    public hasVoted = false;
    public totalVotes = 0;
    constructor(
        protected storageService: StorageService,
        protected toastController: ToastController,
        private loadingController: LoadingController,
        private route: ActivatedRoute,
        private nav: NavController,
        private router: Router,
        private pollService: PollService,
        private pollOptionService: PollOptionService,
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private httpService: HttpService,
        private userService: UserService
    ) {
        super(storageService, toastController);
        this.form = formBuilder.group(
            {
                name: ['', Validators.required],
                description: ['', Validators.required],
            });
    }

    ngOnInit() {
        this.pollId = this.route.snapshot.params.id;

        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            if (this.pollId) {
                this.loadPoll();
            }
        });
    }

    async loadPoll() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.pollService.get(this.pollId, this.user.colonyId).subscribe(res => {
            this.pollOptions = [];
            this.poll = res;

            if (this.poll.voters.find(x => x === this.user.id)) {
                this.hasVoted = true;
            }
            this.form.get('name').setValue(res.name);
            this.form.get('description').setValue(res.description);

            this.endDate = new Date(res.endDate.seconds * 1000).toISOString();

            this.pollOptionService.getTotalVotes(this.pollId, this.user.colonyId).then(a => {
                this.totalVotes = a;

                this.pollOptionService.getAll(this.pollId, this.user.colonyId).subscribe(r => {

                    let per = 0;
                    let perForm = 0;

                    const arr = [];

                    r.forEach(i => {
                        per = i.quantity / this.totalVotes;
                        // @ts-ignore
                        // perForm = per.toFixed(2) * 100;
                        perForm = (per * 100).toFixed(2);

                        const po = {
                            id: i.id,
                            name: i.name,
                            quantity: i.quantity,
                            percent: per,
                            percentFormated: perForm
                        };

                        arr.push(po);

                    });

                    this.pollOptions = arr;
                });
            });
            loading.dismiss();
            this.show = true;
        });
    }

    async savePoll() {

        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();
        this.show = false;
        if (this.user.role === 'RESIDENT') {
             if (this.selectedOptionId !== '') {
                const found = this.poll.voters.find(x => x === this.user.id);
                if (!found) {
                    this.pollOptionService.getPollOption(this.selectedOptionId, this.pollId, this.user.colonyId).subscribe(res => {
                        const data = res.data();
                        data.quantity = data.quantity + 1;

                        const pollOption: PollOption = {
                          name: data.name,
                          quantity: data.quantity
                        };

                        this.pollOptionService.update(this.selectedOptionId, pollOption, this.pollId, this.user.colonyId).then(r => {
                            // @ts-ignore
                            this.poll.voters.push(this.user.id);
                            this.pollService.update(this.pollId, this.poll, this.user.colonyId).then(result => {
                                this.toast(2000, 'Votación exitosa, gracias por su tiempo', 'success');
                            });
                        });
                    });

                } else {
                    this.toast(4000, 'Lo sentimos ya usted realizo su votación para esta encuesta', 'danger');
                }


            } else {
                this.toast(4000, 'Debe de seleccionar una opcion', 'danger');
            }
        } else {
            if (this.form.valid) {

                this.poll.name = this.form.value.name;
                this.poll.description = this.form.value.description;

                this.poll.endDate = moment(this.endDate, 'YYYY-MM-DD HH:mm').toDate();

                const colonyId = this.user.colonyId;

                if (this.pollId) {

                    this.pollService.update(this.pollId, this.poll, colonyId).then((upd) => {
                    });

                    this.pollOptions.forEach(po => {
                        const pollOptionCpy: PollOption = {
                            name: po.name,
                            quantity: 0
                        };

                        this.pollOptionService.getByName(this.pollId, colonyId, po.name).then(o => {
                            if (o.docs.length === 0) {
                                this.pollOptionService.add(pollOptionCpy, this.pollId, colonyId).then(res => {});
                            }
                        });
                    });

                    this.attempt = false;
                    this.toast(2000, 'Encuesta actualizada correctamente', 'success');
                    this.nav.navigateForward('/list-polls');

                } else {
                    this.pollService.add(this.poll, colonyId).then((poll) => {
                        this.pollOptions.forEach(po => {

                            const pollOptionCpy: PollOption = {
                                name: po.name,
                                quantity: 0
                            };

                            this.pollOptionService.add(pollOptionCpy, poll.id, colonyId).then(res => { console.log(res); }, e => console.log(e));

                            const notification: PushNotification = {
                                notification: {
                                    title: 'Nueva encuesta - ' + this.poll.name,
                                    body: this.poll.description,
                                },
                                registration_ids: []
                            };

                            this.userService.getByColonyAndRole(colonyId, 'RESIDENT').then(res => {
                                if (res.docs.length > 0) {
                                    res.docs.forEach(d => {
                                        const {token} = d.data();
                                        if (token !== '') {
                                            // @ts-ignore
                                            notification.registration_ids.push(token);
                                        }
                                    });
                                }
                                console.log(notification);
                            });

                            this.httpService.pushNotification(notification).subscribe(res => {
                                console.log(res);
                            }, error1 => console.log(error1));

                        });
                        this.attempt = false;
                        this.toast(2000, 'Encuesta agregada correctamente', 'success');
                        this.nav.navigateForward('/list-polls');
                    });
                }
            } else {
                this.attempt = true;
            }
        }
        loading.dismiss();
        this.show = true;
    }

    remove() {
        this.pollService.remove(this.pollId, this.user.colonyId);
        this.toast(2000, 'Encuesta eliminada correctamente', 'success');
        this.nav.navigateForward('/list-polls');
    }

    updateEndDate($event) {
        if ($event.detail.value.seconds !== undefined) {
            this.endDate = new Date($event.detail.value.seconds * 1000).toISOString();
        } else {
            this.endDate = $event.detail.value;
        }
    }

    async confirmMessage() {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar la encuesta?',
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

    addPollOption() {
        this.pollOption.quantity = 0;

        const pollOptionCpy: PollOption = {
            name: this.pollOption.name,
            quantity: 0,
            id: moment().unix().toString()
        };

        const found =  this.pollOptions.find(x => x.name === this.pollOption.name);

        if (found) {
            this.toast(2000, 'Opción existente', 'danger');
        } else {
            this.pollOptions.push(pollOptionCpy);

            this.pollOption.name = '';
            this.toast(2000, 'Opción añadida', 'success');
        }
    }

    removePollOption(id: string) {

        this.pollOptions = this.pollOptions.filter( h => h.id !== id);
        this.pollOptionService.get(id, this.pollId, this.user.colonyId).subscribe(r => {
            if (r) {
                this.pollOptionService.remove(id, this.pollId, this.user.colonyId).then(res => {}, e => console.log(e));
            }
        }, error1 => console.log(error1));
        this.toast(2000, 'Opción eliminada', 'success');
    }

}
