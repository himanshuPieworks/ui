import { Component,ViewChild,TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PieworksCommonService } from '../../common/pieworkscommon.service';

@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.component.html',
  styleUrls: ['./pass-reset.component.scss']
})

// Password Reset 
export class PassResetComponent {
  // set the currenr year
  year: number = new Date().getFullYear();
  constructor(private modalService: BsModalService,private formBuilder: UntypedFormBuilder,private route: ActivatedRoute, private router: Router,private commonService: PieworksCommonService) { }
   signupForm!: UntypedFormGroup;
  submitted = false;
  successmsg = false;
  parentObj = this;
  error = '';
   login:any={}; gotResponseFromSocial=false;user:any={};loggedIn=false;role="COMMUNITY MEMBER";linkedInToken="";message="";
    modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };   
   @ViewChild("varying") varying:any;
  fieldTextType!: boolean;
  fieldTextType1!: boolean;  
  ngOnInit(): void {
    /**
     * Form Validatyion
     */
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
    });
  }
    passwordNotMatching=false;otpIdentifier:any;otpPurpose="verify email id";
  onSubmit():any {
    this.submitted = true;
    this.passwordNotMatching=false;
    if(!this.emailVerified)
    {
        //this.commonService.showErrorMessage("Error","Email verification pending");
        return;
    }
    if(this.f["password"].value!=this.f["cpassword"].value)
    {
        this.passwordNotMatching=true;
        return;
    }
    if(this.f['email'].errors!=null || this.f['password'].errors!=null)
    {
        return;
    }
    var user:any={};
    user.role = this.role;
    user.username=this.f["email"].value;
    user.password=this.f["password"].value;
    user.password = CryptoJS.AES.encrypt(user.password, user.username).toString();
    user.otpLogin = this.otpValue;
    if(localStorage.getItem("buddyReferalCode"))
        user["buddyReferalCode"]=localStorage.getItem("buddyReferalCode");
    this.commonService.post("mainservice/auth/openresource/resetPassword",user).subscribe((data:any) => 
    {
        if(data["result"]==200)
        {
            this.signupForm = this.formBuilder.group({
                email: ['', [Validators.required, Validators.email]],
                password: ['', Validators.required],
                cpassword: ['', Validators.required],
              });
              this.commonService.showSuccessMessage("Success",data["message"]);
              this.router.navigate(['/']);
        }
        else
            this.commonService.showSuccessMessage("",data["message"]);
    })
  }
  showOtpWindow():void
    {
        if(!this.otpIdentifier)
        {
            this.commonService.showErrorMessage("Error","Please enter your email id.");
            return;
        }
        this.showModal(this.varying,'rajeen');
    }
    showModal(template: TemplateRef<any>, name: any) 
    {
        this.modalRef = this.modalService.show(template, this.config);
    }
    emailVerified = false;
    otpValue="";
    emailVerifiedCb(otp:any):void
    {
        this.otpValue = otp;
        this.emailVerified = true;
        this.modalRef?.hide();
    }
    get f() { return this.signupForm.controls; }
    toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }
}
