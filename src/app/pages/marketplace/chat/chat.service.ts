import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Chat} from '../../../models/chat';
import {UserService} from '../../users/user.service';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    public tableData: any[] = [];
    public limit = 8;
    public colonyId = null;
    private collection: AngularFirestoreCollection<Chat>;
    private obj: Observable<Chat[]>;


    constructor(
        private db: AngularFirestore,
        private userService: UserService,
    ) {
    }

    getCollection(colonyId: string) {
        return this.collection = this.db.collection<Chat>('/colony/' + colonyId + '/chat', ref => ref.orderBy('createdAt', 'desc'));
    }

    getAll(colonyId: string) {
        return this.obj = this.getCollection(colonyId).snapshotChanges().pipe(map(
            actions => actions.map(
                    a => {

                        const data = a.payload.doc.data();

                        const id = a.payload.doc.id;

                        return {id, ...data};
                    }
                )
            )
        );
    }

    add(obj: Chat, colonyId: string) {
        return this.getCollection(colonyId).add(obj);
    }

    remove(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc(id).delete();
    }

    get(id: string, colonyId: string) {
        return this.getCollection(colonyId).doc<Chat>(id).valueChanges();
    }

    update(id: string, obj: Chat, colonyId: string) {
        return this.getCollection(colonyId).doc(id).update(obj);
    }

    geyBySellerIdAndProductId(colonyId: string, productId: string, sellerId: string) {
        return this.db.collection<Chat>('/colony/' + colonyId + '/chat')
            .ref.where('productId', '==', productId)
            .where('sellerId', '==', sellerId)
            .orderBy('createdAt', 'desc')
            .get().then( chats => {
                if (chats.docs.length > 0) {
                    const chatsArr = [];
                    chats.docs.forEach(c => {
                        const chat = c.data();
                        chat.createdAt = new Date(chat.createdAt.seconds * 1000).toLocaleString();
                        chat.id = c.id;
                        if (!chatsArr.find(chatArr => chatArr.buyerId === chat.buyerId && chatArr.productId === productId)) {
                            chatsArr.push(chat);
                        }
                    });

                    return chatsArr;
                }

                return [];
            });
    }

    geyBySellerIdAndBuyerIdAndProductId(colonyId: string, productId: string, sellerId: string, buyerId: string) {
        return this.obj = this.db.collection<Chat>('/colony/' + colonyId + '/chat',
            ref => ref.orderBy('createdAt', 'asc')
                .where('productId', '==', productId)
                .where('sellerId', '==', sellerId)
                .where('buyerId', '==', buyerId)
                ).snapshotChanges().pipe(map(
            actions => {
                return actions.map(
                    a => {

                        const data = a.payload.doc.data();

                        if (data.createdAt) {
                            data.createdAt = new Date(data.createdAt.seconds * 1000).toLocaleString();
                        }

                        const id = a.payload.doc.id;
                        return {id, ...data};

                    }
                );
            }
            )
        );
    }

    async getAllUserChat(colonyId: string, userId: string) {
        const sellers = this.db.collection<Chat>('/colony/' + colonyId + '/chat')
            .ref.where('sellerId', '==', userId)
            .get();
        const buyers = this.db.collection<Chat>('/colony/' + colonyId + '/chat')
            .ref.where('buyerId', '==', userId)
            .get();

        const [sellersQuerySnapshot, buyersQuerySnapshot] = await Promise.all([
            sellers,
            buyers
        ]);

        const arr = [];
        sellersQuerySnapshot.docs.forEach(s => {
            const chat = s.data();
            chat.id = s.id;
            chat.createdAt = new Date(chat.createdAt.seconds * 1000).toLocaleString();
            if (!arr.find(chatArr => chatArr.sellerId === chat.sellerId && chatArr.productId === chat.productId)) {
                arr.push(chat);
            }
        });

        buyersQuerySnapshot.docs.forEach(s => {
            const chat = s.data();
            chat.id = s.id;
            chat.createdAt = new Date(chat.createdAt.seconds * 1000).toLocaleString();
            if (!arr.find(chatArr => chatArr.buyerId === chat.buyerId && chatArr.productId === chat.productId)) {
                arr.push(chat);
            }
        });

        return arr;
    }
}
