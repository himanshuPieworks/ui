import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { IndexComponent } from './index/index.component';
import { TalentDashboardComponent } from './talent-dashboard/talent-dashboard.component';
import { EarnComponent } from './earn/earn.component';
import { TermAndConditionComponent } from './term-and-condition/term-and-condition.component';


const routes: Routes = [
  {
    path: "",
    redirectTo:"home",
    pathMatch:'full'
  },
  {
    path: "home",
    component: IndexComponent
  },
  {
    path: "talent",
    component: TalentDashboardComponent
  },
  {
    path: "open/earn",
    component: EarnComponent
  },
  {
    path: "open/tc",
    component: TermAndConditionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { 

  
}
