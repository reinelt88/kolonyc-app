import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListChatsPage } from './list-chats.page';

const routes: Routes = [
  {
    path: '',
    component: ListChatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListChatsPageRoutingModule {}
