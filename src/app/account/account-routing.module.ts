import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PassResetComponent } from './pass-reset/pass-reset.component';

// Component
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginStepperComponent } from './login-stepper/login-stepper.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login/talent',
    component: LoginComponent,
  },
  {
    path: 'login/client',
    component: LoginComponent,
  },
  {
    path: 'login/community',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'register/talent',
    component: RegisterComponent,
  },
  {
    path: 'register/client',
    component: RegisterComponent,
  },
  {
    path: 'register/community',
    component: RegisterComponent,
  },
  {
    path: 'password-reset',
    component: PassResetComponent,
  },
  {
    path: 'stepper',
    component: LoginStepperComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
