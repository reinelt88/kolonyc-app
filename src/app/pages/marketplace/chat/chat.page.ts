import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BasePage} from '../../base/base.page';
import {StorageService} from '../../../sharedServices/storage.service';
import {Platform, ToastController} from '@ionic/angular';
import {Subscription, timer} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatService} from './chat.service';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {UserService} from '../../users/user.service';
import {User} from '../../../models/user';
import firebase from 'firebase/app';
import 'firebase/storage';
import {ProductService} from '../product.service';
import {HttpService} from '../../../sharedServices/http.service';
import {PushNotification} from '../../../models/pushNotification';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
})
export class ChatPage extends BasePage implements OnInit, OnDestroy {

  @ViewChild('content', {static: false}) private content: any;
  public productId = null;
  public sellerId = null;
  public buyerId = null;
  public chats: any;
  public typeOfAnotherUser = null;
  public anotherUser: User = {
      uid: '',
      email: '',
      phone: '',
      password: '',
      role: '',
      displayName: 'Desconocido',
      profilePicture: '',
      colonyId: '',
      token: '',
      connected: false,
      savedProducts: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  private meSub: Subscription;
  private anotherUserSub: Subscription;
  private productSub: Subscription;
  private notificationSub: Subscription;

    constructor(
        private platform: Platform,
        protected storageService: StorageService,
        protected toastController: ToastController,
        private router: Router,
        private route: ActivatedRoute,
        private chatService: ChatService,
        private keyboard: Keyboard,
        private userService: UserService,
        private productService: ProductService,
        private httpService: HttpService,
    ) {
        super(storageService, toastController);
    }



    ngOnDestroy() {
        timer(1000).subscribe(() => {

            if (this.meSub) {
                this.meSub.unsubscribe();
            }

            if (this.anotherUserSub) {
                this.anotherUserSub.unsubscribe();
            }

            if (this.productSub) {
                this.productSub.unsubscribe();
            }

            if (this.notificationSub) {
                this.notificationSub.unsubscribe();
            }

            this.user.connected = false;
            this.userService.update(this.user, this.user.id).then(() => {
                // this.meSub.unsubscribe();
                console.log('ngOnDestroy');
            }, e => console.log(e));
        });
    }

    ngOnInit() {
        this.platform.pause.subscribe(() => {
            this.meSub.unsubscribe();
        });

        this.platform.resume.subscribe(() => {
            this.load();
        });

        this.load();
    }

    load() {
        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            this.chat.productId = this.route.snapshot.params.productId;
            this.chat.sellerId = this.route.snapshot.params.sellerId;
            this.chat.buyerId = this.route.snapshot.params.buyerId;
            this.chat.sendBy = this.user.id;

            this.chatService.geyBySellerIdAndBuyerIdAndProductId(
                this.user.colonyId,
                this.chat.productId,
                this.chat.sellerId,
                this.chat.buyerId,
            ).subscribe(res => {

                if (res.length > 0) {
                    this.chats = res;

                    let me = '';
                    let other = '';

                    if (res[0].sellerId === this.user.id) {
                        other = res[0].buyerId;
                        me = res[0].sellerId;
                        this.typeOfAnotherUser = 'Comprador';
                    } else {
                        other = res[0].sellerId;
                        me = res[0].buyerId;
                        this.typeOfAnotherUser = 'Vendedor';
                    }

                    this.loadInformation(other, me);

                    this.scrollToBottomOnInit();
                }

            });
        });
    }

    scrollToBottomOnInit() {
        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom(400);
            }
        }, 500);
    }

    sendMessage() {
        this.chatService.add(this.chat, this.user.colonyId).then(() => {
            if (!this.anotherUser.connected) {
                const notification: PushNotification = {
                    notification: {
                        title: this.product.name + ' - ' + this.user.displayName,
                        body: this.chat.message,
                        // image: this.anotherUser.profilePicture
                    },
                    to: this.anotherUser.token,
                    data: {
                        type: 'marketplace',
                        productId: this.chat.productId,
                        sellerId: this.chat.sellerId,
                        buyerId: this.chat.buyerId
                    }
                };
                console.log(notification);
                this.notificationSub = this.httpService.pushNotification(notification).subscribe(sub => {
                    console.log(sub);
                });
            }
            this.chat.message = '';
        }, e => console.log(e));
    }

    async loadInformation(other: string, m: string) {
        console.log('Load information');
        try {
            const mePromise = this.userService.get(m);
            const anotherUserPromise = this.userService.get(other);
            const productPromise = this.productService.get(this.chat.productId, this.user.colonyId);

            const [me, anotherUser, product] = await Promise.all([mePromise, anotherUserPromise, productPromise]);

            if (me) {
                this.meSub = me.subscribe(meRes => {
                    if (meRes) {
                        this.user = meRes;
                        this.user.connected = true;
                        this.userService.update(this.user, this.user.id).then(() => {});
                    }
                });
            }

            if (anotherUser) {
                this.anotherUserSub = anotherUser.subscribe(anotherUserRes => {
                    if (anotherUserRes) {
                        this.anotherUser = anotherUserRes;
                    }
                });
            }

            if (product) {
                this.productSub = product.subscribe(productRes => {
                    if (productRes) {
                        this.product = productRes;
                    }
                });
            }

        } catch (e) {
            console.log(e);
        }
    }
}
