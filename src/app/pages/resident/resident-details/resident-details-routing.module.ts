import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentDetailsPage } from './resident-details.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentDetailsPageRoutingModule {}
