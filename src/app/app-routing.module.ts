import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './security/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-account',
    loadChildren: () => import('./pages/my-account/my-account.module').then( m => m.MyAccountPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./security/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./security/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'list-users',
    loadChildren: () => import('./pages/users/list-users/list-users.module').then( m => m.ListUsersPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-details',
    loadChildren: () => import('./pages/users/user-details/user-details.module').then( m => m.UserDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-details/:id',
    loadChildren: () => import('./pages/users/user-details/user-details.module').then( m => m.UserDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-colonies',
    loadChildren: () => import('./pages/colony/list-colonies/list-colonies.module').then( m => m.ListColoniesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'colony-details',
    loadChildren: () => import('./pages/colony/colony-details/colony-details.module').then( m => m.ColonyDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'colony-details/:id',
    loadChildren: () => import('./pages/colony/colony-details/colony-details.module').then( m => m.ColonyDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-residents',
    loadChildren: () => import('./pages/resident/list-residents/list-residents.module').then( m => m.ListResidentsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'resident-details',
    loadChildren: () => import('./pages/resident/resident-details/resident-details.module').then( m => m.ResidentDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'resident-details/:id',
    loadChildren: () => import('./pages/resident/resident-details/resident-details.module').then( m => m.ResidentDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-accesses',
    loadChildren: () => import('./pages/access/list-accesses/list-accesses.module').then( m => m.ListAccessesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'access-details',
    loadChildren: () => import('./pages/access/access-details/access-details.module').then( m => m.AccessDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'access-details/:colony/:id',
    loadChildren: () => import('./pages/access/access-details/access-details.module').then( m => m.AccessDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'base',
    loadChildren: () => import('./pages/base/base.module').then( m => m.BasePageModule)
  },
  {
    path: 'process-access',
    loadChildren: () => import('./pages/access/process-access/process-access.module').then( m => m.ProcessAccessPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'person-details/:colony/:access/:id',
    loadChildren: () => import('./pages/person/person-details/person-details.module').then( m => m.PersonDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'finances-home',
    loadChildren: () => import('./pages/finances/finances-home/finances-home.module').then( m => m.FinancesHomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-receipts',
    loadChildren: () => import('./pages/finances/receipts/list-receipts/list-receipts.module').then( m => m.ListReceiptsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-expenses',
    loadChildren: () => import('./pages/finances/expenses/list-expenses/list-expenses.module').then( m => m.ListExpensesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'expense-details',
    loadChildren: () => import('./pages/finances/expenses/expense-details/expense-details.module').then( m => m.ExpenseDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'expense-details/:id',
    loadChildren: () => import('./pages/finances/expenses/expense-details/expense-details.module').then( m => m.ExpenseDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'receipt-details',
    loadChildren: () => import('./pages/finances/receipts/receipt-details/receipt-details.module').then( m => m.ReceiptDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'receipt-details/:id',
    loadChildren: () => import('./pages/finances/receipts/receipt-details/receipt-details.module').then( m => m.ReceiptDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'person-details-help',
    loadChildren: () => import('./pages/help/person-details-help/person-details-help.module').then( m => m.PersonDetailsHelpPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'recovery-password',
    loadChildren: () => import('./security/recovery-password/recovery-password.module').then( m => m.RecoveryPasswordPageModule)
  },
  {
    path: 'list-security-guards',
    loadChildren: () => import('./pages/security-guard/list-security-guards/list-security-guards.module').then( m => m.ListSecurityGuardsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'security-guard-details',
    loadChildren: () => import('./pages/security-guard/security-guard-details/security-guard-details.module').then( m => m.SecurityGuardDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'security-guard-details/:id',
    loadChildren: () => import('./pages/security-guard/security-guard-details/security-guard-details.module').then( m => m.SecurityGuardDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'logout',
    loadChildren: () => import('./security/logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'user-switch',
    loadChildren: () => import('./security/user-switch/user-switch.module').then( m => m.UserSwitchPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-payments',
    loadChildren: () => import('./pages/payment/list-payments/list-payments.module').then( m => m.ListPaymentsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-details',
    loadChildren: () => import('./pages/payment/payment-details/payment-details.module').then( m => m.PaymentDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-details/:id',
    loadChildren: () => import('./pages/payment/payment-details/payment-details.module').then( m => m.PaymentDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-areas',
    loadChildren: () => import('./pages/area/list-areas/list-areas.module').then( m => m.ListAreasPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'area-details',
    loadChildren: () => import('./pages/area/area-details/area-details.module').then( m => m.AreaDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'area-details/:id',
    loadChildren: () => import('./pages/area/area-details/area-details.module').then( m => m.AreaDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'booking-details',
    loadChildren: () => import('./pages/area/booking/booking-details/booking-details.module').then( m => m.BookingDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'booking-details/:id',
    loadChildren: () => import('./pages/area/booking/booking-details/booking-details.module').then( m => m.BookingDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-bookings',
    loadChildren: () => import('./pages/area/booking/list-bookings/list-bookings.module').then( m => m.ListBookingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'poll-details',
    loadChildren: () => import('./pages/poll/poll-details/poll-details.module').then( m => m.PollDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'poll-details/:id',
    loadChildren: () => import('./pages/poll/poll-details/poll-details.module').then( m => m.PollDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-polls',
    loadChildren: () => import('./pages/poll/list-polls/list-polls.module').then( m => m.ListPollsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'marketplace-category-details',
    loadChildren: () => import('./pages/marketplace/marketplace-category-details/marketplace-category-details.module').then( m => m.MarketplaceCategoryDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'marketplace-category-details/:id',
    loadChildren: () => import('./pages/marketplace/marketplace-category-details/marketplace-category-details.module').then( m => m.MarketplaceCategoryDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-marketplace-categories',
    loadChildren: () => import('./pages/marketplace/list-marketplace-categories/list-marketplace-categories.module').then( m => m.ListMarketplaceCategoriesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-products',
    loadChildren: () => import('./pages/marketplace/list-products/list-products.module').then( m => m.ListProductsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'product-details',
    loadChildren: () => import('./pages/marketplace/product-details/product-details.module').then( m => m.ProductDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'product-details/:id',
    loadChildren: () => import('./pages/marketplace/product-details/product-details.module').then( m => m.ProductDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'show-product',
    loadChildren: () => import('./pages/marketplace/show-product/show-product.module').then( m => m.ShowProductPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'show-product/:id',
    loadChildren: () => import('./pages/marketplace/show-product/show-product.module').then( m => m.ShowProductPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-access-types',
    loadChildren: () => import('./pages/access/accessType/list-access-types/list-access-types.module').then(m => m.ListAccessTypesPageModule)
  },
  {
    path: 'access-type-details',
    loadChildren: () => import('./pages/access/accessType/access-type-details/access-type-details.module').then(m => m.AccessTypeDetailsPageModule)
  },
  {
    path: 'access-type-details/:id',
    loadChildren: () => import('./pages/access/accessType/access-type-details/access-type-details.module').then(m => m.AccessTypeDetailsPageModule)
  },
  {
    path: 'payment-home',
    loadChildren: () => import('./pages/payment/payment-home/payment-home.module').then( m => m.PaymentHomePageModule)
  },
  {
    path: 'pending-payments',
    loadChildren: () => import('./pages/payment/pending-payments/pending-payments.module').then( m => m.PendingPaymentsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
