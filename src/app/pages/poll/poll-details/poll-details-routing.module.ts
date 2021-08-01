import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PollDetailsPage } from './poll-details.page';

const routes: Routes = [
  {
    path: '',
    component: PollDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollDetailsPageRoutingModule {}
