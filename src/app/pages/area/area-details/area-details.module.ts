import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreaDetailsPageRoutingModule } from './area-details-routing.module';

import { AreaDetailsPage } from './area-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreaDetailsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AreaDetailsPage]
})
export class AreaDetailsPageModule {}
