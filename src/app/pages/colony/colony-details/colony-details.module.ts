import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColonyDetailsPageRoutingModule } from './colony-details-routing.module';

import { ColonyDetailsPage } from './colony-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColonyDetailsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ColonyDetailsPage]
})
export class ColonyDetailsPageModule {}
