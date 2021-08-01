import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessTypeDetailsPage } from './access-type-details.page';

const routes: Routes = [
  {
    path: '',
    component: AccessTypeDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessTypeDetailsPageRoutingModule {}
