import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-login-stepper',
  templateUrl: './login-stepper.component.html',
  styleUrls: ['./login-stepper.component.scss'],
})
export class LoginStepperComponent {
  @Output() callParentFunction: EventEmitter<void> = new EventEmitter<void>();

  callParent() {
    this.callParentFunction.emit();
  }

  backgroundImagePath: string = 'assets/images/background.png';
  currentStep = 'Complete Profile';
  submitted = false;
  @Input('user') user: any = {};
  completedStep1 = false;
  completedStep2 = false;
  completedStep3 = false;
  completedStep4 = false;
  imgPreview = '';
  bsConfig?: Partial<BsDatepickerConfig>;
  message: any;
  errormessage: any;
  userId: any;
  name: any;
  emergencyContactAddress: any;
  emergencyContactName: any;
  emergencyContactRelation: any;
  emergencyContactNumber: any;

  imageURL:any;
  filesArray:any = [];
  files:any = [];
  filesFormArray: any = [
    { name: 'PAN Card ', docType: 'panCard', index: 0, filesArray: [] },
    {
      name: 'Address Proof *',
      docType: 'addressProof',
      index: 1,
      filesArray: [],
      important:"Both side of Aadhaar Card is Mandatory *"
    },
    {
      name: 'Bank Details ',
      docType: 'cancelledCheque',
      index: 2,
      filesArray: [],
      tooltip:"document with account number, account name and IFSC Code"
    },
  ];
  userRole:any="COMMUNITY MEMBER";
  constructor(public commonService: PieworksCommonService) {
      this.userRole = localStorage.getItem('role');
  }

  

  change(event: any) {
    this.submitted = true;
  }

  // LinkedIn URL validation pattern
  linkedInPattern: string = '^(https?://)?(www\\.)?linkedin\\.com/.*$';


  validateProfileCompletion(): void {
    setTimeout(() => {
      if (this.user.name && this.user.mobileno && this.user.username && this.user.linkedIn) this.completedStep1 = true;
      else this.completedStep1 = false;
    }, 100);
  }

  loadKyc(userId: any): void {
    var kyc = undefined;
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/kyc?userId=' + this.user.id)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          kyc = data['dataObject'];
          if (kyc == null || kyc == undefined) return;
          this.emergencyContactName = kyc.emergencyContactName;
          this.emergencyContactRelation = kyc.emergencyContactRelation;
          this.emergencyContactNumber = kyc.emergencyContactNumber;
          this.emergencyContactAddress = kyc.emergencyContactAddress;
        }
      });
  }

  onFileSelecet(event:any, extractData:any, docType:any, index:any) {
    console.log(docType);
    if (event.target.files.length == 0) {
      return;
    }

    let file:File = event.target.files[0];

    if (file.size > 10485760 * 1) {
      //10 x 1 MB limit
      this.errormessage =
        'File size too big. Please choose a file less than 10 MB.';
      this.commonService.showErrorMessage('Error', this.errormessage);
      this.filesFormArray[index].filesArray.splice(0, 1);
      this.completedStep2 = true;
      return;
    }

    this.files[docType] = file;
    this.validateKycCompletion();
  }

  onRemove(event: any, index: any) {
    this.filesFormArray[index].filesArray.splice(
      this.filesFormArray[index].filesArray.indexOf(event),
      1
    );
  }

  validateEmergencyContact(): void {
    if (
      this.emergencyContactName &&
      this.emergencyContactAddress &&
      this.emergencyContactRelation &&
      this.emergencyContactNumber
    )
      this.completedStep3 = true;
    else this.completedStep3 = false;
  }

  validateKycCompletion(): void {
    if (
      this.files['addressProof']
    )
      this.completedStep2 = true;
    else this.completedStep2 = false;
  }

  validateCheckboxChecked(): void {
    if (this.answers != null) this.completedStep4 = true;
    else this.completedStep4 = false;
  }

  submitKyc(): void {
    this.errormessage = '';
    this.message = '';

    // if (!this.files['panCard'] || this.files['panCard'] == null) {
    //   this.files['panCard'].name = ""
    // }
    if (!this.files['addressProof'] || this.files['addressProof'] == null) {
      this.errormessage = 'Please upload Aadhaar card.';
      this.commonService.showErrorMessage('Error', this.errormessage);
      return;
    }
    // if (
    //   !this.files['cancelledCheque'] ||
    //   this.files['cancelledCheque'] == null
    // ) {
    //   this.files['cancelledCheque'].name = ""
    // }
    if (!this.emergencyContactName) {
      this.errormessage = 'Please enter emergency contact name.';
      this.commonService.showErrorMessage('Error', this.errormessage);
      return;
    }
    if (!this.emergencyContactRelation) {
      this.errormessage = 'Please enter relation to field.';
      this.commonService.showErrorMessage('Error', this.errormessage);
      return;
    }
    if (!this.emergencyContactNumber) {
      this.errormessage = 'Please enter emergency contact number.';
      this.commonService.showErrorMessage('Error', this.errormessage);
      return;
    }
    if (!this.emergencyContactAddress) {
      this.errormessage = 'Please enter emergency contact address.';
      this.commonService.showErrorMessage('Error', this.errormessage);
      return;
    }

    const formData: FormData = new FormData();
    formData.append('userId', this.user.id);
    formData.append('name', this.user.name);
    if(this.files['panCard'])
    {
      formData.append(
        'panCard',
        this.files['panCard'],
        this.files['panCard'].name
      );
    }
    formData.append(
      'addressProof',
      this.files['addressProof'],
      this.files['addressProof'].name
    );
    if(this.files['cancelledCheque'])
    {
      formData.append(
        'cancelledCheque',
        this.files['cancelledCheque'],
        this.files['cancelledCheque'].name
      );
    }
    formData.append('emergencyContactName', this.emergencyContactName);
    formData.append('emergencyContactRelation', this.emergencyContactRelation);
    formData.append('emergencyContactNumber', this.emergencyContactNumber);
    formData.append('emergencyContactAddress', this.emergencyContactAddress);

    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: localStorage.getItem('accesstoken') + '',
    });
    let options = { headers: headers };
    this.commonService.showProcessingIcon();
    this.commonService
      .post2('mainservice/framework/open/kyc', formData, options)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.message =
            'Thank you for providing the KYC documents. We will update you once the verification is done.';
          this.commonService.showSuccessMessage('KYC Submitted', this.message);
        } else {
          this.commonService.showErrorMessage(
            'Error',
            'File upload failed. Please try again later.'
          );
          this.errormessage = data['message'];
        }
      });
  }

  saveProfile(): void {
    if (!this.user.id) return;
    if(this.user.dob)
        this.user.dob = this.user.dob.toISOString().split('T')[0];
    this.commonService
      .post('mainservice/auth/open/user', this.user)
      .subscribe((data: any) => {
        this.submitted = false;
        if (data['result'] === 200) {
          //proceed to next step only if this step is success.
        }
      });
  }

  clickedOn(item: any): void {
    document.getElementById(item)?.click();
  }

  communityId: any;
  answers: any = {};

  // this is for saving questions we ask at beginning
  updateSurvey(): void {
    this.callParent();
  // this.submitKyc();
   
    var surveyResponse = [];
    surveyResponse.push({
      surveySet: 'member-join-rapidFire1',
      userId: this.user.id,
      no: 1,
      answer: this.answers.a1,
      communityId: 2,
    });
    surveyResponse.push({
      surveySet: 'member-join-rapidFire1',
      userId: this.user.id,
      no: 2,
      answer: this.answers.a2,
      communityId: 2,
    });
    this.message = 'Sending request...';
    this.commonService
      .post(
        'mainservice/framework/generic/openresource/surveyResponse',
        surveyResponse
      )
      .subscribe((data: any) => {
        //this.message = data["message"];
        if (data['result'] == 200) {
        }
      });
  }
}
