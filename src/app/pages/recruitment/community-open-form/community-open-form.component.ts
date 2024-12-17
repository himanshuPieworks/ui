import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-community-open-form',
  templateUrl: './community-open-form.component.html',
  styleUrls: ['./community-open-form.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ transform: 'translateY(100%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class CommunityOpenFormComponent {
  form: FormGroup;
  currentStep = 1;
  reviewFields: any[] = [];

  breadCrumbItems = [
    { label: 'Home', link: '/', active: false },
    { label: 'Manage', link: '/recr/manage', active: false },
    { label: 'Future form', link: '/recr/future-form', active: true },
  ];
  reqId: any;
  requirement: any;
  locations: any = [];
  formSubmitted = false;
  years: any = [];
  justification: any;
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      emailId: ['', [Validators.required, Validators.email]],
      linkedInUrl: [
        '',
        [Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/)],
      ],
      currentCompany: [''],
      currentLocation: ['', Validators.required],
      expectedCtc: ['', Validators.required],
      currentCtcFixed: ['', Validators.required],
      noticePeriod: ['', Validators.required],
      experience: ['', Validators.required],
      jobFitment: ['', Validators.required],
      sector: ['', Validators.required],
    });

    this.referralCode = this.route.snapshot.paramMap.get('referralId');

    this.httpClient.get('assets/json/cities.json').subscribe((data: any) => {
      this.locations = data.cities;
    });
    this.httpClient.get('assets/json/year.json').subscribe((data: any) => {
      this.years = data.years;
    });

    this.reqId = this.route.snapshot.paramMap.get('reqId');

    this.loadRequirementDetails();
  }

  userType: any;
  referralCode: any;
  ngOnInit(): void {
    if (window.location.href.indexOf('open') != -1) this.userType = 'talent';
    else this.userType = 'communitymember';
    this.communityId = this.route.snapshot.paramMap.get('communityId');
    if (!this.communityId)
      this.communityId = localStorage.getItem('communityId');
    if (!this.communityId) this.communityId = '2';
    this.userId = localStorage.getItem('userId');
    this.commonService.hideProcessingIcon();

    this.loadJobFamilyForDropdown(1);
    this.loadAvailableSectors();
  }

  loadRequirementDetails(): void {
    var url = 'mainservice/recruitment/open/requirement/' + this.reqId;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.requirement = data['dataObject'];
        console.log('This is open Requirement : ', this.requirement);
      }
    });
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

          // Set the form controls with the parsed data
          this.form.patchValue({
            emailId: this.candidate.emailId,
            phoneNo: this.candidate.phoneNo,
            linkedInUrl: this.candidate.linkedInUrl,
          });
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
    // Save the candidate data
    // if (this.referralCode) this.candidate.referralCode = this.referralCode;

    const formData = {
      ...this.form.value,
      referralCode: this.referralCode,
      communityId: 2,
    };

    this.justification = formData.jobFitment;

    delete formData.jobFitment;
    // this.candidate.communityId = 2;
    this.commonService
      .post('mainservice/recruitment2/candidate/open', formData)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.candidate = data['dataObject'];

          this.updateSectors(this.candidate);
          this.uploadFile(data['dataObject']);

          this.saveShortlisting();
        } else {
          this.message = data['message'];
        }
      });
  }

  shortlist: any;
  saveShortlisting() {
    var shortlist: any = {};
    shortlist.status = { id: 1, name: '2call' };
    shortlist.requirement = this.requirement;
    shortlist.candidate = this.candidate;
    shortlist.noticePeriod = this.candidate.noticePeriod;
    this.message = 'Saving...';
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment/shortlisting/open/shortlist', shortlist)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.message = data['message'];
        if (data['result'] == 200) {
          this.shortlist = data['dataObject'];

          this.formSubmitted = true;

          this.saveJustification();
        }
      });
  }
  reloadPage() {
    window.location.reload();
  }
  getTwoDigit(number: any) {
    if (number.toString().length == 1) return '0' + number;
    else return number;
  }
  saveJustification() {
    var today = new Date();
    var justifications: any = [];
    justifications.push({
      recruitmentShortlisting: this.shortlist,
      justification: this.justification ? this.justification.trim() : ' ',
      date:
        today.getFullYear() +
        '-' +
        this.getTwoDigit(today.getMonth() + 1) +
        '-' +
        this.getTwoDigit(today.getDate()),
    });

    this.commonService
      .post(
        'mainservice/recruitment/shortlisting/open/justification',
        justifications
      )
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.commonService.sendNotification(
            this.shortlist.createdBy.id,
            '',
            'recr/discoveryDetails/' +
              this.shortlist.requirement.id +
              '/' +
              this.shortlist.id,
            'COMMUNITY MEMBER',
            1,
            1,
            1
          );
        }
      });
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
  isStep1Valid(): boolean {
    return (
      (this.form.get('name')?.valid ?? false) &&
      (this.form.get('phoneNo')?.valid ?? false) &&
      (this.form.get('emailId')?.valid ?? false) &&
      (this.form.get('linkedInUrl')?.valid ?? false) &&
      (this.form.get('currentLocation')?.valid ?? false) &&
      !!this.selectedFile
    );
  }

  isStep2Valid(): boolean {
    return (
      (this.form.get('expectedCtc')?.valid ?? false) &&
      (this.form.get('currentCtcFixed')?.valid ?? false) &&
      (this.form.get('noticePeriod')?.valid ?? false) &&
      (this.form.get('experience')?.valid ?? false) &&
      (this.form.get('jobFitment')?.valid ?? false) &&
      (this.form.get('sector')?.valid ?? false)
    );
  }
  next() {
    if (this.currentStep === 1) {
      // Validate fields in Step 1
      if (this.isStep1Valid()) {
        this.currentStep++;
      } else {
        // Mark fields as touched to show validation errors
        this.form.get('name')?.markAsTouched();
        this.form.get('phoneNo')?.markAsTouched();
        this.form.get('emailId')?.markAsTouched();
        this.form.get('linkedInUrl')?.markAsTouched();
        this.form.get('currentLocation')?.markAsTouched();
      }
    } else if (this.currentStep === 2) {
      // Validate fields in Step 2
      if (this.isStep2Valid()) {
        this.currentStep++;
        if (this.form.valid) {
          this.reviewFields = Object.keys(this.form.controls).map((key) => ({
            label: key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase()),
            value: this.form.value[key],
          }));
          console.log('This is form Value: ', this.form.value);
        }
      } else {
        // Mark fields as touched to show validation errors
        this.form.get('expectedCtc')?.markAsTouched();
        this.form.get('currentCtcFixed')?.markAsTouched();
        this.form.get('noticePeriod')?.markAsTouched();
        this.form.get('experience')?.markAsTouched();
        this.form.get('jobFitment')?.markAsTouched();
        this.form.get('sector')?.markAsTouched();
      }
    }
  }

  previous() {
    this.currentStep--;
  }

  onSubmit() {
    if (this.form.valid) {
      this.saveCandidate();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
