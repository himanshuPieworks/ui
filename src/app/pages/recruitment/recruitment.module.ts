import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RecruitmentRoutingModule } from './recruitment-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSliderModule } from 'ngx-slider-v2';
import { UiSwitchModule } from 'ngx-ui-switch';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ManageComponent } from './manage/manage.component';
import { LearnComponent } from './learn/learn.component';
import { MandateDetailComponent } from './mandate-detail/mandate-detail.component';
import { ReqTimelineComponent } from './req-timeline/req-timeline.component';
import { ProspectsComponent } from './prospects/prospects.component';
import { RsppComponent } from './rspp/rspp.component';
import { CreateMandateComponent } from './create-mandate/create-mandate.component';
import { RsppViewComponent } from './rspp-view/rspp-view.component';
import { UserRolesComponent } from '../rbac/user-roles/user-roles.component';
import { UserRoleMappingComponent } from '../rbac/user-role-mapping/user-role-mapping.component';
import { UserRoleRightsComponent } from '../rbac/user-role-rights/user-role-rights.component';
import { ProspectFormComponent } from './prospect-form/prospect-form.component';
import { ProspectDetailComponent } from './prospect-detail/prospect-detail.component';
import { ClubComponent } from './club/club.component';
import { DiscoveriesComponent } from './discoveries/discoveries.component';
import { DiscoveriesDetailComponent } from './discoveries-detail/discoveries-detail.component';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';
import { PostOfferFollowupsComponent } from './post-offer-followups/post-offer-followups.component';
import { MailToClientComponent } from './mail-to-client/mail-to-client.component';
import { DiscoverTalentComponent } from './discover-talent/discover-talent.component';
import { CourseComponent } from './course/course.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { Pieworkscommon } from '../../common/pieworkscommon.module';
import { MyCourseComponent } from './my-course/my-course.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AnalyticsReportComponent } from './analytics-report/analytics-report.component';
import { GenericBarchartComponent } from './generic-barchart/generic-barchart.component';
import { GenericStackedBarChartComponent } from './generic-stacked-bar-chart/generic-stacked-bar-chart.component';
import { GenericLineChartComponent } from './generic-line-chart/generic-line-chart.component';
import { ClientFeedbackComponent } from './client-feedback/client-feedback.component';
import { TalentFeedbackComponent } from './talent-feedback/talent-feedback.component';
import { RoleComponent } from './role/role.component';
import { AnalyticsIndexComponent } from './analytics-index/analytics-index.component';
import { CommunityAnalyticsComponent } from './community-analytics/community-analytics.component';
import { BuddyViewComponent } from './buddy-view/buddy-view.component';
import { BulletinComponent } from './bulletin/bulletin.component';
import { ReportsComponent } from './reports/reports.component';
import { DashboardsModule } from '../dashboards/dashboards.module';
import { TalentReviewComponent } from './talent-review/talent-review.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { FutureDetailComponent } from './future-detail/future-detail.component';
import { FutureEditComponent } from './future-edit/future-edit.component';
import { FutureFormComponent } from './future-form/future-form.component';
import { BuddyPerformanceReportComponent } from './buddy-performance-report/buddy-performance-report.component';
import { GrowthAnalyticsComponent } from './growth-analytics/growth-analytics.component';
import { PostOfferActionComponent } from './post-offer-action/post-offer-action.component';
import { CandidateAnalyticsComponent } from './candidate-analytics/candidate-analytics.component';
import { CandidateDipstickReportComponent } from './candidate-dipstick-report/candidate-dipstick-report.component';
import { DipstickClientWiseReportComponent } from './dipstick-client-wise-report/dipstick-client-wise-report.component';
import { ClientVerificationComponent } from './client-verification/client-verification.component';
import { GenericCompareLineChartComponent } from './generic-compare-line-chart/generic-compare-line-chart.component';
import { EarnComponent } from './earn/earn.component';
import { TruncatePipe } from './truncate.pipe';
import { MembersUploadsComponent } from './members-uploads/members-uploads.component';
import { CommunityOpenFormComponent } from './community-open-form/community-open-form.component';
import { CommunityOpenJDComponent } from './community-open-jd/community-open-jd.component';
import { NgxEditorModule } from 'ngx-editor';
import { RedeemRewardsComponent } from './redeem-rewards/redeem-rewards.component';
import { ScratchCardComponent } from './scratch-card/scratch-card.component';
// import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
// import { ShareIconsModule } from 'ngx-sharebuttons/icons';
@NgModule({
  declarations: [
    WorkspaceComponent,
    ManageComponent,
    LearnComponent,
    MandateDetailComponent,
    ReqTimelineComponent,
    ProspectsComponent,
    RsppComponent,
    CreateMandateComponent,
    RsppViewComponent,
    UserRolesComponent,
    UserRoleMappingComponent,
    UserRoleRightsComponent,
    ProspectFormComponent,
    ProspectDetailComponent,
    ClubComponent,
    DiscoveriesComponent,
    DiscoveriesDetailComponent,
    CandidateDetailComponent,
    PostOfferFollowupsComponent,
    PostOfferFollowupsComponent,
    PostOfferActionComponent,
    MailToClientComponent,
    DiscoverTalentComponent,
    CourseComponent,
    CourseDetailsComponent,
    MyCourseComponent,
    AnalyticsReportComponent,
    GenericBarchartComponent,
    GenericStackedBarChartComponent,
    GenericLineChartComponent,
    ClientFeedbackComponent,
    TalentFeedbackComponent,
    RoleComponent,
    AnalyticsIndexComponent,
    CommunityAnalyticsComponent,
    BuddyViewComponent,
    BulletinComponent,
    ReportsComponent,
    TalentReviewComponent,
    CandidatesComponent,
    FutureDetailComponent,
    FutureEditComponent,
    FutureFormComponent,
    BuddyPerformanceReportComponent,
    GrowthAnalyticsComponent,
    CandidateAnalyticsComponent,
    CandidateDipstickReportComponent,
    DipstickClientWiseReportComponent,
    ClientVerificationComponent,
    GenericCompareLineChartComponent,
    EarnComponent,
    TruncatePipe,
    MembersUploadsComponent,
    CommunityOpenFormComponent,
    CommunityOpenJDComponent,
    RedeemRewardsComponent,
    ScratchCardComponent,
  ],
  imports: [
    CommonModule,
    RecruitmentRoutingModule,
    SharedModule,
    NgApexchartsModule,
    SlickCarouselModule,
    TabsModule,
    NgSelectModule,
    NgxSliderModule,
    UiSwitchModule,
    BsDropdownModule,
    ModalModule,
    BsDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TimepickerModule,
    TooltipModule.forRoot(),
    CdkStepperModule,
    NgStepperModule,
    CarouselModule,
    Pieworkscommon,
    AccordionModule,
    CollapseModule,
    DashboardsModule,
    NgxEditorModule
    // ShareButtonsModule,
    // ShareIconsModule,
  ],
  exports: [
    DiscoverTalentComponent,
    FutureFormComponent,
    // DipstickClientWiseReportComponent
  ],
})
export class RecruitmentModule {}
