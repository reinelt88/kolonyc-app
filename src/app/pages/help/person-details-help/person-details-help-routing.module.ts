import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonDetailsHelpPage } from './person-details-help.page';

const routes: Routes = [
  {
    path: '',
    component: PersonDetailsHelpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonDetailsHelpPageRoutingModule {}
