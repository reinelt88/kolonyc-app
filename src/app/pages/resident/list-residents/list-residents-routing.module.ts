import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListResidentsPage } from './list-residents.page';

const routes: Routes = [
  {
    path: '',
    component: ListResidentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListResidentsPageRoutingModule {}
