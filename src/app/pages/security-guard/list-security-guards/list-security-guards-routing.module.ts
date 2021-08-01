import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListSecurityGuardsPage } from './list-security-guards.page';

const routes: Routes = [
  {
    path: '',
    component: ListSecurityGuardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListSecurityGuardsPageRoutingModule {}
