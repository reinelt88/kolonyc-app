import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseDetailsPage } from './expense-details.page';

const routes: Routes = [
  {
    path: '',
    component: ExpenseDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseDetailsPageRoutingModule {}
