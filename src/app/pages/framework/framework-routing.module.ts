import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceIndexComponent } from './finance/finance-index/finance-index.component';

// Component
import { CommunityComponent } from './community/community.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UploadIdcComponent } from './finance/upload-idc/upload-idc.component';
import { ClientContractComponent } from './finance/client-contract/client-contract.component';
import { InvoicesComponent } from './finance/invoices/invoices.component';
import { SuccessInvoicesComponent } from './finance/success-invoices/success-invoices.component';
import { MemberPayoutsComponent } from './finance/member-payouts/member-payouts.component';
import { RetainerInvoicesComponent } from './finance/retainer-invoices/retainer-invoices.component';
import { PieBankComponent } from './finance/pie-bank/pie-bank.component';
import { PiecosStatementComponent } from './finance/piecos-statement/piecos-statement.component';
import { FinanceReportsComponent } from './finance/finance-reports/finance-reports.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { TalentAccountComponent } from './talent-account/talent-account.component';
import { TalentConnectsComponent } from './talent-connects/talent-connects.component';
import { CandidateDipstickComponent } from './candidate-dipstick/candidate-dipstick.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { CandidatesTrackerComponent } from './candidates-tracker/candidates-tracker.component';
import { FaqComponent } from './faq/faq.component';
import { CommunityPiebankComponent } from './finance/community-piebank/community-piebank.component';

const routes: Routes = [
  {
    path: 'community',
    component: CommunityComponent,
  },
  {
    path: 'user/:id',
    component: UserProfileComponent,
  },
  {
    path: 'talent/user/:id',
    component: TalentProfileComponent,
  },
  {
    path: 'client/user/:id',
    component: ClientProfileComponent,
  },
  {
    path: 'finance',
    component: FinanceIndexComponent,
  },
  {
    path: 'idc',
    component: UploadIdcComponent,
  },
  {
    path: 'client-contracts',
    component: ClientContractComponent,
  },
  {
    path: 'invoices',
    component: InvoicesComponent,
  },
  {
    path: 'success-invoices',
    component: SuccessInvoicesComponent,
  },
  {
    path: 'member-payouts',
    component: MemberPayoutsComponent,
  },
  {
    path: 'retainer-invoices',
    component: RetainerInvoicesComponent,
  },
  {
    path: 'pieBank',
    component: PieBankComponent,
  },
  {
    path: 'piecos-statement',
    component: PiecosStatementComponent,
  },
  {
    path: 'finance-reports',
    component: FinanceReportsComponent,
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
  },
  {
    path: 'open/unsubscribe',
    component: UnsubscribeComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path: 'ta/account',
    component: TalentAccountComponent,
  },
  {
    path: 'talent/connects',
    component: TalentConnectsComponent,
  },
  {
    path: 'open/candidate-survey/:discId',
    component: CandidateDipstickComponent,
  },
  {
    path: 'client/tracker',
    component: CandidatesTrackerComponent,
  },
  {
    path: 'client/tracker/:reqIds/:statusIds',
    component: CandidatesTrackerComponent,
  },
  {
    path: 'faq/:categoryIndex/:questionIndex',
    component: FaqComponent,
  },
  {
    path: 'community-piebank',
    component: CommunityPiebankComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrameworkRoutingModule {}
