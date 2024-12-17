import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-future-form',
  templateUrl: './future-form.component.html',
  styleUrls: ['./future-form.component.scss'],
})
export class FutureFormComponent {
  breadCrumbItems = [
    { label: 'Home', link: '/', active: false },
    { label: 'Manage', link: '/recr/manage', active: false },
    { label: 'Future form', link: '/recr/future-form', active: true },
  ];
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService,
    private clipboard: Clipboard
  ) {}
  userType: any;
  ngOnInit(): void {
    if (window.location.href.indexOf('open') != -1) this.userType = 'talent';
    else this.userType = 'communitymember';
    this.communityId = this.route.snapshot.paramMap.get('communityId');
    if (!this.communityId)
      this.communityId = localStorage.getItem('communityId');
    if (!this.communityId) this.communityId = '2';
    this.userId = localStorage.getItem('userId');
    this.commonService.hideProcessingIcon();
    this.loadCurrentJobFamilyForDropdown(1);
    this.loadNextJobFamilyForDropdown(1);
  }
  candidate: any = {};
  otherJobFunction: any;
  currentOtherJobFunction: any;
  nextOtherJobFunction: any;
  message: any = '';
  communityId: any = '-1';
  userId: any;
  resetForm(): void {
    this.message = '';
    this.candidate = {};
    this.otherJobFunction = undefined;
    this.currentOtherJobFunction = undefined;
    this.nextOtherJobFunction = undefined;
  }

  jobFamiliesL1: any = [];
  jobFamiliesL2: any = [];
  jobFamiliesL3: any = [];
  nextJobFamiliesL1: any = [];
  nextJobFamiliesL2: any = [];
  nextJobFamiliesL3: any = [];
  selectedJobFamilyL3: any;
  selectedCurrentJobFamilyL2: any;
  selectedCurrentJobFamilyL1 = { id: 0, name: 'Select Job Family*' };
  selectedCurrentJobFamilyL3: any;
  questions: any;
  selectedNextJobFamilyL1: any;
  selectedNextJobFamilyL2: any;
  selectedNextJobFamilyL3: any;
  loadCurrentJobFamilyForDropdown(level: any): void {
    var parentId = 0;
    this.questions = [];
    setTimeout(() => {
      if (level == 1) {
        parentId = 0;
        this.jobFamiliesL1 = [];
        this.jobFamiliesL2 = [];
        this.jobFamiliesL3 = [];
      }
      if (level == 2) {
        parentId = this.selectedCurrentJobFamilyL1?.id;
        this.jobFamiliesL2 = [];
        this.jobFamiliesL3 = [];
      }
      if (level == 3) {
        parentId = this.selectedCurrentJobFamilyL2?.id;
        this.jobFamiliesL3 = [];
      }
      if (level == 4) {
        parentId = this.selectedCurrentJobFamilyL3?.id;
      }
      var url =
        'mainservice/recruitment2/open/loadJobFamily?parentId=' + parentId;
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200 && data['dataArray'] != null) {
          if (data['dataArray'][0].label == 'Question')
            this.questions = data['dataArray'];
          else {
            if (level == 1) {
              this.jobFamiliesL1 = data['dataArray'];
            } else if (level == 2) {
              this.jobFamiliesL2 = data['dataArray'];
            } else if (level == 3) {
              this.jobFamiliesL3 = data['dataArray'];
            }
          }
        }
      });
    }, 500);
  }

  loadNextJobFamilyForDropdown(level: any): void {
    var parentId = 0;
    this.questions = [];
    setTimeout(() => {
      if (level == 1) {
        parentId = 0;
        this.nextJobFamiliesL1 = [];
        this.nextJobFamiliesL2 = [];
        this.nextJobFamiliesL3 = [];
      }
      if (level == 2) {
        parentId = this.selectedNextJobFamilyL1?.id;
        this.nextJobFamiliesL2 = [];
        this.nextJobFamiliesL3 = [];
      }
      if (level == 3) {
        parentId = this.selectedNextJobFamilyL2?.id;
        this.nextJobFamiliesL3 = [];
      }
      if (level == 4) {
        parentId = this.selectedNextJobFamilyL3?.id;
      }
      var url =
        'mainservice/recruitment2/open/loadJobFamily?parentId=' + parentId;
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200 && data['dataArray'] != null) {
          if (data['dataArray'][0].label == 'Question')
            this.questions = data['dataArray'];
          else {
            if (level == 1) {
              this.nextJobFamiliesL1 = data['dataArray'];
            } else if (level == 2) {
              this.nextJobFamiliesL2 = data['dataArray'];
            } else if (level == 3) {
              this.nextJobFamiliesL3 = data['dataArray'];
            }
          }
        }
      });
    }, 500);
  }

  submit(): void {
    if (!this.validate()) {
      return;
    }
    // this.candidate.currentJobFunction = this.selectedCurrentJobFamilyL2.name;
    // this.candidate.nextJobFunction = this.selectedNextJobFamilyL2.name;
    this.candidate.communityId = this.communityId;
    this.candidate.validated = 0;
    this.candidate.discovered = false;
    if (this.userId) this.candidate.createdBy = this.userId;
    else this.candidate.createdBy = -1;
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment/future/openresource/save', this.candidate)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.tempMessage = data['message'];
          this.candidate = data['dataObject'];
          this.uploadCv();
          // Refresh the page on successful submission
        window.location.reload();
          //this.commonService.showErrorMessage("Info",this.message);
        } else {
          this.commonService.showErrorMessage('Error', data['message']);
        }
      });
  }
  tempMessage = '';
  validate(): boolean {
    if (!this.candidate.emailId || this.candidate.emailId.trim().length == 0) {
      this.commonService.showErrorMessage('Info', 'Please enter email id.');
      return false;
    }
    this.candidate.name = this.candidate.name.trim();
    if (!this.candidate.name || this.candidate.name.trim().length == 0) {
      this.commonService.showErrorMessage('Info', 'Please enter name.');
      return false;
    }
    this.candidate.name = this.candidate.name.trim();
    if (!this.candidate.phoneNo || this.candidate.phoneNo.trim().length == 0) {
      this.commonService.showErrorMessage('Info', 'Please enter phone no.');
      return false;
    }
    this.candidate.phoneNo = this.candidate.phoneNo.trim();
    if (
      !this.candidate.linkedInUrl ||
      this.candidate.linkedInUrl.trim().length == 0
    ) {
      this.commonService.showErrorMessage(
        'Info',
        'Please enter your linkedIn profile url.'
      );
      return false;
    }
    this.candidate.linkedInUrl = this.candidate.linkedInUrl.trim();
    if (this.candidate.experience == undefined) {
      this.commonService.showErrorMessage('Info', 'Please enter experience.');
      return false;
    }
    if (!this.candidate.preferredLocation) {
      this.commonService.showErrorMessage(
        'Info',
        'Please enter preferred location.'
      );
      return false;
    }
    if (
      !this.candidate.designation ||
      this.candidate.designation.trim().length == 0
    ) {
      this.commonService.showErrorMessage('Info', 'Please enter designation.');
      return false;
    }
    this.candidate.designation = this.candidate.designation.trim();
    // if (
    //   this.candidate.nextJobFunction &&
    //   this.candidate.nextJobFunction == 'other'
    // ) {
    //   this.candidate.nextJobFunction = this.nextOtherJobFunction;
    // }
    if (!this.selectedNextJobFamilyL2) {
      this.commonService.showErrorMessage(
        'Info',
        'Please enter your preferred job function.'
      );
      return false;
    }
    this.candidate.nextJobFunction = this.selectedNextJobFamilyL2.name;
    // if (
    //   this.candidate.currentJobFunction &&
    //   this.candidate.currentJobFunction == 'other'
    // ) {
    //   this.candidate.currentJobFunction = this.currentOtherJobFunction;
    // }
    if (!this.selectedCurrentJobFamilyL2) {
      this.commonService.showErrorMessage(
        'Info',
        'Please enter current job function.'
      );
      return false;
    }
    this.candidate.currentJobFunction = this.selectedCurrentJobFamilyL2.name;

    if (!this.candidate.emailId || this.candidate.emailId.trim().length == 0) {
      this.commonService.showErrorMessage('Info', 'Please enter the email id.');
      return false;
    }
    this.candidate.sector = this.candidate.sector.trim();
    if (!this.candidate.sector || this.candidate.sector.trim().length == 0) {
      this.commonService.showErrorMessage('Info', 'Please enter sector.');
      return false;
    }
    this.candidate.sector = this.candidate.sector.trim();
    if (
      !this.candidate.reasonToSwitch ||
      this.candidate.reasonToSwitch.trim().length == 0
    ) {
      this.commonService.showErrorMessage(
        'Info',
        'Please enter the driving force/motivation for exploring new opportunities.'
      );
      return false;
    }
    this.candidate.reasonToSwitch = this.candidate.reasonToSwitch.trim();
    if (
      !this.candidate.orgCulture ||
      this.candidate.orgCulture.trim().length == 0
    ) {
      this.commonService.showErrorMessage(
        'Info',
        'Please enter kind of org. culture would you associate yourself with.'
      );
      return false;
    }
    this.candidate.orgCulture = this.candidate.orgCulture.trim();
    if (
      !this.candidate.idealCompany ||
      this.candidate.idealCompany.trim().length == 0
    ) {
      this.commonService.showErrorMessage(
        'Info',
        'Please enter ideal company according to you.'
      );
      return false;
    }
    this.candidate.idealCompany = this.candidate.idealCompany.trim();
    if (
      !this.candidate.expectation ||
      this.candidate.expectation.trim().length == 0
    ) {
      this.commonService.showErrorMessage('Info', 'Please enter expectation.');
      return false;
    }
    this.candidate.expectation = this.candidate.expectation.trim();
    if (
      !this.candidate.workModel ||
      this.candidate.workModel.trim().length == 0
    ) {
      this.commonService.showErrorMessage(
        'Info',
        'Please enter your preferred working mode.'
      );
      return false;
    }
    this.candidate.workModel = this.candidate.workModel.trim();
    if (this.candidate.leadershipProgram == undefined) {
      this.commonService.showErrorMessage(
        'Info',
        'Please mention if you would like to be considered for our Leadership Talent Program.'
      );
      return false;
    }
    if (this.candidate.leadershipProgram == 'true') {
      if (!this.cv) {
        this.commonService.showErrorMessage('Info', 'Please upload cv.');
        return false;
      }
      //        if(!this.candidate.videoLink)
      //        {
      //            this.commonService.showErrorMessage("Info","Please upload introduction video.");
      //            return false;
      //        }
    }
    return true;
  }
  showLtProgramDetails() {
    this.commonService.showImageWindow(
      '',
      'assets/img/ltp.jpeg',
      () => {},
      () => {}
    );
  }
  onFileSelecet(event: any) {
    var errormessage = '';
    this.cv = null;
    if (event.target.files.length == 0) {
      return;
    }
    var file = event.target.files[0];
    if (file.size > 10485760 * 1) {
      //10 x 1 MB limit
      errormessage = 'File size too big. Please choose a file less than 10 MB.';
      this.commonService.showErrorMessage('Info', errormessage);
      var temp: any = document.getElementById('cv');
      temp['value'] = null;
      return;
    }
    this.cv = file;
  }
  cv: any;

  uploadCv(): void {
    const formData: FormData = new FormData();
    formData.append('futureId', this.candidate.id);
    if (this.cv) {
      formData.append('cv', this.cv, this.cv.name);
      this.commonService.showProcessingIcon();
      let headers = new HttpHeaders({
        Accept: 'application/json',
        Authorization: '', //localStorage.getItem("accesstoken").toString()
      });
      let options = { headers: headers };
      this.commonService.showProcessingIcon();
      this.commonService
        .post2(
          'mainservice/recruitment/future/openresource/cv',
          formData,
          options
        )
        .subscribe((data: any) => {
          this.commonService.hideProcessingIcon();
          if (data['result'] === 200) {
            this.message = this.tempMessage;
            this.commonService.goTop();
          } else {
            this.commonService.showErrorMessage(
              'Info',
              'File upload failed. Please try again later.'
            );
          }
        });
    } else {
      this.message = this.tempMessage;
      this.commonService.goTop();
    }
  }
  showFutureCopy = true;
  copyFutureFormLink(): void {
    this.showFutureCopy = false;
    this.clipboard.copy(
      this.commonService.uiPrefix + 'recr/open/future-form/' + this.communityId
    );
    this.commonService.showInfoMessage('Info', 'Copied future form link.');
    setTimeout(() => {
      this.showFutureCopy = true;
    }, 2000);
  }
}
