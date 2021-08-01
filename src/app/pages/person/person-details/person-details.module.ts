import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonDetailsPageRoutingModule } from './person-details-routing.module';

import { PersonDetailsPage } from './person-details.page';
import {PersonDetailsHelpPage} from '../../help/person-details-help/person-details-help.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonDetailsPageRoutingModule,
  ],
  declarations: [PersonDetailsPage, PersonDetailsHelpPage],
  entryComponents: [PersonDetailsHelpPage]
})
export class PersonDetailsPageModule {}
