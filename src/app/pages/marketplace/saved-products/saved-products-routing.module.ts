import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavedProductsPage } from './saved-products.page';

const routes: Routes = [
  {
    path: '',
    component: SavedProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavedProductsPageRoutingModule {}
