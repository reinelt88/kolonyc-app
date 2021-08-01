import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowProductPage } from './show-product.page';

const routes: Routes = [
  {
    path: '',
    component: ShowProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowProductPageRoutingModule {}
