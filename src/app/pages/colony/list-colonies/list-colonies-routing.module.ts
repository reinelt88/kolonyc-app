import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ListColoniesPage} from './list-colonies.page';

const routes: Routes = [
  {
    path: '',
    component: ListColoniesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListColoniesPageRoutingModule {
}
