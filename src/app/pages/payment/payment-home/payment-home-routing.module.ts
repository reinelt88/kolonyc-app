import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentHomePage } from './payment-home.page';
import {AuthGuard} from '../../../security/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: PaymentHomePage,
        children:
            [
                {
                    path: 'list',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: () => import('../list-payments/list-payments.module').then(m => m.ListPaymentsPageModule),
                                canActivate: [AuthGuard]
                            }
                        ]
                },
                {
                    path: 'pendings',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: () => import('../pending-payments/pending-payments.module').then(m => m.PendingPaymentsPageModule),
                                canActivate: [AuthGuard]
                            }
                        ]
                }
            ]
    },
    {
        path: '',
        redirectTo: '/payment-home/list',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentHomePageRoutingModule {}
