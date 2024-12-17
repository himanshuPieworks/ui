import { Component } from '@angular/core';
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

  locations: any = [];
  formSubmitted = false;
  years: any = [];
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService,
    private clipboard: Clipboard,
    private httpClient: HttpClient
  ) {
    this.httpClient.get('assets/json/cities.json').subscribe((data: any) => {
      this.locations = data.cities;
    });
    this.httpClient.get('assets/json/year.json').subscribe((data: any) => {
      this.years = data.years;
    });
  }
  userType: any;
  referralCode:any;
  ngOnInit(): void {
    if (window.location.href.indexOf('open') != -1) this.userType = 'talent';
    else this.userType = 'communitymember';
    this.communityId = this.route.snapshot.paramMap.get('communityId');
    if (!this.communityId)
      this.communityId = localStorage.getItem('communityId');
    if (!this.communityId) this.communityId = '2';
    this.userId = localStorage.getItem('userId');
    this.commonService.hideProcessingIcon();

    
    this.referralCode = this.commonService.getParameterFromUrl('referalCode')

    this.loadJobFamilyForDropdown(1);
    this.loadAvailableSectors();
  }

  isDragging = false;
  selectedFile: File | null = null;

  // Handle drag over event
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  // Handle drag leave event
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  // Handle file drop event
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
      console.log('File dropped:', this.selectedFile);
    }
  }
  file: any;
  cvToUpload: any;
  // Handle file input change event (for file browsing)
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];

      if (this.selectedFile.size > 10485760 * 5) {
        //10 MB limit
        this.message =
          'File size too big. Please choose a file less than 10mb.';
        this.commonService.showErrorMessage('Error', this.message);
        return;
      }
      this.cvUpload();
      console.log('File selected:', this.selectedFile);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    console.log('File removed');
  }

  cvFileLocation: any;
  cvParsedResult: any = {};
  searchMessage: any = '';
  searchText: any = '';

  cvUpload(): void {
    const formData: FormData = new FormData();
    if (this.selectedFile && this.selectedFile !== null) {
      var fileName = this.selectedFile.name;
      fileName = this.commonService.removeSpecialChar(fileName, '-.', '-');
      formData.append('cv', this.selectedFile, fileName);
    }
    formData.append('id', 'temp');

    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: '',
    });
    let options = { headers: headers };
    this.commonService.showProcessingIcon();
    this.commonService
      .post2(
        'mainservice/recruitment2/open/extractDataFromCv',
        formData,
        options
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.cvFileLocation = data['message'];
          this.candidate.emailId = data['dataObject'].emailId;
          this.candidate.phoneNo = data['dataObject'].phoneNo;
          this.candidate.linkedInUrl = data['dataObject'].linkedInUrl;

          if (
            this.candidate.emailId &&
            (this.candidate.emailId.endsWith('.') ||
              this.candidate.emailId.endsWith(','))
          )
            this.candidate.emailId = this.candidate.emailId.substring(
              0,
              this.candidate.emailId.length - 1
            );
          if (
            this.candidate.phoneNo &&
            (this.candidate.phoneNo.endsWith('.') ||
              this.candidate.phoneNo.endsWith(','))
          )
            this.candidate.phoneNo = this.candidate.phoneNo.substring(
              0,
              this.candidate.phoneNo.length - 1
            );
          if (
            this.candidate.linkedInUrl &&
            (this.candidate.linkedInUrl.endsWith('.') ||
              this.candidate.linkedInUrl.endsWith(','))
          )
            this.candidate.linkedInUrl = this.candidate.linkedInUrl.substring(
              0,
              this.candidate.linkedInUrl.length - 1
            );

          this.cvParsedResult = data['dataObject'];
          this.searchText = this.candidate.emailId;
          this.searchMessage = 'CV parsing finished.';
          if (this.searchText && this.searchText.length > 2)
            this.getCandidateByEmailId(false, true, 0);
        }
      });
  }

  urlPrefix: any = '';

  newSector: any = '';
  reqHandle: any;
  candidates: any = [];

  getCandidateByEmailId(
    forSearch: any,
    cvParsingOngoing: any,
    index: any
  ): void {
    if (index == 1) {
      if (!this.candidate?.phoneNo || this.candidate?.phoneNo?.length == 0)
        return;
      this.searchText = this.candidate.phoneNo;
    }
    if (!this.searchText) return;
    var url =
      'mainservice/recruitment2/open/candidates/' +
      2 +
      '?pageNum=1&pageSize=' +
      1;
    url =
      url +
      '&searchText=' +
      this.searchText.trim().toLowerCase() +
      '&minExperience=&maxExperience=&expectedCtc=&emailId=';
    if (this.reqHandle) {
      this.reqHandle.unsubscribe();
    }
    this.commonService.showProcessingIcon();
    this.reqHandle = this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      this.candidates = [];
      if (data['result'] === 200) {
        this.candidates = data['dataArray'];
        if (this.candidates.length > 0) {
          this.commonService.showErrorMessage(
            'Duplicate !!',
            'Candidate already exist in our DB '
          );

          this.candidate = {};
          this.selectedFile = null;
        }
      }
    });
  }

  // Programmatically trigger the hidden file input
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  //

  candidate: any = {};
  otherJobFunction: any;
  currentOtherJobFunction: any;
  nextOtherJobFunction: any;
  message: any = '';
  communityId: any = '-1';
  userId: any;

  gender: any = ['Male', 'Female', 'Other'];
  socialMediaPlatforms: any = [
    'Facebook',
    'Instagram',
    'Twitter (now X)',
    'LinkedIn',
    'Pinterest',
    'Snapchat',
    'TikTok',
    'Reddit',
    'YouTube',
    'WhatsApp',
    'WeChat',
    'Telegram',
    'Discord',
    'Tumblr',
    'Quora',
    'Clubhouse',
    'Signal',
    'Viber',
    'Medium',
    'Twitch',
    'Slack',
    'Nextdoor',
    'VK',
    'Referral Traffic',
    'Email',
    'SMS',
    'Blogging Platforms',
    'Podcasting Platforms',
    'Other',
  ];
  sectors: any = [];

  validateForm(): boolean {
    return (
      this.candidate.name &&
      this.candidate.linkedInUrl &&
      this.candidate.emailId &&
      this.candidate.phoneNo &&
      this.candidate.experience !== null &&
      this.candidate.noticePeriod !== null &&
      this.candidate.currentCtcFixed !== null &&
      this.candidate.expectedCtc !== null &&
      this.candidate.currentLocation &&
      this.candidate.currentCompany &&
      this.candidate.preferredLocation &&
      this.selectedJobFamilyL1 &&
      this.selectedJobFamilyL2 &&
      this.newSector
    );
  }
  saveCandidate() {
    if (this.validateForm()) {
      // Save the candidate data
      if(this.referralCode)
        this.candidate.referralCode = this.referralCode;

      this.candidate.communityId = 2;
      this.commonService
        .post('mainservice/recruitment2/candidate/open', this.candidate)
        .subscribe((data: any) => {
          this.commonService.hideProcessingIcon();
          if (data['result'] === 200) {
            this.candidate = data['dataObject'];

            this.updateSectors(this.candidate);
            this.uploadFile(data['dataObject']);

            this.formSubmitted = true;

            this.commonService.sendNotification(
              3,
              "New future form uploaded "+ this.candidate.name,
              '/recr/discoveryDetails/-1/this.candidate.id',
              'COMMUNITY MEMBER',
              1,
              1
            )
          } else {
            this.message = data['message'];
          }
        });
    } else {
      // Show an error message or alert the user
      this.commonService.showErrorMessage(
        'Empty !!',
        'Please fill in all the required fields.'
      );
    }
  }
  updateSectors(obj: any): void {
    //not in use now
    for (var i = 0; i < this.sectors.length; i++) {
      this.sectors[i]['recruitmentCandidate'] = obj;
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment2/open/sector', this.sectors)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
      });
  }
  uploadFile(obj: any) {
    if (this.selectedFile && this.selectedFile !== null) {
      const formData: FormData = new FormData();

      if (this.selectedFile && this.selectedFile !== null) {
        var fileName = this.commonService.removeSpecialChar(
          'pieworks-' +
            this.candidate.name +
            '.' +
            this.selectedFile.name.split('.')[1],
          '-.',
          '-'
        );
        formData.append('cv', this.selectedFile, fileName);
      }
      formData.append('id', obj['id']);

      let headers = new HttpHeaders({
        Accept: 'application/json',
        Authorization: '',
      });
      let options = { headers: headers };
      this.commonService.showProcessingIcon();
      this.commonService
        .post2(
          'mainservice/recruitment2/open/candidateFiles',
          formData,
          options
        )
        .subscribe((data: any) => {
          this.commonService.hideProcessingIcon();
          this.message = data['message'];

          this.selectedFile = null;
        });
    } else {
    }
  }

  resetForm(): void {
    // Reset the form fields and show the form again
    this.candidate = {
      name: '',
      linkedInUrl: '',
      emailId: '',
      phoneNo: '',
      experience: null,
      gender: '',
      noticePeriod: null,
      currentCtcFixed: null,
      expectedCtc: null,
      currentLocation: '',
      currentCompany: '',
      source: '',
      preferredLocation: '',
    };
    this.jobFamiliesL1 = [];
    this.jobFamiliesL2 = [];
    this.selectedJobFamilyL1 = '';
    this.selectedJobFamilyL2 = '';
    this.otherJobFamilyL1 = '';
    this.otherJobFamilyL2 = '';
    this.otherJobFamily = false;
    this.availableSectors = [];
    this.formSubmitted = false;
    this.newSector = '';
    this.selectedFile = null;
  }

  jobFamiliesL1: any = [];
  jobFamiliesL2: any = [];
  jobFamiliesL3: any = [];
  questions: any = [];
  selectedJobFamilyL3: any;
  selectedJobFamilyL2: any;
  selectedJobFamilyL1: any;
  otherJobFamilyL1: any;
  otherJobFamilyL2: any;
  otherJobFamily = false;
  otherJobFamilyChange() {
    this.otherJobFamily = true;
    console.log(this.otherJobFamily);
  }
  loadJobFamilyForDropdown(level: any): void {
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
        parentId = this.selectedJobFamilyL1?.id;
        this.jobFamiliesL2 = [];
        this.jobFamiliesL3 = [];
      }
      if (level == 3) {
        parentId = this.selectedJobFamilyL2?.id;
        this.jobFamiliesL3 = [];
      }
      if (level == 4) {
        parentId = this.selectedJobFamilyL3?.id;
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

  checkJobFamilyName: any;
  checkNewJobFamilyName(l1l2: any): void {
    let url =
      'mainservice/framework2/open/forward?api=recruitmentservice/requirement/checkJobFamilyByName?name=' +
      this.otherJobFamilyL1;
    if (l1l2 == 'l2')
      url =
        'mainservice/framework2/open/forward?api=recruitmentservice/requirement/checkJobFamilyByName?name=' +
        this.otherJobFamilyL2;
    this.commonService.get(url).subscribe((data: any) => {
      this.checkJobFamilyName = data['dataObject'];
      if (this.checkJobFamilyName) {
        this.commonService.showErrorMessage('Error', data['message']);
        if (l1l2 == 'l1') this.otherJobFamilyL1 = undefined;
        else this.otherJobFamilyL2 = undefined;
      }
    });
  }

  availableSectors: any = [];

  loadAvailableSectors(): void {
    this.availableSectors = [];
    var url = 'mainservice/recruitment2/open/availableSectors?searchText=';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200 && data['dataArray'] != null) {
        this.availableSectors = data['dataArray'];
      }
    });
  }


 


  
}