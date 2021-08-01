import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListMarketplaceCategoriesPageRoutingModule } from './list-marketplace-categories-routing.module';

import { ListMarketplaceCategoriesPage } from './list-marketplace-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListMarketplaceCategoriesPageRoutingModule
  ],
  declarations: [ListMarketplaceCategoriesPage]
})
export class ListMarketplaceCategoriesPageModule {}
