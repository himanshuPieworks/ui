import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { LayoutComponent } from './layouts/layout.component';
import { AuthlayoutComponent } from './authlayout/authlayout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { TalentFeedbackComponent} from './pages/recruitment/talent-feedback/talent-feedback.component'
import {ClientFeedbackComponent} from './pages/recruitment/client-feedback/client-feedback.component';

const routes: Routes = [
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard]  },
  { path: 'auth', component: AuthlayoutComponent, loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  {path: 'recruitment/open/feedback/:id', redirectTo: '/recr/open/feedback/:id'},
  {path: 'framework/open/client-feedback/:id', redirectTo: 'recr/open/client-feedback/:id'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top',  useHash: false   })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
