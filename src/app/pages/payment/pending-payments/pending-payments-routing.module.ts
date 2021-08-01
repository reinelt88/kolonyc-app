import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendingPaymentsPage } from './pending-payments.page';

const routes: Routes = [
  {
    path: '',
    component: PendingPaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingPaymentsPageRoutingModule {}
