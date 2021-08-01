import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPollsPage } from './list-polls.page';

const routes: Routes = [
  {
    path: '',
    component: ListPollsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPollsPageRoutingModule {}
