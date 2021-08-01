import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListResidentsPageRoutingModule } from './list-residents-routing.module';

import { ListResidentsPage } from './list-residents.page';
import {IonicSelectableModule} from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListResidentsPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [ListResidentsPage]
})
export class ListResidentsPageModule {}
