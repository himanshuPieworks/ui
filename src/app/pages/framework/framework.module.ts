import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommunityComponent} from './community/community.component';
import {FrameworkRoutingModule} from './framework-routing.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import {NgApexchartsModule} from "ng-apexcharts";
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxSliderModule} from 'ngx-slider-v2';
import {UiSwitchModule} from 'ngx-ui-switch';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {NgStepperModule} from 'angular-ng-stepper';
import {Pieworkscommon} from '../../common/pieworkscommon.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FullCalendarModule } from '@fullcalendar/angular';


//import {SafePipe} from '../../common/safe-pipe/safe-pipe';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FinanceIndexComponent } from './finance/finance-index/finance-index.component';
import { UploadIdcComponent } from './finance/upload-idc/upload-idc.component';
import { ClientContractComponent } from './finance/client-contract/client-contract.component';
import { InvoicesComponent } from './finance/invoices/invoices.component';
import { SuccessInvoicesComponent } from './finance/success-invoices/success-invoices.component';
import { MemberPayoutsComponent } from './finance/member-payouts/member-payouts.component';
import { RetainerInvoicesComponent } from './finance/retainer-invoices/retainer-invoices.component';
import { NpsComponent } from './nps/nps.component';
import { JobFamilyComponent } from './job-family/job-family.component';
import { PeerFeedbackResultComponent } from './peer-feedback-result/peer-feedback-result.component';
import { TalentNpsReportComponent } from './talent-nps-report/talent-nps-report.component';
import { ClientFeedbackResultComponent } from './client-feedback-result/client-feedback-result.component';
import { PeerFeedbackFormComponent } from './peer-feedback-form/peer-feedback-form.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { PieBankComponent } from './finance/pie-bank/pie-bank.component';
import { RecrHealthBarComponent } from './finance/recr-health-bar/recr-health-bar.component';
import { PiecosStatementComponent } from './finance/piecos-statement/piecos-statement.component';
import { PiecosPayoutsComponent } from './finance/piecos-payouts/piecos-payouts.component';
import { MyPayoutComponent } from './finance/my-payout/my-payout.component';
import { PayoutItemBreakupComponent } from './finance/payout-item-breakup/payout-item-breakup.component';
import { FinanceReportsComponent } from './finance/finance-reports/finance-reports.component';
import { LiabilityReportComponent } from './finance/liability-report/liability-report.component';
import { PiecosAnalysisComponent } from './finance/piecos-analysis/piecos-analysis.component';
import { SuccessFeeAnalysisComponent } from './finance/success-fee-analysis/success-fee-analysis.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { DashboardsModule } from '../dashboards/dashboards.module';
import { CalendarComponent } from './calendar/calendar.component';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { TalentAccountComponent } from './talent-account/talent-account.component';
import { TalentConnectsComponent } from './talent-connects/talent-connects.component';
import { CandidateDipstickComponent } from './candidate-dipstick/candidate-dipstick.component';
import { MyStepperPropsComponent } from './my-stepper-props/my-stepper-props.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { CandidatesTrackerComponent } from './candidates-tracker/candidates-tracker.component';
import { RecruitmentModule } from '../recruitment/recruitment.module';
import { ClientDipstickComponent } from './client-dipstick/client-dipstick.component';
import { FaqComponent } from './faq/faq.component';
import { CommunityPiebankComponent } from './finance/community-piebank/community-piebank.component';



@NgModule({
    declarations: [
        CommunityComponent,
        UserProfileComponent,
        FinanceIndexComponent,
        UploadIdcComponent,
        ClientContractComponent,
        InvoicesComponent,
        SuccessInvoicesComponent,
        MemberPayoutsComponent,
        RetainerInvoicesComponent,
        NpsComponent,
        JobFamilyComponent,
        PeerFeedbackResultComponent,
        TalentNpsReportComponent,
        ClientFeedbackResultComponent,
        PeerFeedbackFormComponent,
        PieBankComponent,
        RecrHealthBarComponent,
        PiecosStatementComponent,
        PiecosPayoutsComponent,
        MyPayoutComponent,
        PayoutItemBreakupComponent,
        FinanceReportsComponent,
        LiabilityReportComponent,
        PiecosAnalysisComponent,
        SuccessFeeAnalysisComponent,
        NotificationsComponent,
        UnsubscribeComponent,
        CalendarComponent,
        TalentProfileComponent,
        TalentAccountComponent,
        TalentConnectsComponent,
        CandidateDipstickComponent,
        MyStepperPropsComponent,
        ClientProfileComponent,
        CandidatesTrackerComponent,
        ClientDipstickComponent,
        FaqComponent,
        CommunityPiebankComponent

        //        SafePipe
    ],
    imports: [
        Pieworkscommon,
        CommonModule,
        FrameworkRoutingModule,
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
        CarouselModule.forRoot(),
        ProgressbarModule.forRoot(),
        AccordionModule,
        CollapseModule,
        DashboardsModule,
        FullCalendarModule,
        // RecruitmentModule
    ]
})
export class FrameworkModule {}
