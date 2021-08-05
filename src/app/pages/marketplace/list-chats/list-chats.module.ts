import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListChatsPageRoutingModule } from './list-chats-routing.module';

import { ListChatsPage } from './list-chats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListChatsPageRoutingModule
  ],
  declarations: [ListChatsPage]
})
export class ListChatsPageModule {}
