import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ListAccessTypesPage} from './list-access-types.page';

const routes: Routes = [
  {
    path: '',
    component: ListAccessTypesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListAccessTypesPageRoutingModule {
}
