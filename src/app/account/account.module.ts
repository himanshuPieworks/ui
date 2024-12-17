import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Page Route
import { AccountRoutingModule } from './account-routing.module';
import { AuthModule } from './auth/auth.module';

// Component
import { LoginComponent } from './login/login.component';
import { LoginLeftComponent } from './login-left/login-left.component';
import { PassResetComponent } from './pass-reset/pass-reset.component';
import { RegisterComponent } from './register/register.component';
import { TwostepComponent } from './twostep/twostep.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoginStepperComponent } from './login-stepper/login-stepper.component';


//pieworks common service 
import { Pieworkscommon } from '../common/pieworkscommon.module';
import { FutureFormComponent } from '../pages/recruitment/future-form/future-form.component';

@NgModule({
  declarations: [
    LoginComponent,
    LoginLeftComponent,
    RegisterComponent,
    TwostepComponent,
    PassResetComponent,
    LoginStepperComponent,
    
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    GoogleSigninButtonModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CdkStepperModule,
    NgStepperModule,
    NgxDropzoneModule,
    Pieworkscommon,
    TooltipModule.forRoot(),
    // FutureFormComponent



  ],
})
export class AccountModule {}
