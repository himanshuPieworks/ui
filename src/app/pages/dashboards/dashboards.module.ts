import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Pieworkscommon} from '../../common/pieworkscommon.module';
// Page route
import { DashboardsRoutingModule } from './dashboards-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// Count To
import { CountUpModule } from 'ngx-countup';

import { NgSelectModule } from '@ng-select/ng-select';
// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgxDropzoneModule } from 'ngx-dropzone';

// Leaflet map
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// component
import { NgbdIndexsSortableHeader } from './index/index-sortable.directive';
import { IndexComponent } from './index/index.component';
import { LeftSideDashComponent } from './left-side-dash/left-side-dash.component';
import { MiddleSideDashComponent } from './middle-side-dash/middle-side-dash.component';
import { RightSideDashComponent } from './right-side-dash/right-side-dash.component';
import { OnboardingStepsComponent } from './onboarding-steps/onboarding-steps.component';
import { DiscoveryDashboardReportComponent} from './discovery-dashboard-report/discovery-dashboard-report.component';
//import { SafePipe } from '../../common/safe-pipe/safe-pipe';
import { MyWipComponent } from './my-wip/my-wip.component';
import { FocusMandatesComponent } from './focus-mandates/focus-mandates.component';
import { HiringOverviewComponent } from './hiring-overview/hiring-overview.component';
import { TalentOverviewComponent } from './talent-overview/talent-overview.component';

import {CarouselModule} from 'ngx-bootstrap/carousel';
import { TalentDashboardComponent } from './talent-dashboard/talent-dashboard.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FutureFormComponent } from './future-form/future-form.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { CommunityDashboardComponent } from './community-dashboard/community-dashboard.component';
import { ClientHiringOverviewComponent } from './client-hiring-overview/client-hiring-overview.component';
import { ClientSideBarComponent } from './client-side-bar/client-side-bar.component';
import { EarnComponent } from './earn/earn.component';
import { ClientRsppComponent } from './client-rspp/client-rspp.component';
import { TermAndConditionComponent } from './term-and-condition/term-and-condition.component';


// import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    NgbdIndexsSortableHeader,
    IndexComponent,
    LeftSideDashComponent,
    MiddleSideDashComponent,
    RightSideDashComponent,
    OnboardingStepsComponent,
//    SafePipe,
    DiscoveryDashboardReportComponent,
    MyWipComponent,
    FocusMandatesComponent,
    HiringOverviewComponent,
    TalentOverviewComponent,
    TalentDashboardComponent,
    FutureFormComponent,
    ClientDashboardComponent,
    CommunityDashboardComponent,
    ClientHiringOverviewComponent,
    ClientSideBarComponent,
    EarnComponent,
    ClientRsppComponent,
    TermAndConditionComponent,
   
  ],
  imports: [
    Pieworkscommon,
    CommonModule,
    DashboardsRoutingModule,
    SharedModule,
    BsDropdownModule,
    CountUpModule,
    NgApexchartsModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    ProgressbarModule.forRoot(),
    LeafletModule,
    NgxEchartsModule.forRoot({ echarts }),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CdkStepperModule,
    NgStepperModule,
    NgxDropzoneModule,
    NgSelectModule,
    CarouselModule,
    AccordionModule,
    
  ],
  exports:[
      MyWipComponent,
      DiscoveryDashboardReportComponent,
      OnboardingStepsComponent,
      FutureFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardsModule { }
