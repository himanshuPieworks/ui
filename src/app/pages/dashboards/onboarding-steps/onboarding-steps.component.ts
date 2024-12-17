import { Component, Input, ViewChild } from '@angular/core';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-onboarding-steps',
  templateUrl: './onboarding-steps.component.html',
  styleUrls: ['./onboarding-steps.component.scss'],
})
export class OnboardingStepsComponent {
  @Input('parentObj') parentObj: any;
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  bsConfig?: Partial<BsDatepickerConfig>;
  colorTheme: any = 'theme-blue';

  constructor(
    public commonService: PieworksCommonService,
    private route: ActivatedRoute
  ) {}
  @ViewChild('stepper') stepper: any;
  ngOnInit(): void {
    /**
     * BreadCrumb
     */

    console.log(this.commonService.currentLocation);
    this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Wizard', active: true },
    ];
    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: this.colorTheme,
        showWeekNumbers: false,
      }
    );
    this.loadProfile();
    this.loadDocuments();
  }
  change(event: any) {
    this.submitted = true;
    console.log(event);
  }
  validateProfileCompletion(): void {
    setTimeout(() => {
      if (
        this.user.mobileno &&
        this.user.name &&
        this.user.dob != 'Invalid Date'
      )
        this.completedStep1 = true;
      else this.completedStep1 = false;
    }, 100);
  }
  currentStep = 'Complete Profile';
  submitted = false;
  user: any = {};
  completedStep1 = false;
  completedStep2 = false;
  completedStep3 = false;
  imgPreview = '';
  loadProfile(): void {
    var temp = JSON.parse(localStorage.getItem('user') + '');
    var url = 'mainservice/auth/myprofile';
    url = 'mainservice/framework/user/' + temp.id;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.user = data['dataObject'];
        this.user.dob = new Date(this.user.dob);
        if (!this.user.profilepic || this.user.profilepic.length < 2)
          this.user.profilepic = 'assets/images/users/user-dummy-img.jpg';
        this.imgPreview = this.commonService.urlPrefix + this.user.profilepic;
        if (this.user.linkedIn && this.user.linkedIn.indexOf('http') == -1)
          this.user.linkedIn = 'https://' + this.user.linkedIn;
        this.validateProfileCompletion();
        if (!this.user.mobileno) {
          this.stepper.selectedIndex = 0;
        }
        this.loadKyc(this.user.id);
      }
    });
  }

  saveProfile(): void {
    this.user.dob = this.user.dob.toISOString().split('T')[0];
    this.commonService
      .post('mainservice/auth/user', this.user)
      .subscribe((data: any) => {
        this.submitted = false;
      });
  }
  /*KYC part starts here*/
  message: any;
  errormessage: any;
  userId: any;
  name: any;
  emergencyContactAddress: any;
  emergencyContactName: any;
  emergencyContactRelation: any;
  emergencyContactNumber: any;
  files: any = {};
  filesFormArray: any = [
    {
      name: 'PAN Card',
      docType: 'panCard',
      index: 0,
      filesArray: [],
      help: '',
    },
    {
      name: 'Address Proof*',
      docType: 'addressProof',
      help: '(Both sides of Aadhaar card)',
      sampleImg: 'assets/images/Aadhaar_demo.jpg',
      index: 1,
      filesArray: [],
    },
    {
      name: 'Bank Details',
      help: '(Cancelled Bank cheque or Bank Details from mobile screenshot namely Account Name, Account Number, IFSC Code)',
      docType: 'cancelledCheque',
      index: 2,
      filesArray: [],
    },
  ];
  imageURL: any;
  filesArray: any = [];
  loadKyc(userId: any): void {
    var kyc = undefined;
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/kyc?userId=' + userId)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          kyc = data['dataObject'];
          if (!this.user.mobileno) this.stepper.selectedIndex = 0;
          else if (kyc == null || kyc == undefined) {
            this.stepper.selectedIndex = 1;
            return;
          }
          this.emergencyContactName = kyc.emergencyContactName;
          this.emergencyContactRelation = kyc.emergencyContactRelation;
          this.emergencyContactNumber = kyc.emergencyContactNumber;
          this.emergencyContactAddress = kyc.emergencyContactAddress;
        }
        this.loadMember();
      });
  }
  onRemove(event: any, index: any) {
    this.filesFormArray[index].filesArray.splice(
      this.filesFormArray[index].filesArray.indexOf(event),
      1
    );
  }
  onFileSelecet(event: any, extractData: any, docType: any, index: any) {
    if (event.addedFiles.length == 0) {
      return;
    }
    let file: File = event.addedFiles[0];
    if (file.size > 10485760 * 1) {
      //10 x 1 MB limit
      this.errormessage =
        'File size too big. Please choose a file less than 10 MB.';
      this.commonService.showErrorMessage('Error', this.errormessage);
      this.filesFormArray[index].filesArray.splice(0, 1);
      return;
    }
    if (this.filesFormArray[index].filesArray.length > 0)
      if (this.filesFormArray[index].docType != 'addressProof')
        this.filesFormArray[index].filesArray.splice(0, 1);

    this.filesFormArray[index].filesArray.push(...event.addedFiles);
    const reader = new FileReader();
    reader.onload = () => {
      this.filesFormArray[index].imageURL = reader.result as string;
      this.imageURL = reader.result as string;
      if (file.name.indexOf('.pdf') != -1)
        this.imageURL = 'assets/images/verification-img.png';
      setTimeout(() => {
        // this.profile.push(this.imageURL)
      }, 100);
    };
    reader.readAsDataURL(file);
    //--------------------------------------------
    this.errormessage = '';
    var extraInfo = '';
    if (this.filesFormArray[index].filesArray.length > 1) {
      extraInfo = '2';
    }
    this.files[docType + extraInfo] = file;
    this.validateKycCompletion();

    if (
      this.filesFormArray[index].docType == 'addressProof' &&
      this.filesFormArray[index].filesArray.length == 1
    ) {
      this.commonService.showInfoMessage(
        'Info',
        'please upload back side of aadhaar card also '
      );
    }
  }

  validateKycCompletion(): void {
    if (
      this.emergencyContactName &&
      this.emergencyContactAddress &&
      this.emergencyContactRelation &&
      this.emergencyContactNumber
    )
      this.completedStep2 = true;
    else this.completedStep2 = false;
  }
  submitKyc(): void {
    this.errormessage = '';
    this.message = '';

    /*if(!this.files["panCard"] || this.files["panCard"]==null)
      {
          this.errormessage = "Please upload pan card copy.";
          this.commonService.showErrorMessage("Error",this.errormessage);
          return;
      }*/
    // if (!this.files['addressProof'] || this.files['addressProof'] == null) {
    //   this.errormessage = 'Please upload Aadhaar card.';
    //   this.commonService.showErrorMessage('Error', this.errormessage);
    //   return;
    // }
    /*if(!this.files["cancelledCheque"] || this.files["cancelledCheque"]==null)
      {
          this.errormessage = "Please upload bank details.";
          this.commonService.showErrorMessage("Error",this.errormessage);
          return;
      }*/
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
    if (this.files['panCard'])
      formData.append(
        'panCard',
        this.files['panCard'],
        this.files['panCard'].name
      );
    if (this.files['addressProof']) {
      formData.append(
        'addressProof',
        this.files['addressProof'],
        this.files['addressProof'].name
      );
    }
    if (this.files['addressProof2']) {
      formData.append(
        'addressProof2',
        this.files['addressProof2'],
        this.files['addressProof2'].name
      );
    }
    if (this.files['cancelledCheque'])
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
      Authorization: '', //localStorage.getItem("accesstoken").toString()
    });
    let options = { headers: headers };
    this.commonService.showProcessingIcon();
    alert("here i am ")
    this.commonService
      .post2('mainservice/framework/open/kyc', formData, options)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.message =
            'Thank you for providing the KYC documents. We will update you once the verification is done.';
        } else {
          this.commonService.showErrorMessage(
            'Error',
            'File upload failed. Please try again later.'
          );
          this.errormessage = data['message'];
        }
      });
  }

  //---------------contract handling
  contractUrl: any = '';
  newMember: any = true;
  member: any;
  loadMember(): void {
    var url =
      'mainservice/framework/openresource/members/-1?acceptanceByAceValues=-1&acceptanceByAceMakerValues=-1&userId=' +
      this.user.id +
      '&roleInCommunity=-1';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.member = data['dataArray'][0];
        this.date = data['dataArray'][0].contractDate;
        this.parentObj.loadedProfileFromOnBoardingSteps(data['dataArray'][0]);
        if (
          this.stepper?.selectedIndex == 0 &&
          this.member.contractAcceptance == 'pending'
        ) {
          this.stepper.selectedIndex = 2;
        }
        if (this.member.acceptanceByAceMaker != 0) {
          this.completedStep1 = true;
          document.getElementById('pills-info-desc-tab')?.click();
          this.completedStep2 = true;
          setTimeout(() => {
            document.getElementById('pills-info-3-tab')?.click();
          }, 100);
        }
      }
    });
  }
  communityId: any;
  checked: any;
  date: any;
  submitContractAcceptance(): void {
    this.errormessage = '';
    this.message = '';
    var args = {
      arg1: localStorage.getItem('communityId') + '',
      arg2: this.user.id,
    };
    this.commonService
      .post('mainservice/framework/open/acceptContract', args)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          if (this.member.acceptanceByAceMaker != 0) {
            this.parentObj.finishedOnBoardingSteps();
            this.commonService.showSuccessMessage(
              '',
              'Thank you. Your response has been recorded.'
            );
          }
        } else {
          this.errormessage =
            'Couldnt record your response. Please try again later';
          this.commonService.showErrorMessage('', this.errormessage);
        }
      });
  }

  contactUs(): void {
    var mesg =
      this.user.name +
      ' has tried to reach out for clarification on the new contract. Kindly reach out to him/her at the earliest. ';
    mesg =
      mesg +
      'He/she can be reached out at ' +
      this.user.name +
      ',' +
      this.user.mobileno;
    //recepientName,subject,message1,message2,toEmailId,ccEmailId,bccEmailId,link1,link2,link1Name,link2Name
    this.commonService.sendMail(
      '',
      this.user.name + ' has tried to reach out.',
      mesg,
      undefined,
      'accounts@pieworks.in',
      'smritilekha@gmail.com,jewel@pieworks.in',
      'anush@pieworks.in',
      undefined,
      undefined,
      undefined,
      undefined,
      'altlife@pieworks.in'
    );
    this.commonService.showSuccessMessage(
      '',
      'Thank you for reaching out, someone from the contracts team will reach out to you.'
    );
  }

  loadDocuments(): void {
    this.commonService
      .get(
        'mainservice/framework2/open/independentContracts?domain=recruitment'
      )
      .subscribe((data: any) => {
        this.contractUrl =
          this.commonService.urlPrefix + data['dataArray'][0].url;
      });
  }
}
