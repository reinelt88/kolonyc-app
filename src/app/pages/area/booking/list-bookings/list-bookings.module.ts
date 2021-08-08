import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ListBookingsPageRoutingModule} from './list-bookings-routing.module';

import {ListBookingsPage} from './list-bookings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListBookingsPageRoutingModule
  ],
  declarations: [ListBookingsPage]
})
export class ListBookingsPageModule {
}
