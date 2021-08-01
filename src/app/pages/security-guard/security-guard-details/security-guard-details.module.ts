import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecurityGuardDetailsPageRoutingModule } from './security-guard-details-routing.module';

import { SecurityGuardDetailsPage } from './security-guard-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecurityGuardDetailsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [SecurityGuardDetailsPage]
})
export class SecurityGuardDetailsPageModule {}
