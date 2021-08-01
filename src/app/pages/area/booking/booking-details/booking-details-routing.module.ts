import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingDetailsPage } from './booking-details.page';

const routes: Routes = [
  {
    path: '',
    component: BookingDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingDetailsPageRoutingModule {}
