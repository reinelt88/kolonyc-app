import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListSecurityGuardsPageRoutingModule } from './list-security-guards-routing.module';

import { ListSecurityGuardsPage } from './list-security-guards.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListSecurityGuardsPageRoutingModule
  ],
  declarations: [ListSecurityGuardsPage]
})
export class ListSecurityGuardsPageModule {}
