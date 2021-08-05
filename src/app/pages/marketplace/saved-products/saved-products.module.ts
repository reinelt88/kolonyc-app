import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavedProductsPageRoutingModule } from './saved-products-routing.module';

import { SavedProductsPage } from './saved-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavedProductsPageRoutingModule
  ],
  declarations: [SavedProductsPage]
})
export class SavedProductsPageModule {}
