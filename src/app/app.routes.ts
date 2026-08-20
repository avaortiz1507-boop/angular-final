import { Routes } from '@angular/router';

import { GeneralGuard } from './guards/general.guard';
import { AdminGuard } from './guards/admin.guard';
import { HomePageComponent } from './pages/home/home';
import { ObjectDetailsPageComponent } from './pages/details/details';
import { ObjectFormPageComponent } from './pages/object-form/object-form';
import { ObjectsListPageComponent } from './pages/list/list';
import { RegisterPageComponent } from './pages/register/register';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    canActivate: [GeneralGuard],
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePageComponent),
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () => import('./pages/admin/admin').then((m) => m.AdminPageComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPageComponent),
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./pages/forbidden/forbidden').then((m) => m.ForbiddenPageComponent),
  },
  { path: 'register', component: RegisterPageComponent },
  { path: 'objects', canActivate: [GeneralGuard], component: ObjectsListPageComponent },
  { path: 'objects/new', canActivate: [AdminGuard], component: ObjectFormPageComponent },
  { path: 'objects/:id', canActivate: [GeneralGuard], component: ObjectDetailsPageComponent },
  { path: 'objects/:id/edit', canActivate: [AdminGuard], component: ObjectFormPageComponent },
  { path: '**', redirectTo: 'dashboard' },
];
