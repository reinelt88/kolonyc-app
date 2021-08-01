import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseDetailsPageRoutingModule } from './expense-details-routing.module';

import { ExpenseDetailsPage } from './expense-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpenseDetailsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ExpenseDetailsPage]
})
export class ExpenseDetailsPageModule {}
