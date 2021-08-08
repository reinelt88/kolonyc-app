import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PollDetailsPageRoutingModule} from './poll-details-routing.module';

import {PollDetailsPage} from './poll-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PollDetailsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [PollDetailsPage]
})
export class PollDetailsPageModule {
}
