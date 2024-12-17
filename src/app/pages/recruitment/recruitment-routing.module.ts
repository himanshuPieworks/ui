import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { WorkspaceComponent } from './workspace/workspace.component';
import { LearnComponent } from './learn/learn.component';
import { ManageComponent } from './manage/manage.component';
import { MandateDetailComponent } from './mandate-detail/mandate-detail.component';
import { ReqTimelineComponent } from './req-timeline/req-timeline.component';
import { ProspectsComponent } from './prospects/prospects.component';
import { RsppComponent } from './rspp/rspp.component';
import { RsppViewComponent } from './rspp-view/rspp-view.component';
import { UserRolesComponent } from '../rbac/user-roles/user-roles.component';
import { UserRoleMappingComponent } from '../rbac/user-role-mapping/user-role-mapping.component';
import { UserRoleRightsComponent } from '../rbac/user-role-rights/user-role-rights.component';
import { ProspectFormComponent } from './prospect-form/prospect-form.component';
import { ProspectDetailComponent } from './prospect-detail/prospect-detail.component';
import { ClubComponent } from './club/club.component';
import { DiscoveriesComponent } from './discoveries/discoveries.component';
import { DiscoveriesDetailComponent } from './discoveries-detail/discoveries-detail.component';
import { CourseComponent } from './course/course.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { MyCourseComponent } from './my-course/my-course.component';
import { AnalyticsReportComponent } from './analytics-report/analytics-report.component';
import { AnalyticsIndexComponent } from './analytics-index/analytics-index.component';
import { CommunityAnalyticsComponent } from './community-analytics/community-analytics.component';
//import {AnalyticsReportComponent} from './analytics-report/analytics-report.component';
import { TalentFeedbackComponent } from './talent-feedback/talent-feedback.component';
import { ClientFeedbackComponent } from './client-feedback/client-feedback.component';
import { RoleComponent } from './role/role.component';
import { BuddyViewComponent } from './buddy-view/buddy-view.component';
import { BulletinComponent } from './bulletin/bulletin.component';
import { ReportsComponent } from './reports/reports.component';
import { TalentReviewComponent } from './talent-review/talent-review.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { FutureDetailComponent } from './future-detail/future-detail.component';
import { FutureEditComponent } from './future-edit/future-edit.component';
import { FutureFormComponent } from './future-form/future-form.component';
import { BuddyPerformanceReportComponent } from './buddy-performance-report/buddy-performance-report.component';
import { GrowthAnalyticsComponent } from './growth-analytics/growth-analytics.component';
import { PostOfferActionComponent } from './post-offer-action/post-offer-action.component';
import { CandidateAnalyticsComponent } from './candidate-analytics/candidate-analytics.component';
import { ClientVerificationComponent } from './client-verification/client-verification.component';
import { EarnComponent } from './earn/earn.component';
import { MembersUploadsComponent } from './members-uploads/members-uploads.component';
import { CommunityOpenJDComponent } from './community-open-jd/community-open-jd.component';
import { RedeemRewardsComponent } from './redeem-rewards/redeem-rewards.component';

const routes: Routes = [
  {
    path: 'wp',
    component: WorkspaceComponent,
  },
  {
    path: 'wp/:reqId',
    component: MandateDetailComponent,
  },
  {
    path: 'wp/:id/timeline',
    component: ReqTimelineComponent,
  },
  {
    path: 'rspp',
    component: WorkspaceComponent,
  },
  {
    path: 'open/rspp',
    component: RsppComponent,
  },
  {
    path: 'open/rspp/:referralId',
    component: RsppComponent,
  },
  {
    path: 'open/rspp/:id',
    component: RsppComponent,
  },
  {
    path: 'open/rspp-view/:id',
    component: RsppViewComponent,
  },
  {
    path: 'rspp-view/:id',
    component: RsppViewComponent,
  },
  {
    path: 'rspp/:reqId',
    component: MandateDetailComponent,
  },
  {
    path: 'prospect/:id',
    component: ProspectDetailComponent,
  },
  {
    path: 'client/:id',
    component: ProspectDetailComponent,
  },
  {
    path: 'open/rspp/:reqId',
    component: MandateDetailComponent,
  },
  {
    path: 'learn',
    component: LearnComponent,
  },
  {
    path: 'earn',
    component: EarnComponent,
  },
  {
    path: 'manage',
    component: ManageComponent,
  },
  {
    path: 'manage/user-roles',
    component: UserRolesComponent,
  },
  {
    path: 'manage/user-role-mapping',
    component: UserRoleMappingComponent,
  },
  {
    path: 'manage/user-role-rights',
    component: UserRoleRightsComponent,
  },
  {
    path: 'prospects',
    component: ProspectsComponent,
  },
  {
    path: 'client',
    component: ProspectsComponent,
  },
  {
    path: 'open/prospects',
    component: ProspectFormComponent,
  },
  {
    path: 'clubs',
    component: ClubComponent,
  },
  {
    path: 'discoveries',
    component: DiscoveriesComponent,
  },
  {
    path: 'discoveries/:reqId',
    component: DiscoveriesComponent,
  },
  {
    path: 'discoveryDetails/:reqId/:discId',
    component: DiscoveriesDetailComponent,
  },
  {
    path: 'course',
    component: CourseComponent,
  },
  {
    path: 'course-details/:courseId',
    component: CourseDetailsComponent,
  },
  {
    path: 'my-course/:courseId',
    component: MyCourseComponent,
  },
  {
    path: 'analytics',
    component: AnalyticsIndexComponent,
  },
  {
    path: 'delivery-analytics',
    component: AnalyticsReportComponent,
  },
  {
    path: 'community-analytics',
    component: CommunityAnalyticsComponent,
  },
  {
    path: 'candidate-analytics',
    component: CandidateAnalyticsComponent,
  },
  {
    path: 'growth-analytics',
    component: GrowthAnalyticsComponent,
  },
  { path: 'open/client-feedback/:id', component: ClientFeedbackComponent },
  { path: 'open/feedback/:id', component: TalentFeedbackComponent },
  { path: 'open/review/:id', component: TalentReviewComponent },
  {
    path: 'roles',
    component: RoleComponent,
  },
  {
    path: 'buddies',
    component: BuddyViewComponent,
  },
  {
    path: 'bulletin',
    component: BulletinComponent,
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'candidates',
    component: CandidatesComponent,
  },
  {
    path: 'future-detail/:id',
    component: FutureDetailComponent,
  },
  {
    path: 'future-edit/:id',
    component: FutureEditComponent,
  },
  {
    path: 'future-form',
    component: FutureFormComponent,
  },
  {
    path: 'open/future/:id',
    component: FutureFormComponent,
  },
  {
    path: 'buddy-performance',
    component: BuddyPerformanceReportComponent,
  },

  { path: 'open/post-offer', component: PostOfferActionComponent },
  { path: 'clientVerification', component: ClientVerificationComponent },
  { path: 'members-uploads', component: MembersUploadsComponent },
  { path: 'open/jd/:reqId/:referralId', component: CommunityOpenJDComponent },
  { path: 'rewards', component: RedeemRewardsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecruitmentRoutingModule {}
