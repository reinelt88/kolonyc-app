import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserSwitchPage } from './user-switch.page';

const routes: Routes = [
  {
    path: '',
    component: UserSwitchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSwitchPageRoutingModule {}
