import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListReceiptsPage } from './list-receipts.page';

const routes: Routes = [
  {
    path: '',
    component: ListReceiptsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListReceiptsPageRoutingModule {}
