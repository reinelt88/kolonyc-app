import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AreaDetailsPage} from './area-details.page';

const routes: Routes = [
  {
    path: '',
    component: AreaDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaDetailsPageRoutingModule {
}
