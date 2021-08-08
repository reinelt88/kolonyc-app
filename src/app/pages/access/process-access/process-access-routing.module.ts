import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ProcessAccessPage} from './process-access.page';

const routes: Routes = [
  {
    path: '',
    component: ProcessAccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessAccessPageRoutingModule {
}
