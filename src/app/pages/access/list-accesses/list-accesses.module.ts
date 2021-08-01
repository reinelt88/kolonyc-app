import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListAccessesPageRoutingModule } from './list-accesses-routing.module';

import { ListAccessesPage } from './list-accesses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListAccessesPageRoutingModule
  ],
  declarations: [ListAccessesPage]
})
export class ListAccessesPageModule {}
