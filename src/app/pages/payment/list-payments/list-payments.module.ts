import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPaymentsPageRoutingModule } from './list-payments-routing.module';

import { ListPaymentsPage } from './list-payments.page';
import {IonicSelectableModule} from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPaymentsPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [ListPaymentsPage]
})
export class ListPaymentsPageModule {}
