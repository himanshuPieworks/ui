import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
  },
  {
    path: 'recr', loadChildren: () => import('./recruitment/recruitment.module').then(m => m.RecruitmentModule)
  },
  {
    path: 'fw', loadChildren: () => import('./framework/framework.module').then(m => m.FrameworkModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
