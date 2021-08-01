import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingPaymentsPageRoutingModule } from './pending-payments-routing.module';

import { PendingPaymentsPage } from './pending-payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingPaymentsPageRoutingModule
  ],
  declarations: [PendingPaymentsPage]
})
export class PendingPaymentsPageModule {}
