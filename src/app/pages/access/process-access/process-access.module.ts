import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProcessAccessPageRoutingModule } from './process-access-routing.module';

import { ProcessAccessPage } from './process-access.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProcessAccessPageRoutingModule
  ],
  declarations: [ProcessAccessPage]
})
export class ProcessAccessPageModule {}
