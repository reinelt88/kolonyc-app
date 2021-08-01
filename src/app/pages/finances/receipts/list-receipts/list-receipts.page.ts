import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../../../sharedServices/storage.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {BasePage} from '../../../base/base.page';
import {timer} from 'rxjs';
import {ReceiptService} from '../receipt.service';
import {ReceiptTypeService} from '../../receiptType.service';
import {now} from 'moment';
import {Colony} from '../../../../models/colony';
import {ColonyService} from '../../../colony/colony.service';

@Component({
    selector: 'app-list-receipts',
    templateUrl: './list-receipts.page.html',
    styleUrls: ['./list-receipts.page.scss'],
})
export class ListReceiptsPage extends BasePage implements OnInit {

    public receipts = [];
    public colonyId = null;
    colonies: Colony[];

    constructor(
        protected storageService: StorageService,
        protected toastController: ToastController,
        private loadingController: LoadingController,
        private receiptService: ReceiptService,
        private receiptTypeService: ReceiptTypeService,
        private colonyServices: ColonyService,
    ) {
        super(storageService, toastController);
    }

    ngOnInit() {
        timer(1000).subscribe(() => {

            if (this.savedUser.role === 'SUPERADMIN') {
                this.loadColonies();
            } else {
                // this.colonyId = this.savedUser.colonyId;
                this.loadReceipts(this.savedUser.colonyId);
            }

        });
    }

    loadColonies() {
        this.colonyServices.getAll().subscribe(res => {
            this.colonyId = res[0].id;
            this.colonies = res;
        });
    }

    listChange($event) {
        this.loadReceipts($event.detail.value);
    }


    async loadReceipts(colonyId: string) {
        const loading = await this.loadingController.create({
            spinner: null,
            cssClass: 'custom-loading',
            showBackdrop: false,
            translucent: true,
        });

        await loading.present();

        this.receiptService.getAll(colonyId).subscribe(res => {

            this.receipts = [];

            if (res.length > 0) {
                res.forEach(receipt => {

                    const receiptMod: any = {
                        id: receipt.id,
                        description: receipt.description,
                        type: '',
                        amount: receipt.amount,
                        createdAt: (receipt.createdAt === null) ? new Date(now()).toISOString() : new Date(receipt.createdAt.seconds * 1000).toISOString(),
                    };

                    this.receiptTypeService.get(receipt.type, colonyId).subscribe(data => {
                        if (data) {
                            receiptMod.type = data.name;
                            this.receipts.push(receiptMod);
                        }
                    });

                });
            }

            loading.dismiss();
        });
    }

}
