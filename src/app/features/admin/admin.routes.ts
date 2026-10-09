import { Routes } from '@angular/router';
import { adminAuthGuard } from '../../core/guards/admin-auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'login',
    title: 'Admin Login | Shubham Prajapati',
    loadComponent: () =>
      import('./admin-login/admin-login.component').then((m) => m.AdminLoginComponent)
  },
  {
    path: 'dashboard',
    title: 'Admin Dashboard | Shubham Prajapati',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent)
  }
];
