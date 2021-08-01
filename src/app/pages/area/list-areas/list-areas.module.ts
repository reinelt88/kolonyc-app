import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListAreasPageRoutingModule } from './list-areas-routing.module';

import { ListAreasPage } from './list-areas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListAreasPageRoutingModule
  ],
  declarations: [ListAreasPage]
})
export class ListAreasPageModule {}
