import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PersonService} from '../person.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BasePage} from '../../base/base.page';
import {StorageService} from '../../../sharedServices/storage.service';
import {AlertController, LoadingController, ModalController, Platform, ToastController} from '@ionic/angular';
import {now} from 'moment';
import {AccessService} from '../../access/access.service';
import {timer} from 'rxjs';
import {SpeechRecognition} from '@ionic-native/speech-recognition/ngx';
import {PersonDetailsHelpPage} from '../../help/person-details-help/person-details-help.page';
import {UploadService} from '../../../sharedServices/upload.service';
import {Events} from '../../../sharedServices/events.service';

@Component({
    selector: 'app-person-details',
    templateUrl: './person-details.page.html',
    styleUrls: ['./person-details.page.scss'],
})
export class PersonDetailsPage extends BasePage implements OnInit {

    personId = null;
    accessId = null;
    colonyId = null;
    inDate: string;
    outDate: string;
    isRecording = false;
    imageResponse: any;
    options: any;

    constructor(
        protected storageService: StorageService,
        protected toastController: ToastController,
        private personService: PersonService,
        private router: Router,
        private route: ActivatedRoute,
        private loadingController: LoadingController,
        private events: Events,
        private accessService: AccessService,
        private speechRecognition: SpeechRecognition,
        private platform: Platform,
        private changeDetectorRef: ChangeDetectorRef,
        private alertController: AlertController,
        private modalController: ModalController,
        private uploadService: UploadService
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {
        this.personId = this.route.snapshot.params.id;
        this.accessId = this.route.snapshot.params.access;
        this.colonyId = this.route.snapshot.params.colony;

        timer(1000).subscribe(() => {
            if (this.personId && this.accessId) {
                this.personService.get(this.personId, this.accessId, this.colonyId).subscribe(person => {

                    this.person = person;

                    if (this.person.inDate) {
                        this.inDate = new Date(this.person.inDate.seconds * 1000).toISOString();
                    }

                    if (this.person.outDate) {
                        this.outDate = new Date(this.person.outDate.seconds * 1000).toISOString();
                    }

                    this.accessService.get(this.accessId, this.colonyId).subscribe(res => this.access = res);
                });
            }
        });
    }

    processAccess(type: string) {

        let status = '';
        let message = '';
        if (type === 'in') {
            this.person.inDate = new Date(now());
            status = 'en curso';
            message = 'Acceso concedido';
        } else {
            this.person.outDate = new Date(now());
            status = 'completado';
            message = 'Acceso finalizado correctamente';
        }

        this.person.status = status;
        this.personService.update(this.personId, this.person, this.accessId, this.colonyId).then(res => {

            // this.access.status = status;

            let accessStatus = '';
            this.personService.getAll(this.accessId, this.colonyId).subscribe(persons => {

                const personsQty = persons.length;
                const hasLeft = [];
                if (personsQty > 0) {
                    persons.forEach(p => {
                        if (p.outDate !== '' && p.inDate !== '') {
                            hasLeft.push(p);
                        }
                    });

                    accessStatus = (personsQty > hasLeft.length) ? 'en curso' : 'completado';
                    this.access.status = accessStatus;

                    this.accessService.update(this.accessId, this.access, this.colonyId).then(() => {
                        this.toast(2000, message, 'success');
                        this.router.navigateByUrl('/access-details/' + this.accessId);
                    });
                }
            });
        });
    }

    removePerson() {
        this.personService.remove(this.personId, this.accessId, this.colonyId);
        this.router.navigateByUrl('/access-details/' + this.accessId);
    }

    // *******************************Speech Recognition

    isIos() {
        return this.platform.is('ios');
    }

    stopListening() {
        this.speechRecognition.stopListening().then(() => {
            this.isRecording = false;
        });
    }

    ionViewWillEnter() {
        this.getSpeechPermission();
    }

    startListening() {
        const options = {
            language: 'es-ES',
            matches: 1,
        };
        this.speechRecognition.startListening(options).subscribe(matches => {
            this.person.speechRecognition = matches[0];
            this.changeDetectorRef.detectChanges();
            this.personService.update(this.personId, this.person, this.accessId, this.colonyId).then(() => {
            });
        });
        this.isRecording = true;
    }

    getSpeechPermission() {
        this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
            if (!hasPermission) {
                this.speechRecognition.requestPermission();
            }
        });
    }


    async confirmMessage(type: string) {
        const alert = await this.alertController.create({
            header: (type === 'in') ? 'Solicitud de acceso' : 'Solicitud de salida',
            message: (type === 'in') ? 'Estas seguro que la persona puede pasar?' : 'Estas seguro que la persona puede salir?',
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
                        this.processAccess(type);
                    }
                }
            ]
        });

        await alert.present();
    }

    async helpModal() {
        const modal = await this.modalController.create({
            component: PersonDetailsHelpPage
        });
        return await modal.present();
    }

    async deleteConfirmMessage() {
        const alert = await this.alertController.create({
            header: 'Confirmación',
            message: 'Estas seguro que quieres eliminar a la persona?',
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
                        this.removePerson();
                    }
                }
            ]
        });

        await alert.present();
    }



    // *******************************Image managment

    async loadImage(method: string, n: number) {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();
        const path = 'person-document_' + n;

        if (method === 'takePicture') {
            this.uploadService.takePicture(path).then((res) => {
                this.events.subscribe(path, (url) => {
                    this.updateImage(url, n);
                    loading.dismiss();
                });
            });
        } else {
            this.uploadService.getImages(path, 1);
            this.events.subscribe(path, (url) => {
                this.updateImage(url, n);
                loading.dismiss();
            });
        }
        this.toast(2000, 'Carga completada', 'success');
    }

    updateImage(url: string, n: number) {

        if (n === 1) {
            this.person.document_1 = url;
        } else {
            this.person.document_2 = url;
        }

        this.personService.update(this.personId, this.person, this.accessId, this.colonyId).then(res => {});
    }

    showPhoto(n: number) {
        if (n === 1) {
            this.uploadService.showPhoto(this.person.document_1, 'Identificación');
        } else {
            this.uploadService.showPhoto(this.person.document_2, 'Matrícula');
        }
    }




}
