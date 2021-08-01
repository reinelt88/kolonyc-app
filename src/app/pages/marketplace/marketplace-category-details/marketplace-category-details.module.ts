import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketplaceCategoryDetailsPageRoutingModule } from './marketplace-category-details-routing.module';

import { MarketplaceCategoryDetailsPage } from './marketplace-category-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketplaceCategoryDetailsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [MarketplaceCategoryDetailsPage]
})
export class MarketplaceCategoryDetailsPageModule {}
