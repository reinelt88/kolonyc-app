import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonDetailsHelpPageRoutingModule } from './person-details-help-routing.module';

import { PersonDetailsHelpPage } from './person-details-help.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonDetailsHelpPageRoutingModule
  ],
  declarations: []
})
export class PersonDetailsHelpPageModule {}
