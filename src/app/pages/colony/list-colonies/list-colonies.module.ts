import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListColoniesPageRoutingModule } from './list-colonies-routing.module';

import { ListColoniesPage } from './list-colonies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListColoniesPageRoutingModule
  ],
  declarations: [ListColoniesPage]
})
export class ListColoniesPageModule {}
