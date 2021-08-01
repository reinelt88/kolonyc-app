import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentDetailsPage } from './payment-details.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentDetailsPageRoutingModule {}
