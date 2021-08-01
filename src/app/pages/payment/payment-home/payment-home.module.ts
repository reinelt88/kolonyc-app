import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentHomePageRoutingModule } from './payment-home-routing.module';

import { PaymentHomePage } from './payment-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentHomePageRoutingModule
  ],
  declarations: [PaymentHomePage]
})
export class PaymentHomePageModule {}
