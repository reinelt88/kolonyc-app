import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessTypeDetailsPageRoutingModule } from './access-type-details-routing.module';

import { AccessTypeDetailsPage } from './access-type-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessTypeDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AccessTypeDetailsPage]
})
export class AccessTypeDetailsPageModule {}
