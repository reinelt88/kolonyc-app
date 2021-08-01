import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessDetailsPage } from './access-details.page';

const routes: Routes = [
  {
    path: '',
    component: AccessDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessDetailsPageRoutingModule {}
