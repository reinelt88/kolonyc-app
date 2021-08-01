import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListProductsPage } from './list-products.page';

const routes: Routes = [
  {
    path: '',
    component: ListProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListProductsPageRoutingModule {}
