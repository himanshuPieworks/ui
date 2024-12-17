import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecruitmentModule } from '../pages/recruitment/recruitment.module';

// Language
import { LanguageService } from '../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// Offcanvas
// import { NgxAsideModule } from 'ngx-aside';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

// Spinner
import { NgxSpinnerModule } from 'ngx-spinner';

// component
import { LayoutComponent } from './layout.component';
import { VerticalComponent } from './vertical/vertical.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { RightsidebarComponent } from './rightsidebar/rightsidebar.component';
import { MainComponent } from './main/main.component';
import { TwoColumnComponent } from './two-column/two-column.component';
import { TwoColumnSidebarComponent } from './two-column-sidebar/two-column-sidebar.component';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { HorizontalTopbarComponent } from './horizontal-topbar/horizontal-topbar.component';
import { AddFloatButtonComponent } from './add-float-button/add-float-button.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';

@NgModule({
  declarations: [
    LayoutComponent,
    VerticalComponent,
    TopbarComponent,
    SidebarComponent,
    FooterComponent,
    RightsidebarComponent,
    MainComponent,
    TwoColumnComponent,
    TwoColumnSidebarComponent,
    HorizontalComponent,
    HorizontalTopbarComponent,
    AddFloatButtonComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    SimplebarAngularModule,
    BsDropdownModule.forRoot(),
    TranslateModule,
    NgSelectModule,
    // NgxAsideModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    RecruitmentModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    AccordionModule,
  ],
  exports: [HorizontalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [LanguageService],
})
export class LayoutsModule {}
