import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecurityGuardDetailsPage } from './security-guard-details.page';

const routes: Routes = [
  {
    path: '',
    component: SecurityGuardDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityGuardDetailsPageRoutingModule {}
