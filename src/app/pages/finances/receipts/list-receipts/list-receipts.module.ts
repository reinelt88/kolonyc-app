import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListReceiptsPageRoutingModule } from './list-receipts-routing.module';

import { ListReceiptsPage } from './list-receipts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListReceiptsPageRoutingModule
  ],
  declarations: [ListReceiptsPage]
})
export class ListReceiptsPageModule {}
