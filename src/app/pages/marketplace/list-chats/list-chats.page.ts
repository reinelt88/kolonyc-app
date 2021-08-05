import {Component, OnDestroy, OnInit} from '@angular/core';
import {BasePage} from '../../base/base.page';
import {StorageService} from '../../../sharedServices/storage.service';
import {ToastController} from '@ionic/angular';
import {Subscription, timer} from 'rxjs';
import {ChatService} from '../chat/chat.service';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../product.service';
import {UserService} from '../../users/user.service';

@Component({
    selector: 'app-list-chats',
    templateUrl: './list-chats.page.html',
    styleUrls: ['./list-chats.page.scss'],
})
export class ListChatsPage extends BasePage implements OnInit, OnDestroy {

    public chats = [];
    public productId = null;
    private productSub: Subscription;
    private userSub: Subscription;
    constructor(
        protected storageService: StorageService,
        protected toastController: ToastController,
        private chatService: ChatService,
        private productService: ProductService,
        private userService: UserService,
        private route: ActivatedRoute,
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {
        timer(1000).subscribe(() => {
            this.user = this.savedUser;
            this.productId = this.route.snapshot.params.id;
            this.loadChats();
        });
    }

    ngOnDestroy() {
        timer(1000).subscribe(() => {
            this.productSub.unsubscribe();
            this.userSub.unsubscribe();
        });
    }

    loadChats() {
        const colonyId = this.user.colonyId;
        if (this.productId) {
            this.chatService.geyBySellerIdAndProductId(colonyId, this.productId, this.user.id).then(chats => {
                if (chats.length > 0) {
                    const arrayChats = [];
                    chats.forEach(chat => {
                        this.loadInformation(chat, colonyId).then(res => {
                            if (res) {
                                arrayChats.push(res);
                            }
                        });
                    });
                    this.chats = arrayChats;
                    console.log(this.chats);
                }
            });
        } else {
            // this.chats = [];
            this.chatService.getAllUserChat(colonyId, this.user.id).then(chats => {
                const arrayChats = [];
                chats.forEach(chat => {
                    this.loadInformation(chat, colonyId).then(res => {
                        if (res) {
                            arrayChats.push(res);
                        }
                    });
                });
                this.chats = arrayChats;
                console.log(this.chats);
            });
        }
    }

    async loadInformation(chat: any, colonyId: string) {
        try {

            const chatMod = {
                id: chat.id,
                createdAt: chat.createdAt,
                sellerId: chat.sellerId,
                buyerId: chat.buyerId,
                productId: chat.productId,
                product: '',
                buyer: '',
            };

            const productPromise = this.productService.get(chat.productId, colonyId);
            const userPromise = this.userService.get(chat.buyerId);

            const [product, user] = await Promise.all([productPromise, userPromise]);

            if (product) {
                this.productSub = product.subscribe(p => {
                    if (p) {
                        chatMod.product = p.name;
                    }
                });
            }

            if (user) {
                this.userSub = user.subscribe(u => {
                    if (u) {
                        chatMod.buyer = u.displayName;
                    }
                });
            }

            return chatMod;

        } catch (error) {
            console.error(error);
        }
    }

}
