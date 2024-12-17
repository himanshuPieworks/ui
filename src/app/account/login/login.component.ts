import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { PieworksCommonService } from '../../common/pieworkscommon.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

// Login Component
export class LoginComponent {
  colorTheme: any = 'theme-blue';
  bsConfig?: Partial<BsDatepickerConfig>;
  name: any;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  @ViewChild('varying') varying: any;
  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;

  toast!: false;
  parentObj = this;
  otpIdentifier: any;
  otpPurpose = 'login using OTP';

  // set the current year
  year: number = new Date().getFullYear();
  paramUrl: boolean = true;
  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private authFackservice: AuthfakeauthenticationService,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    // redirect to home if already logged in
    if (localStorage.getItem('accesstoken')) {
      if (localStorage.getItem('forwardUrl')) {
        this.router.navigate([localStorage.getItem('forwardUrl')]);
        localStorage.removeItem('forwardUrl');
      } else this.router.navigate(['/']);
    }

    // check which link is there
    this.checkIfClientInUrl();

    setTimeout(() => {
      this.displayGoogleIcon = true;
    }, 1000);
  }

  checkIfClientInUrl() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/community')) {
      this.setRole('COMMUNITY MEMBER');
      this.paramUrl = false;
    } else if (currentUrl.includes('/client')) {
      this.setRole('Client');
      this.paramUrl = false;
    } else if (currentUrl.includes('/talent')) {
      this.setRole('Talent');
      this.paramUrl = false;
    } else {
      // console.log("URL does not contain /client");
      this.paramUrl = true;
      if (localStorage.getItem('role'))
        this.setRole(localStorage.getItem('role') + '');
    }
  }
  displayGoogleIcon = false;
  selectedRole: string = '';
  role = 'COMMUNITY MEMBER';
  linkedInToken = '';
  registerUrl = 'create-account?role=' + this.role;
  ngOnInit(): void {
    localStorage.setItem('communityId', '2');
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.bsConfig = Object.assign(
      {},
      { containerClass: this.colorTheme, showWeekNumbers: false }
    );
    if (this.commonService.getParameterFromUrl('referalCode')) {
      this.login['buddyReferalCode'] =
        this.commonService.getParameterFromUrl('referalCode');
      localStorage.setItem('buddyReferalCode', this.login['buddyReferalCode']);
      if (this.commonService.getParameterFromUrl('communityId'))
        localStorage.setItem(
          'communityId',
          this.commonService.getParameterFromUrl('communityId')
        );
      else localStorage.removeItem('communityId');
      this.registerUrl =
        'create-account?role=' +
        this.login?.role +
        '&communityId=' +
        localStorage.getItem('communityId') +
        '&referalCode=' +
        localStorage.getItem('buddyReferalCode');
    } else localStorage.removeItem('referalCode');
    this.linkedInToken = this.route.snapshot.queryParams['code'];
    if (this.linkedInToken && this.linkedInToken.length > 1) {
      this.login = {};
      this.login.role = this.role;
      this.login['linkedInCode'] = this.linkedInToken;
      if (localStorage.getItem('buddyReferalCode'))
        this.login['buddyReferalCode'] =
          localStorage.getItem('buddyReferalCode');
      this.onSubmit();
    }
    if (localStorage.getItem('accesstoken')) {
      this.router.navigate(['/']);
    }
    this.selectedRole = localStorage.getItem('role') || '';

    /**
     * Form Validatyion
     */

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.commonService.authService.authState.subscribe((user) => {
      console.log('Got response ' + user);
      if (user == null || this.gotResponseFromSocial) return;

      this.login = {};
      this.login.role = this.role;
      this.gotResponseFromSocial = true;
      this.user = user;
      this.loggedIn = user != null;

      if (this.loggedIn) {
        if (localStorage.getItem('buddyReferalCode'))
          this.login['buddyReferalCode'] =
            localStorage.getItem('buddyReferalCode');
        this.login['tokenid'] = this.user.idToken;
        this.onSubmit();
      }
    });
  }

  setRole(role: string): void {
    this.selectedRole = role;
    localStorage.setItem('role', role);
  }

  user: any;
  loggedIn: any;
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  login: any;
  message = '';
  blockLogin = false;
  onSubmit() {
    if (this.blockLogin) return;
    this.submitted = true;

    // Login Api
    this.message = '';
    if (!this.login) this.login = {};
    if (!this.login['tokenid'] && !this.linkedInToken) {
      this.login['username'] = this.f['email'].value;
      this.login.password = this.f['password'].value;
    }
    this.authenticationService.login(this.login, (data: any) => {
      //this.showModal(this.varying,'rajeen');
      if (data['result'] === 201 || data['result'] === 200) {
        localStorage.setItem('accesstoken', data['dataObject']['accesstoken']);
        localStorage.setItem('usersname', data['dataObject']['name']);
        this.user = {};
        this.user.name = data['dataObject']['name'];
        this.user.id = data['dataObject']['id'];
        this.user.username = data['dataObject']['username'];
        this.user.dob = data['dataObject']['dob'];
        this.user.mobileno = data['dataObject']['mobileno'];
        this.user.linkedin = data['dataObject']['linkedin'];
        this.user.profilepic = data['dataObject']['profilepic'];
        this.user.referralCode = data['dataObject']['myReferalCode'];
        // console.log("this is user", data['dataObject'])
        this.user.userrole = this.selectedRole;
        // here i am changing the localStorage role so what is passing from the login page buttons it will save as role...
        // localStorage.setItem('role',this.role);
        localStorage.setItem('role', this.selectedRole);

        localStorage.setItem('user', JSON.stringify(this.user));
        this.commonService.user = this.user;
        this.commonService.loadAccessRights();
        this.commonService.loadMyMembership((member: any) => {
          this.user.confirmedUser = member.acceptanceByAceMaker;
          localStorage.setItem('user', JSON.stringify(this.user));
        });
        if (data['dataObject']['isNewSocialUser']) {
          localStorage.setItem('stepper', '1');
          if (this.selectedRole == 'COMMUNITY MEMBER')
            this.router.navigate(['recr/earn']);
          else if (this.selectedRole == 'Talent') this.router.navigate(['/']);
          else this.router.navigate(['auth/register']);
        } else {
          if (this.selectedRole == 'COMMUNITY MEMBER') {
            if (this.user.mobileno === null || this.user.linkedin === null) {
              this.router.navigate(['recr/earn']);
            } else this.router.navigate(['/']);
          }
        }
      } else {
        this.message = data['message'];
        if (this.message.indexOf('This email id is already used to register')!=-1 ) {
          setTimeout(() => {
            // window.location.reload();
          }, 2000);
        }
        localStorage.removeItem('accesstoken');
        this.login['username'] = undefined;
        this.login['password'] = undefined;
      }
    });
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  gotResponseFromSocial = false;
  signInWithGoogle(): void {
    //        google.accounts.id.prompt();
    this.gotResponseFromSocial = false;
    if (localStorage.getItem('cookiesEnabled'))
      this.message = localStorage.getItem('cookiesEnabled') + '';
    else {
      //  localStorage.setItem('role',this.role);
      localStorage.setItem('role', this.selectedRole);
      //        this.commonService.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }
  }
  linkedInCredentials = {
    clientId: '77iz34t71uso4r',
    //redirectUrl: this.commonService.uiPrefix.split("/#/")[0],
    redirectUrl: (
      this.commonService.uiPrefix +
      'uploads/ext-responses/linkedinResponse.html'
    ).replace('/pieworksportal', ''),
    scope: 'openid profile email w_member_social', // r_basicprofile%20r_emailaddress%20w_member_social
  };
  loginViaLinkedin(): void {
    if (this.linkedInCredentials.redirectUrl.indexOf('4200') != -1)
      this.linkedInCredentials.redirectUrl =
        this.linkedInCredentials.redirectUrl.replace('4200', '8080');
    window.location.href =
      'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=' +
      this.linkedInCredentials.clientId +
      '&scope=' +
      this.linkedInCredentials.scope +
      '&redirect_uri=' +
      this.linkedInCredentials.redirectUrl;
  }
  showModal(template: TemplateRef<any>, name: any) {
    if (!this.otpIdentifier) {
      this.commonService.showErrorMessage(
        'Error',
        'Please enter email id for receiving OTP.'
      );
      return;
    }
    this.name = name;
    this.modalRef = this.modalService.show(template, this.config);
  }

  emailVerified = false;
  emailVerifiedCb(otp: any): void {
    this.emailVerified = true;
    this.modalRef?.hide();
    this.login = {};
    this.login.otpLogin = otp;
    //this.f['password'].value=otp;
    this.blockLogin = false;
    this.onSubmit();
  }
}
