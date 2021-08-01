import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinancesHomePageRoutingModule } from './finances-home-routing.module';

import { FinancesHomePage } from './finances-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancesHomePageRoutingModule
  ],
  declarations: [FinancesHomePage]
})
export class FinancesHomePageModule {}
