import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListAccessesPage } from './list-accesses.page';

const routes: Routes = [
  {
    path: '',
    component: ListAccessesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListAccessesPageRoutingModule {}
