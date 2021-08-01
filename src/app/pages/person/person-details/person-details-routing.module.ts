import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonDetailsPage } from './person-details.page';

const routes: Routes = [
  {
    path: '',
    component: PersonDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonDetailsPageRoutingModule {}
