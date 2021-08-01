import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListMarketplaceCategoriesPage } from './list-marketplace-categories.page';

const routes: Routes = [
  {
    path: '',
    component: ListMarketplaceCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListMarketplaceCategoriesPageRoutingModule {}
