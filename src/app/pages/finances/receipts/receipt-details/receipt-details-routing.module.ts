import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiptDetailsPage } from './receipt-details.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiptDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptDetailsPageRoutingModule {}
