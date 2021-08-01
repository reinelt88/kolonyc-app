import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListAreasPage } from './list-areas.page';

const routes: Routes = [
  {
    path: '',
    component: ListAreasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListAreasPageRoutingModule {}
