import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListExpensesPage } from './list-expenses.page';

const routes: Routes = [
  {
    path: '',
    component: ListExpensesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListExpensesPageRoutingModule {}
