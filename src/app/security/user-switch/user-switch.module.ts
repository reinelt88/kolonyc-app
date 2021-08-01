import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserSwitchPageRoutingModule } from './user-switch-routing.module';

import { UserSwitchPage } from './user-switch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserSwitchPageRoutingModule
  ],
  declarations: [UserSwitchPage]
})
export class UserSwitchPageModule {}
