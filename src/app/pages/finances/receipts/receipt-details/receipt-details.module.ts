import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ReceiptDetailsPageRoutingModule} from './receipt-details-routing.module';
import {ReceiptDetailsPage} from './receipt-details.page';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReceiptDetailsPageRoutingModule,
        ReactiveFormsModule,
    ],
    declarations: [ReceiptDetailsPage]
})
export class ReceiptDetailsPageModule {
}
