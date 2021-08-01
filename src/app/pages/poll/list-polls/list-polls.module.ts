import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPollsPageRoutingModule } from './list-polls-routing.module';

import { ListPollsPage } from './list-polls.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPollsPageRoutingModule
  ],
  declarations: [ListPollsPage]
})
export class ListPollsPageModule {}
