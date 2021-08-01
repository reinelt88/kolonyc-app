import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListBookingsPage } from './list-bookings.page';

const routes: Routes = [
  {
    path: '',
    component: ListBookingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListBookingsPageRoutingModule {}
