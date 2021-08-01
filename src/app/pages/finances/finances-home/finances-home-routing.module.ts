import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancesHomePage } from './finances-home.page';
import {AuthGuard} from '../../../security/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FinancesHomePage,
    children:
        [
          {
            path: 'receipts',
            children:
                [
                  {
                    path: '',
                      loadChildren: () => import('../receipts/list-receipts/list-receipts.module').then( m => m.ListReceiptsPageModule),
                      canActivate: [AuthGuard]
                  }
                ]
          },
          {
            path: 'expenses',
            children:
                [
                  {
                    path: '',
                      loadChildren: () => import('../expenses/list-expenses/list-expenses.module').then( m => m.ListExpensesPageModule),
                      canActivate: [AuthGuard]
                  }
                ]
          }
        ]
  },
  {
    path: '',
    redirectTo: '/finances-home/receipts',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancesHomePageRoutingModule {}
