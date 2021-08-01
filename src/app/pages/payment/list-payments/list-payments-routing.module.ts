import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPaymentsPage } from './list-payments.page';

const routes: Routes = [
  {
    path: '',
    component: ListPaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPaymentsPageRoutingModule {}
