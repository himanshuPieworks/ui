import {
  Component,
  ViewChild,
  TemplateRef,
  Input,
  HostListener,
  ElementRef,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

// Register Auth
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { PieworksCommonService } from '../../common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

// Register Component
export class RegisterComponent {
  // Login Form
  signupForm!: UntypedFormGroup;
  submitted = false;
  successmsg = false;
  parentObj = this;
  error = '';
  stepperValue: any;

  @ViewChild('googleSignInButton') googleSignInButton!: ElementRef;
  // set the current year
  year: number = new Date().getFullYear();
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  paramUrl: boolean = true;
  selectedRole: string = '';

  @ViewChild('varying') varying: any;
  // @ViewChild('otpVerification') otpVerification: any;
  fieldTextType!: boolean;
  fieldTextType1!: boolean;
  displayGoogleIcon = false;
  constructor(
    private modalService: BsModalService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public commonService: PieworksCommonService,
    private authenticationService: AuthenticationService,
    private userService: UserProfileService
  ) {
    // this.stepperValue = localStorage.getItem('stepper');
    // localStorage.removeItem('stepper');
    //  console.log(this.stepperValue)
    if (this.stepperValue) {
      this.showSuccessRegistered();
    }

    this.checkIfClientInUrl();
    setTimeout(() => {
      this.displayGoogleIcon = true;
    }, 1000);
  }

  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  checkIfClientInUrl() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/community')) {
      this.setRole('COMMUNITY MEMBER');
      this.showAndHideRegister();
    } else if (currentUrl.includes('/client')) {
      this.setRole('Client');
      this.showAndHideRegister();
    } else if (currentUrl.includes('/talent')) {
      this.setRole('Talent');
      this.showAndHideRegister();
    } else {
      // console.log("URL does not contain /client");
      this.paramUrl = true;
    }
  }

  login: any = {};
  gotResponseFromSocial = false;
  loggedIn = false;
  acceptedTerms = false;
  role = 'COMMUNITY MEMBER';
  linkedInToken = '';
  message = '';
  ngOnInit(): void {
    this.loadDocuments();
    /**
     * Form Validatyion
     */
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
    });
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
    } else localStorage.removeItem('referalCode');
    this.linkedInToken = this.route.snapshot.queryParams['code'];
    if (this.linkedInToken && this.linkedInToken.length > 1) {
      this.login = {};
      this.login.role = this.role;
      this.login['linkedInCode'] = this.linkedInToken;
      if (localStorage.getItem('buddyReferalCode'))
        this.login['buddyReferalCode'] =
          localStorage.getItem('buddyReferalCode');

      localStorage.setItem('stepper', '1');
      this.socialLogin();
    }

    this.commonService.authService.authState.subscribe((user) => {
      // console.log(user.email);
      //if (this.gotResponseFromSocial) return;
      console.log(1);
      localStorage.setItem('stepper', '1');
      this.login = {};
      this.login.role = this.role;
      this.gotResponseFromSocial = true;
      this.user = user;
      this.loggedIn = user != null;
      if (user?.email) {
        if (localStorage.getItem('buddyReferalCode'))
          this.login['buddyReferalCode'] =
            localStorage.getItem('buddyReferalCode');
        this.login['tokenid'] = this.user.idToken;
        console.log(0);
        localStorage.setItem('stepper', '1');
        this.socialLogin();
      }
    });

    this.selectedRole = localStorage.getItem('role') || '';
  }

  setRole(role: string): void {
    this.selectedRole = role;
    localStorage.setItem('role', role);
  }

  toggleTermsAcceptance(): void {
    console.log(
      this.f['email'].value + this.f['name'].value + this.f['password'].value
    );
    if (
      this.f['email'].value != '' &&
      this.f['name'].value != '' &&
      this.f['password'].value != ''
    ) {
      this.acceptedTerms = !this.acceptedTerms;
    }
  }

  customGoogleLogin() {
    this.googleSignInButton.nativeElement.click();
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  @Input() user: any = {};

  /**
   * Register submit form
   */
  passwordNotMatching = false;
  otpIdentifier: any;
  otpPurpose = 'verify email id';
  disableButton = false;
  onSubmit(): any {
    this.submitted = true;
    this.passwordNotMatching = false;
    if (!this.emailVerified) {
      this.generateOtp();
      return;
    }

    if (
      this.f['email'].errors != null ||
      this.f['name'].errors != null ||
      this.f['password'].errors != null
    ) {
      return;
    }
    var user: any = {};
    user.userrole = this.selectedRole;
    user.name = this.f['name'].value;
    user.username = this.f['email'].value;
    user.password = this.f['password'].value;
    user.userrole = this.selectedRole;
    user.password = CryptoJS.AES.encrypt(
      user.password,
      user.username
    ).toString();
    if (localStorage.getItem('buddyReferalCode'))
      user['buddyReferalCode'] = localStorage.getItem('buddyReferalCode');
    this.disableButton = true;
    this.commonService
      .post('mainservice/auth/signup', user)
      .subscribe((data: any) => {
        this.disableButton = false;
        if (data['result'] == 200) {
          this.user = data['dataObject'];

          if (localStorage.getItem('role') == 'Talent') {
            this.showAfterStepper();
          } else this.onLogin();

          this.signupForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', [Validators.required]],
            password: ['', Validators.required],
            cpassword: ['', Validators.required],
          });
        } else {
          this.message = data['message'];
        }
      });
  }

  
  // login after new registration
  onLogin() {
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
        this.user.userrole = this.selectedRole;
        // here i am changing the localStorage role so what is passing from the login page buttons it will save as role...
        // localStorage.setItem('role',this.role);
        localStorage.setItem('role', this.selectedRole);

        localStorage.setItem('user', JSON.stringify(this.user));
        this.commonService.user = this.user;
        // alert(this.commonService.user.userrole)
        this.commonService.loadAccessRights();
        this.commonService.loadMyMembership((member: any) => {
          this.user.confirmedUser = member.acceptanceByAceMaker;
          localStorage.setItem('user', JSON.stringify(this.user));
        });
        if (data['dataObject']['isNewSocialUser']) {
          // alert(this.selectedRole)
          localStorage.setItem('stepper', '1');
          this.router.navigate(['auth/register']);
        } else {
          this.router.navigate(['recr/earn']);
        }
      } else {
        this.message = data['message'];
        if (this.message.indexOf('This email id is already used to register')!=-1 ){
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
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }
  linkedInCredentials = {
    clientId: '77iz34t71uso4r',
    //redirectUrl: this.commonService.uiPrefix.split("/#/")[0],
    redirectUrl: (
      this.commonService.uiPrefix +
      'uploads/ext-responses/linkedinResponse.html'
    ).replace('/pieworksportal', ''),
    scope: 'openid profile email', // r_basicprofile%20r_emailaddress%20w_member_social
  };
  loginViaLinkedin(): void {
    window.location.href =
      'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=' +
      this.linkedInCredentials.clientId +
      '&scope=' +
      this.linkedInCredentials.scope +
      '&redirect_uri=' +
      this.linkedInCredentials.redirectUrl;
  }

  socialLogin() {
    // Login Api
    this.message = '';
    if (!this.login) this.login = {};
    if (!this.login['tokenid']) {
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
        this.user.userrole = this.selectedRole;

        // the role is set on button select .
        localStorage.setItem('role', this.selectedRole);

        // localStorage.setItem('role', this.role);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.commonService.user = this.user;

        this.stepperValue = localStorage.getItem('stepper');
        if (this.stepperValue) {
          localStorage.removeItem('stepper');
          // when client then use else if
          // alert(this.commonService.user.userrole)
          if (this.commonService.user.userrole == 'Talent') {
            this.showAfterStepper();
          } else this.showSuccessRegistered();
        }
        this.commonService.user = this.user;
        // alert(this.commonService.user.user);
        this.commonService.loadMyMembership((member: any) => {
          this.user.confirmedUser = member.acceptanceByAceMaker;
          localStorage.setItem('user', JSON.stringify(this.user));
        });
      } else {
        this.message = data['message'];
        localStorage.removeItem('accesstoken');
        this.login['username'] = undefined;
        this.login['password'] = undefined;
      }
    });
  }
  showOtpWindow(): void {
    this.showModal(this.varying, 'rajeen');
    // this.otpVerification.show();
  }
  showModal(template: TemplateRef<any>, name: any) {
    if (!this.otpIdentifier) {
      this.commonService.showErrorMessage(
        'Error',
        'Please enter email id for receiving OTP.'
      );
      return;
    }
    // this.name = name;
    this.modalRef = this.modalService.show(template, this.config);
  }
  emailVerified = false;
  emailVerifiedCb(returnObj: any): void {
    this.emailVerified = true;
    // this.modalRef?.hide();
    this.onSubmit();
  }

  toggle: boolean = false;
  showModel: boolean = true;
  termAndCondition: boolean = false;
  registerSuccess: boolean = false;
  showStepper: boolean = false;
  afterStepper: boolean = false;
  showFuture: boolean = false;

  showAndHideRegister(): void {
    this.toggle = true;
    this.showModel = false;
  }

  showStepperClick(): void {
    this.toggle = false;
    this.showModel = false;
    this.termAndCondition = false;
    this.registerSuccess = false;

    this.showStepper = true;
    // if (localStorage.getItem('role') == 'COMMUNITY MEMBER') {
    //   this.showStepper = true;
    // }

    // else if (localStorage.getItem('role') == 'Talent') {
    //   this.afterStepper = true;
    // }
  }

  newLoginForwardUrl() {
    localStorage.setItem('forwardUrl', '/recr/earn');
    this.router.navigate(['/auth/login']);
  }

  showAfterStepper(): void {
    this.router.navigate(['/']);
  }
  showSuccessRegistered(): void {
    this.router.navigate(['recr/earn']);
  }

  backgroundImagePath: string = '/assets/images/background.png';

  backToRegister(): void {
    this.toggle = true;
    this.showModel = false;
    this.termAndCondition = false;
  }

  contractUrl: any;
  loadDocuments(): void {
    this.commonService
      .get(
        'mainservice/framework2/open/independentContracts?domain=recruitment'
      )
      .subscribe((data: any) => {
        if (!data['dataArray'] || data['dataArray'].length == 0) {
          return;
        }
        this.contractUrl = this.commonService.getPicUrl(
          data['dataArray'][0]?.url
        );
      });
  }

  password: string = '';
  strength: number = 0;

  updateMeter() {
    this.strength = this.calculatePasswordStrength(this.password);
  }

  calculatePasswordStrength(password: string): number {
    const lengthWeight = 0.2;
    const uppercaseWeight = 0.5;
    const lowercaseWeight = 0.5;
    const numberWeight = 0.7;
    const symbolWeight = 1;

    let strength = 0;

    strength += password.length * lengthWeight;

    if (/[A-Z]/.test(password)) {
      strength += uppercaseWeight;
    }

    if (/[a-z]/.test(password)) {
      strength += lowercaseWeight;
    }

    if (/\d/.test(password)) {
      strength += numberWeight;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      strength += symbolWeight;
    }

    return Math.min(Math.floor(strength), 4); // Limit strength to 4
  }

  otp: any = {};
  // message = '';
  seconds = 0;
  timerHandle: any;
  // year: number = new Date().getFullYear();

  generateOtp(): void {
    if (!this.otpIdentifier) {
      // Display an alert if the identifier is missing
      Swal.fire('Error', 'Identifier not found', 'error');
      return;
    }

    // Start OTP countdown timer
    this.seconds = 60;
    let otp = { identifier: this.otpIdentifier };
    this.commonService
      .post(
        `mainservice/framework2/open/sendOtp?purpose=${this.otpPurpose}`,
        otp
      )
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          if (this.timerHandle) clearInterval(this.timerHandle);
          this.timerHandle = setInterval(() => {
            this.seconds -= 1;
            if (this.seconds <= 0) clearInterval(this.timerHandle);
          }, 1000);

          // Open SweetAlert2 OTP input after OTP generation
          this.showOtpInput();
        }
      });
  }

  showOtpInput(): void {
    Swal.fire({
      title: 'Enter OTP',
      html: `
      <div>
      <p>
        Please enter the 4 digit code sent to
        <span class="fw-semibold">`
          + this.otpIdentifier +
        `</span>. Valid for 5 mins.
      </p>
      </div>
        <div style="display: flex; gap: 4px; justify-content: center;">
          <input type="text" id="otp1" maxlength="1" class="swal2-input" style="width: 50px; text-align: center;">
          <input type="text" id="otp2" maxlength="1" class="swal2-input" style="width: 50px; text-align: center;">
          <input type="text" id="otp3" maxlength="1" class="swal2-input" style="width: 50px; text-align: center;">
          <input type="text" id="otp4" maxlength="1" class="swal2-input" style="width: 50px; text-align: center;">
        </div>
      `,
      confirmButtonText: 'Verify',
      focusConfirm: false,
      didOpen: () => {
        const otpInputs = Array.from(
          { length: 4 },
          (_, i) => document.querySelector(`#otp${i + 1}`) as HTMLInputElement
        );

        otpInputs.forEach((input, index) => {
          input.oninput = () => {
            if (input.value.length === 1 && index < 3)
              otpInputs[index + 1].focus();
          };

          input.onkeydown = (event) => {
            // Handle Backspace to move to the previous input
            if (event.key === 'Backspace' && input.value === '' && index > 0) {
              otpInputs[index - 1].focus();
            }

            // Handle Enter for form submission if all fields are filled
            if (event.key === 'Enter' && otpInputs.every((el) => el.value)) {
              Swal.clickConfirm();
            }
          };
        });

        otpInputs[0].focus(); // Focus on the first input field
      },
      preConfirm: () => {
        const otpValue = Array.from(
          { length: 4 },
          (_, i) =>
            (document.querySelector(`#otp${i + 1}`) as HTMLInputElement).value
        ).join('');
        if (otpValue.length !== 4) {
          Swal.showValidationMessage(`Please enter a 4-digit OTP`);
          return;
        }
        return { otp: otpValue };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.verifyOtp(result.value?.otp);
      }
    });
  }

  verifyOtp(otpValue: string): void {
    const otpData = {
      identifier: this.otpIdentifier,
      otpValue: otpValue,
    };

    this.commonService
      .post('mainservice/framework2/open/matchOtp', otpData)
      .subscribe((data: any) => {
        if (data['result'] === 200 && data['message'] === 'true') {
          this.emailVerifiedCb(otpValue);
        } else {
          this.message = data['message'] || 'Invalid OTP';
          Swal.fire('Error', this.message, 'error');
        }
      });
  }
}
