import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoveryPasswordPageRoutingModule } from './recovery-password-routing.module';

import { RecoveryPasswordPage } from './recovery-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecoveryPasswordPageRoutingModule
  ],
  declarations: [RecoveryPasswordPage]
})
export class RecoveryPasswordPageModule {}
