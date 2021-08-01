import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowProductPageRoutingModule } from './show-product-routing.module';

import { ShowProductPage } from './show-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowProductPageRoutingModule
  ],
  declarations: [ShowProductPage]
})
export class ShowProductPageModule {}
