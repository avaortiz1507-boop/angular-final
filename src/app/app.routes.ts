import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home/home';
import { ObjectDetailsPageComponent } from './pages/details/details';
import { ObjectFormPageComponent } from './pages/object-form/object-form';
import { ObjectsListPageComponent } from './pages/list/list';
import { LoginPageComponent } from './pages/login/login';
import { RegisterPageComponent } from './pages/register/register';
import { NotFoundPageComponent } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'objects', component: ObjectsListPageComponent },
  { path: 'objects/new', component: ObjectFormPageComponent },
  { path: 'objects/:id', component: ObjectDetailsPageComponent },
  { path: 'objects/:id/edit', component: ObjectFormPageComponent },
  { path: '**', component: NotFoundPageComponent },
];
