import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessDetailsPageRoutingModule } from './access-details-routing.module';

import { AccessDetailsPage } from './access-details.page';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import {IonicSelectableModule} from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessDetailsPageRoutingModule,
    NgxQRCodeModule,
    ReactiveFormsModule,
    IonicSelectableModule
  ],
  declarations: [AccessDetailsPage]
})
export class AccessDetailsPageModule {}
