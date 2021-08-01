import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentDetailsPageRoutingModule } from './resident-details-routing.module';

import { ResidentDetailsPage } from './resident-details.page';
import {IonicSelectableModule} from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentDetailsPageRoutingModule,
    ReactiveFormsModule,
    IonicSelectableModule
  ],
  declarations: [ResidentDetailsPage]
})
export class ResidentDetailsPageModule {}
