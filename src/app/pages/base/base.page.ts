import {User} from '../../models/user';
import {StorageService} from '../../sharedServices/storage.service';
import {ToastController} from '@ionic/angular';
import {Person} from '../../models/person';
import {Access} from '../../models/access';
import {Colony} from '../../models/colony';
import firebase from 'firebase/app';
import 'firebase/storage';
import {Image} from '../../models/image';
import {Component} from '@angular/core';
import {Expense} from '../../models/expense';
import {Receipt} from '../../models/receipt';
import {ReceiptType} from '../../models/receiptType';
import {ExpenseType} from '../../models/expenseType';
import {Admin} from '../../models/admin';
import {Security} from '../../models/security';
import {House} from '../../models/house';
import {Payment} from '../../models/payment';
import {Notification} from '../../models/notification';
import {Area} from '../../models/area';
import {Booking} from '../../models/booking';
import {Poll} from '../../models/poll';
import {PollOption} from '../../models/pollOption';
import * as moment from 'moment';
import {MarketplaceCategory} from '../../models/marketplaceCategory';
import {Product} from '../../models/product';
import {AccessType} from '../../models/accessType';
import {Chat} from '../../models/chat';

@Component({
    templateUrl: './base.page.html',
})
export class BasePage {

    public noImage = 'https://firebasestorage.googleapis.com/v0/b/colonyc-14f60.appspot.com/o/no-image.PNG?alt=media&token=f40787bf-1ff9-4888-bf06-6f02d5a2123a';

    public now = firebase.firestore.FieldValue.serverTimestamp();

    public months = [
        {id: 1, name: 'Enero'},
        {id: 2, name: 'Febrero'},
        {id: 3, name: 'Marzo'},
        {id: 4, name: 'Abril'},
        {id: 5, name: 'Mayo'},
        {id: 6, name: 'Junio'},
        {id: 7, name: 'Julio'},
        {id: 8, name: 'Agosto'},
        {id: 9, name: 'Septiembre'},
        {id: 10, name: 'Octubre'},
        {id: 11, name: 'Noviembre'},
        {id: 12, name: 'Diciembre'},
    ];
    savedUser: User = {
        id: '',
        uid: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        displayName: '',
        profilePicture: this.noImage,
        colonyId: '',
        houseId: '',
        token: '',
        connected: false,
        savedProducts: [],
        createdAt: this.now,
    };

    user: User = {
        id: '',
        email: '',
        phone: '',
        password: '',
        uid: '',
        role: '',
        profilePicture: this.noImage,
        displayName: '',
        colonyId: '',
        houseId: '',
        token: '',
        connected: false,
        savedProducts: [],
        createdAt: this.now,
    };

    admin: Admin = {
        userId: '',
        createdAt: this.now,
    };

    security: Security = {
        userId: '',
        createdAt: this.now,
    };

    person: Person = {
        name: '',
        document_1: this.noImage,
        document_2: this.noImage,
        inDate: '',
        outDate: '',
        status: 'pendiente',
        companions: 0,
        speechRecognition: '',
        createdAt: this.now,
    };

    access: Access = {
        code: '',
        houseId: '',
        status: '',
        startDate: '',
        endDate: '',
        createdAt: this.now,
        createdBy: '',
        accessType: '',
        callResident: false,
    };

    notification: Notification = {
        title: '',
        status: 'unread',
        createdAt: this.now,
    };

    expense: Expense = {
        description: '',
        amount: 0,
        type: '',
        evidence: this.noImage,
        createdAt: this.now
    };

    receipt: Receipt = {
        description: '',
        amount: 0,
        type: '',
        evidence: this.noImage,
        createdAt: this.now
    };

    receiptType: ReceiptType = {
        name: ''
    };

    expenseType: ExpenseType = {
        name: ''
    };

    colony: Colony = {
        name: '',
        picture: this.noImage,
        type: '',
        usePaypal: false,
        paypalClientId: '',
        paypalClientSecret: '',
        address: {
            country: '',
            number: '',
            municipality: '',
            postalCode: null,
            state: '',
            street: ''
        },
        createdAt: this.now,
    };

    image: Image = {
        image: '',
        type: '',
    };

    house: House = {
        id: '',
        place: '',
        number: '',
        createdAt: this.now,
    };

    payment: Payment = {
        status: '',
        houseId: '',
        month: 0,
        year: 0,
        evidence: this.noImage,
        referenceNumber: '',
        type: '',
        notes: '',
        amount: 0,
        createdAt: this.now,
    };

    area: Area = {
        name: '',
        picture: this.noImage,
        daysOfWeek: [],
        startHour: '',
        endHour: '',
        createdAt: this.now,
    };

    booking: Booking = {
        title: '',
        startTime: '',
        endTime: '',
        allDay: '',
        desc: '',
        userId: '',
        createdAt: this.now,
    };

    poll: Poll = {
        name: '',
        description: '',
        endDate: moment().format(),
        createdAt: this.now,
        voters: []
    };

    pollOption: PollOption = {
        name: '',
        quantity: 0
    };

    marketplaceCategory: MarketplaceCategory = {
        name: '',
        createdAt: this.now,
    };

    product: Product = {
        name: '',
        description: '',
        price: 0,
        offerPrice: 0,
        productStatus: '',
        publicationStatus: '',
        showPhone: false,
        userId: '',
        pictures: [],
        categoryId: '',
        createdAt: this.now
    };

    accessType: AccessType = {
        name: ''
    };

    chat: Chat = {
        sellerId: '',
        buyerId: '',
        productId: '',
        message: '',
        sendBy: '',
        createdAt: this.now,
    };

    color = null;

    constructor(
        protected storageService: StorageService,
        protected toastController: ToastController,
    ) {
        this.loadData();
    }

    loadData() {
        this.storageService.getObject('user').then(res => {
            if (res) {
                this.savedUser = res;
            }
        }, error => console.log('Error ', error));
    }

    async toast(d: number, m: string, c: string) {
        const toast = await this.toastController.create({
            message: m,
            duration: d,
            position: 'bottom',
            color: c
        });
        toast.present();
    }
}
