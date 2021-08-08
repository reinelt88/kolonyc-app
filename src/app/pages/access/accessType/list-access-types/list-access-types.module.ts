import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ListAccessTypesPageRoutingModule} from './list-access-types-routing.module';

import {ListAccessTypesPage} from './list-access-types.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListAccessTypesPageRoutingModule
  ],
  declarations: [ListAccessTypesPage]
})
export class ListAccessTypesPageModule {
}
