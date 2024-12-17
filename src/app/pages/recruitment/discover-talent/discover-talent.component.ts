import { HttpHeaders } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discover-talent',
  templateUrl: './discover-talent.component.html',
  styleUrls: ['./discover-talent.component.scss'],
})
export class DiscoverTalentComponent implements OnInit {
  @Input('reqId') reqId: any;
  @Input('parentObj') parentObj: any;
  @ViewChild('cdkStepper') cdkStepper: any;
  @Output() closeEvent = new EventEmitter<void>();

  closeModal() {
    this.closeEvent.emit();
  }
  source: any = 'mandate'; //mandate,quick-discover,quick-nurture
  candidateEmail: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService,
    private sanitizer: DomSanitizer
  ) {
    // this.reqId = this.route.snapshot.paramMap.get('reqId');
    this.resetValueSets();
    this.reqUrl =
      '/community/' +
      localStorage.getItem('communityId') +
      '/domain/recruitment/requirements/' +
      this.reqId;
    this.loadAvaialbleSectors();
    this.loadSectors();
    if (this.reqId) {
      this.loadRequirementDetails();
      this.loadCommunityMembers();
      this.loadStatus();
    }
    if (this.commonService.getParameterFromUrl('searchText') != null) {
      this.searchText = this.commonService.getParameterFromUrl('searchText');
      this.getCandidateByEmailId(true, false, 0);
    }
  }
  status: any = [];
  reqUrl: any = '';
  resetValueSets(): void {
    this.valueSets = [
      {
        question: 'How s/he deliver ? *',
        values: [
          { value: 'Customer Focused', selected: false },
          { value: 'Result Focused', selected: false },
          { value: 'Relationship Focused', selected: false },
          { value: 'Teamwork', selected: false },
          { value: 'Patiently', selected: false },
          { value: 'Resolutely', selected: false },
          { value: 'Research based', selected: false },
        ],
      },
      {
        question: 'How s/he treat each other ? *',
        values: [
          { value: 'Empathy', selected: false },
          { value: 'Unbiased', selected: false },
          { value: 'Inclusivity', selected: false },
          { value: 'Equality', selected: false },
          { value: 'Nonhierarchical', selected: false },
          { value: 'Flexibly', selected: false },
          { value: 'Openness', selected: false },
        ],
      },
      {
        question: 'How s/he identify himself ? *',
        values: [
          { value: 'Fun', selected: false },
          { value: 'Creative', selected: false },
          { value: 'Freethinkers', selected: false },
          { value: 'Meritocratic', selected: false },
          { value: 'Diverse', selected: false },
          { value: 'Dependable', selected: false },
          { value: 'Ethical', selected: false },
        ],
      },
    ];
  }
  valueSets: any = [];
  mandates: any = [];

  loadMandates(): void {
    var url =
      'mainservice/recruitment/requirements/' +
      localStorage.getItem('communityId') +
      '?clientAnchorIds=-1&pageNum=1&pageSize=10000&statusId=2,3,8,9,10&creationMonth=&searchText=' +
      this.mandateSearch +
      '&onlyWithFeeds=false&client=&minLpa=0&maxLpa=200&havingPendingPositions=na&havingClosedPositions=na&includeOfferedCandidates=true';
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.mandates = data['dataArray'];
      }
    });
  }
  onMandateSelect(): void {
    setTimeout(() => {
      this.reqId = this.requirement.id;
      this.loadStatus();
      if (this.searchText && this.searchText.length > 2)
        this.getCandidateByEmailId(false, true, 0);
    }, 500);
  }

  loadStatus(): void {
    this.status = [];
    this.status.push({ id: 1, name: 'To Call', displayOrder: 1 });
    this.status.push({ id: 2, name: 'Interested', displayOrder: 1 });
  }
  completedStep1: boolean = false;
  completedStep2: boolean = false;
  completedStep3: boolean = false;
  completedStep4: boolean = false;

  validate1Completion(): void {
    if (
     
      this.candidate.name &&
      this.candidate.emailId &&
      this.candidate.phoneNo &&
      this.candidate.currentLocation &&
      (!this.requirement?.linkedInMandatory || this.candidate.linkedInUrl)
    ) {
      if (this.source == 'quick-nurture') this.completedStep1 = true;
      else if (
        (this.source == 'mandate' || this.source == 'quick-discover') &&
        this.requirement
      )
        this.completedStep1 = true;
      else this.completedStep1 = false;
    } else {
      this.completedStep1 = false;
    }
  }
  validate2Completion(): void {
    this.completedStep2 = true;
  }
  validate3Completion(): void {
    if (
      this.candidate.expectedCtc != undefined &&
      (this.noticePeriod || !this.requirement)
    ) {
      this.completedStep3 = true;
    }
  }

  validate4Completion(): void {
    if (this.candidate.experience != undefined && this.justification1) {
      this.completedStep4 = true;
    }
  }

  requirement: any;
  candidate: any = {};
  experiences: any = [];
  educations: any = [];
  sectors: any = [];
  candidateId: any;
  ngOnInit(): void {
    this.candidate.image = 'assets/img/home-1/profile/1.jpg';
  }
  loadAllDetails(reqId: any): void {
    this.reqId = reqId;
    if (this.reqId && this.reqId > 0) {
      this.loadRequirementDetails();
    }
    this.loadStatus();
  }
  disableButton = false;
  loadRequirementDetails(): void {
    var url = 'mainservice/recruitment/requirement/' + this.reqId;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.requirement = data['dataObject'];
        if (
          this.requirement.status.id != 2 &&
          this.requirement.status.id != 3
        ) {
          this.disableButton = true;
          this.commonService.showErrorMessage(
            'Error',
            'New discovery is possible only on Open or Open Hot mandates.'
          );
        }
      }
    });
  }
  loadExperiences(): void {
    var url =
      'mainservice/recruitment2/candidate/' + this.candidateId + '/experience';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200 && data['dataArray'] != null) {
        this.experiences = data['dataArray'];
      }
    });
  }
  loadEducation(): void {
    var url =
      'mainservice/recruitment2/candidate/' + this.candidateId + '/education';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200 && data['dataArray'] != null) {
        this.educations = data['dataArray'];
      }
    });
  }
  loadSectors(): void {
    if (!this.candidateId) return;
    var url =
      'mainservice/recruitment2/candidate/' + this.candidateId + '/sector';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200 && data['dataArray'] != null) {
        this.sectors = data['dataArray'];
      }
    });
  }
  noticePeriod: any;
  currentEsopPlan: any;
  selectedStatus: any;
  // shortListCandidate(): void {
  //   this.message = '';
  //   var shortlist: any = {};
  //   if (!this.requirement || !this.requirement.id) {
  //     this.message = 'Please select the requirement.';
  //     return;
  //   }
  //   shortlist.status = this.selectedStatus;
  //   shortlist.requirement = this.requirement;
  //   shortlist.candidate = this.candidate;
  //   shortlist.noticePeriod = this.noticePeriod;
  //   shortlist.currentEsopPlan = this.currentEsopPlan;
  //   this.message = 'Saving...';
  //   this.commonService.showProcessingIcon();
  //   this.commonService
  //     .post('mainservice/recruitment/shortlisting/shortlist', shortlist)
  //     .subscribe((data: any) => {
  //       this.commonService.hideProcessingIcon();
  //       this.message = data['message'];
  //       if (data['result'] == 200) {
  //         if (
  //           this.requirement &&
  //           this.requirement.clientAnchor &&
  //           this.requirement.clientAnchor.id != this.commonService.user.id
  //         ) {
  //           var link =
  //             'recr/discoveryDetails/' +
  //             this.requirement.id +
  //             '/' +
  //             data['dataObject'].id;
  //           var anchorMember = this.getMemberFromUserId(
  //             this.requirement.clientAnchor.id
  //           );

  //           //            if (
  //           //              anchorMember &&
  //           //              anchorMember.acceptanceByAce === 1 &&
  //           //              anchorMember.acceptanceByAceMaker === 1
  //           //            )
  //           this.commonService.sendNotification(
  //             this.requirement.clientAnchor.id,
  //             localStorage.getItem('usersname') +
  //               ' has discovered a candidate ' +
  //               shortlist.candidate.name +
  //               ' for the role ' +
  //               shortlist.requirement.role.name +
  //               ' for ' +
  //               shortlist.requirement.client.name +
  //               '.',
  //             link,
  //             'COMMUNITY MEMBER',
  //             1,
  //             1
  //           );
  //         }
  //         if (
  //           this.requirement &&
  //           this.requirement.standbyClientAnchor &&
  //           this.requirement.standbyClientAnchor.id !=
  //             this.commonService.user.id
  //         ) {
  //           var link =
  //             'recr/discoveryDetails/' +
  //             this.requirement.id +
  //             '/' +
  //             data['dataObject'].id;
  //           var standbyClientAnchor = this.getMemberFromUserId(
  //             this.requirement.standbyClientAnchor.id
  //           );

  //           if (
  //             standbyClientAnchor &&
  //             standbyClientAnchor.acceptanceByAce === 1 &&
  //             standbyClientAnchor.acceptanceByAceMaker === 1
  //           )
  //             this.commonService.sendNotification(
  //               this.requirement.standbyClientAnchor.id,
  //               localStorage.getItem('usersname') +
  //                 ' has discovered a candidate ' +
  //                 shortlist.candidate.name +
  //                 ' for the role ' +
  //                 shortlist.requirement.role.name +
  //                 ' for ' +
  //                 shortlist.requirement.client.name +
  //                 '.',
  //               link,
  //               'COMMUNITY MEMBER',
  //               1,
  //               1
  //             );
  //         }
  //         this.updateJustificiations(data['dataObject']);
  //       }
  //     });
  // }
  shortListCandidate(): void {
    this.message = '';
    let prevCards: number | undefined = undefined;
    if (this.candidate && this.candidate.createdBy) {
      prevCards = this.candidate.createdBy.scratchCards; // Store existing scratchCards count
    }
  
    const shortlist: any = {};
    if (!this.requirement || !this.requirement.id) {
      this.message = 'Please select the requirement.';
      return;
    }
  
    shortlist.status = this.selectedStatus;
    shortlist.requirement = this.requirement;
    shortlist.candidate = this.candidate;
    shortlist.noticePeriod = this.noticePeriod;
    shortlist.currentEsopPlan = this.currentEsopPlan;
  
    this.message = 'Saving...';
    this.commonService.showProcessingIcon();
  
    this.commonService
      .post('mainservice/recruitment/shortlisting/shortlist', shortlist)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.message = data['message'];
  
        if (data['result'] === 200) {
          const returnedShortlist = data['dataObject'];
  
          // Check if scratchCards count has increased
          if (
            prevCards !== undefined &&
            returnedShortlist.createdBy.scratchCards !== undefined &&
            prevCards < returnedShortlist.createdBy.scratchCards
          ) {
            Swal.fire({
              title: 'Congratulations!',
              text: 'You have won a scratch card!',
              icon: 'success',
              showCancelButton: true,
              confirmButtonText: 'Open',
              cancelButtonText: 'Close',
            }).then((result) => {
              if (result.isConfirmed) {
                // Navigate to the rewards page on Open button click
                this.router.navigate(['/recr/rewards']);
              }
            });
          }
  
          if (
            this.requirement &&
            this.requirement.clientAnchor &&
            this.requirement.clientAnchor.id !== this.commonService.user.id
          ) {
            const link =
              'recr/discoveryDetails/' +
              this.requirement.id +
              '/' +
              returnedShortlist.id;
            const anchorMember = this.getMemberFromUserId(
              this.requirement.clientAnchor.id
            );
  
            this.commonService.sendNotification(
              this.requirement.clientAnchor.id,
              localStorage.getItem('usersname') +
                ' has discovered a candidate ' +
                shortlist.candidate.name +
                ' for the role ' +
                shortlist.requirement.role.name +
                ' for ' +
                shortlist.requirement.client.name +
                '.',
              link,
              'COMMUNITY MEMBER',
              1,
              1
            );
          }
  
          if (
            this.requirement &&
            this.requirement.standbyClientAnchor &&
            this.requirement.standbyClientAnchor.id !==
              this.commonService.user.id
          ) {
            const link =
              'recr/discoveryDetails/' +
              this.requirement.id +
              '/' +
              returnedShortlist.id;
            const standbyClientAnchor = this.getMemberFromUserId(
              this.requirement.standbyClientAnchor.id
            );
  
            if (
              standbyClientAnchor &&
              standbyClientAnchor.acceptanceByAce === 1 &&
              standbyClientAnchor.acceptanceByAceMaker === 1
            ) {
              this.commonService.sendNotification(
                this.requirement.standbyClientAnchor.id,
                localStorage.getItem('usersname') +
                  ' has discovered a candidate ' +
                  shortlist.candidate.name +
                  ' for the role ' +
                  shortlist.requirement.role.name +
                  ' for ' +
                  shortlist.requirement.client.name +
                  '.',
                link,
                'COMMUNITY MEMBER',
                1,
                1
              );
            }
          }
  
          this.updateJustificiations(returnedShortlist);
        }
      });
  }
  
  getMemberFromUserId(userId: any): any {
    for (var i = 0; i < this.members.length; i++) {
      if (this.members[i].user.id == userId) return this.members[i];
    }
    return undefined;
  }

  urlPrefix: any = '';

  newSector: any = '';
  reqHandle: any;
  candidates: any = [];
  searchMessage: any = '';
  searchText: any = '';

  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  emailPattern1: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  // emailValidator(control: AbstractControl): ValidationErrors | null {
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   const valid = emailRegex.test(control.value);
  //   return valid ? null : { invalidEmail: true };
  // }

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
      'mainservice/recruitment2/candidates/' +
      localStorage.getItem('communityId') +
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
        if (
          this.candidates.length > 0 &&
          (this.candidates[0].emailId ===
            this.searchText.trim().toLowerCase() ||
            this.candidates[0].phoneNo == this.searchText ||
            this.candidates[0].name == this.searchText)
        ) {
          this.candidate = this.candidates[0];
          this.searchMessage = 'Candidate found ' + this.candidate.name;
          if (!this.candidate.image || this.candidate.image.length < 2) {
            this.candidate.image = 'assets/img/home-1/profile/1.jpg';
            this.urlPrefix = '';
          } else {
            this.urlPrefix = this.commonService.urlPrefix;
          }
          this.imgPreview = this.urlPrefix + this.candidate.image;
          this.candidateId = this.candidate.id;
          this.loadExperiences();
          this.loadEducation();
          this.loadSectors();
        } else {
          if (forSearch) {
            this.candidate = {};
            this.candidate.image = 'assets/img/home-1/profile/1.jpg';
            this.imgPreview = undefined;
            this.searchMessage = 'No candidate found.';
          }
        }
        if (cvParsingOngoing) {
          if (this.cvParsedResult.emailId)
            this.candidate.emailId = this.cvParsedResult.emailId;
          if (this.cvParsedResult.phoneNo)
            this.candidate.phoneNo = this.cvParsedResult.phoneNo;
          if (this.cvParsedResult.linkedInUrl)
            this.candidate.linkedInUrl = this.cvParsedResult.linkedInUrl;
        }

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

        if (this.reqId) this.checkIfAlreadyShortlisted();
        if (
          !(
            this.candidates.length > 0 &&
            (this.candidates[0].emailId ===
              this.searchText.trim().toLowerCase() ||
              this.candidates[0].phoneNo == this.searchText ||
              this.candidates[0].name == this.searchText)
          )
        ) {
          if (index == 0)
            this.getCandidateByEmailId(forSearch, cvParsingOngoing, 1);
        }
        this.validate1Completion();
        this.validate4Completion();
        this.validate2Completion();
        this.validate3Completion();
      }
    });
  }
  addSector(): void {
    if (this.newSector == 'Select' || this.newSector.trim() == '') return;
    this.sectors.push({ name: this.newSector });
    this.newSector = '';
  }
  availableSectors: any;
  loadAvaialbleSectors(): void {
    this.availableSectors = [];
    var url =
      'mainservice/recruitment2/open/availableSectors?searchText=' +
      this.newSector;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200 && data['dataArray'] != null) {
        this.availableSectors = data['dataArray'];
      }
    });
  }
  experience: any = {};
  addExperience(): void {
    if (
      !this.experience.designation ||
      this.experience.designation.trim().length == 0
    )
      return;
    if (!this.experience.company || this.experience.company.trim().length == 0)
      return;
    if (!this.experience.fromYear || this.experience.fromYear < 1985) return;
    if (!this.experience.toYear || this.experience.toYear < 1985) return;
    if (this.experience.toYear < this.experience.fromYear) return;
    this.experiences.push(this.experience);
    this.experience = {
      designation: '',
      company: '',
      fromYear: '',
      toYear: '',
    };
  }
  education: any = {};
  addEducation(): void {
    if (!this.education.course || this.education.course.trim().length == 0)
      return;
    if (
      !this.education.institution ||
      this.education.institution.trim().length == 0
    )
      return;
    if (!this.education.year || this.education.year < 1985) return;
    this.educations.push(this.education);
    this.education = { course: '', institution: '', year: '' };
  }
  removeExperience(obj: any): void {
    for (var i = 0; i < this.experiences.length; i++) {
      if (this.experiences[i] === obj) {
        this.experiences.splice(i, 1);
      }
    }
  }
  removeEducation(obj: any): void {
    for (var i = 0; i < this.educations.length; i++) {
      if (this.educations[i] === obj) {
        this.educations.splice(i, 1);
      }
    }
  }
  removeSector(obj: any): void {
    for (var i = 0; i < this.sectors.length; i++) {
      if (this.sectors[i] === obj) {
        this.sectors.splice(i, 1);
      }
    }
  }
  message = '';
  hideExtraDetails = true;
  uploadForm: FormGroup = new FormGroup({});
  fileToUpload: File | null = null;
  saveType = 1;
  updateCandidate(type: any): void {
    this.saveType = type;
    if (
      !this.selectedValueSet1 ||
      !this.selectedValueSet2 ||
      !this.selectedValueSet3
    ) {
      this.commonService.showErrorMessage(
        'Error',
        'Please select the culture values.'
      );
      return;
    }
    if (
      (this.source == 'quick-discover' || this.source == 'mandate') &&
      this.reqId &&
      this.requirement.status &&
      this.requirement.status.id != 2 &&
      this.requirement.status.id != 3
    ) {
      this.message =
        'The requirement is in status ' +
        this.requirement.status.name +
        '. Discovery not allowed.';
      return;
    }
    if (
      this.requirement &&
      this.requirement.linkedInMandatory &&
      (!this.candidate.linkedInUrl ||
        this.candidate.linkedInUrl.trim().length == 0)
    ) {
      this.message = 'Please enter the linkedin profile url of the candidate.';
      return;
    }
    this.addSector();
    this.candidate['communityId'] = localStorage.getItem('communityId');
    if (
      this.candidate['communityId'] == undefined ||
      this.candidate['communityId'] == null
    ) {
      this.message = 'Network error. Please refresh the page and try again.';
      //this.communityId = this.route.snapshot.paramMap.get('communityId');
      return;
    }
    if (
      !this.candidate['name'] ||
      this.candidate['name'].toString().trim() == ''
    ) {
      this.message = 'Please enter the name of the candidate';
      return;
    }
    if (
      !this.candidate['emailId'] ||
      this.candidate['emailId'].toString().trim() == '' ||
      this.candidate['emailId'].toString().indexOf('@') == -1
    ) {
      this.message = 'Please enter a valid email id';
      return;
    }
    if (this.experience.designation && this.experience.designation.length > 0) {
      this.message =
        'Looks like you have forgot to add the experience. Please click on the add button.';
      return;
    }
    if (this.education.course && this.education.course.length > 0) {
      this.message =
        'Looks like you have forgot to add the qualification. Please click on the add button.';
      return;
    }
    if (
      !this.candidate['currentLocation'] ||
      this.candidate['currentLocation'].toString().trim() == ''
    ) {
      this.message = 'Please enter location of the candidate';
      return;
    }
    if (
      this.candidate['expectedCtc'] == undefined ||
      this.candidate['expectedCtc'].toString().trim() == ''
    ) {
      this.message = 'Please enter expected CTC of the candidate';
      return;
    }
    if (this.candidate['expectedCtc'] > 500) {
      this.message = 'Please enter expected CTC of the candidate in LPA';
      return;
    }
    if (
      this.candidate['currentCtcTotal'] &&
      this.candidate['currentCtcTotal'] > 500
    ) {
      this.message = 'Please enter current CTC of the candidate in LPA';
      return;
    }
    if (this.reqId && this.noticePeriod == undefined) {
      this.message = 'Please enter notice period of the candidate';
      return;
    }
    if (this.reqId && !this.selectedStatus) {
      this.message = 'Please select the status';
      return;
    }
    if (this.reqId && this.alreadyShortListed) {
      this.message =
        this.candidate.name +
        ' has been already discovered for this requirement. Cannot consider him again for this requirement.';
      return;
    }

    if (this.sectors && this.sectors.length < 1) {
      this.message = 'Please select the sectors.';
      return;
    }
    this.valuesArray = [];
    this.valuesArray.push(this.selectedValueSet1.value);
    this.valuesArray.push(this.selectedValueSet2.value);
    this.valuesArray.push(this.selectedValueSet3.value);
    this.candidate.cultureValues = this.valuesArray.toString();
    this.candidate['emailId'] = this.candidate['emailId']
      .toString()
      .toLowerCase();
    this.message = 'Saving...';
    if (
      this.candidate['experience'] == undefined ||
      this.candidate['experience'] < 0
    )
      this.candidate['experience'] = undefined;
    if (this.cvFileLocation) this.candidate.cv = this.cvFileLocation; //encoded url
    this.commonService.showProcessingIcon();
    if (this.reqId) {
      this.candidate.discovered = 1;
    } else {
      this.candidate.nurture = true;
    }
    this.commonService
      .post('mainservice/recruitment2/candidate', this.candidate)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.selectedValueSet1 = undefined;
          this.selectedValueSet2 = undefined;
          this.selectedValueSet3 = undefined;
          this.resetValueSets();
          this.candidate = data['dataObject'];
          this.fileToUpload = null;
          this.cvToUpload = null;
          
          this.updateSectors(this.candidate);
          // this.uploadFile(data['dataObject']);
          this.uploadFile(data['dataObject']);
        } else {
          this.message = data['message'];
        }
      });
  }
  uploadFileNew(obj: any) {
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
        Authorization: localStorage.getItem('accesstoken') + '',
      });
      let options = { headers: headers };
      this.commonService.showProcessingIcon();
      this.commonService
        .post2('mainservice/recruitment2/candidateFiles', formData, options)
        .subscribe((data: any) => {
          this.commonService.hideProcessingIcon();
          this.message = data['message'];
          if (this.reqId && this.reqId > 0 && !this.alreadyShortListed)
            this.shortListCandidate();
          else {
            this.message = data['message'];
            this.updateTags();
            if (
              !this.reqId ||
              this.reqId == undefined ||
              this.reqId == 'undefined'
            )
              this.reqId = -1;
            setTimeout(() => {
              this.router.navigate([
                'recr/discoveryDetails/' + this.reqId + '/' + this.candidate.id,
              ]);
            }, 500);
          }
          this.selectedFile = null;
        });
    } else {
    }
  }
  uploadFile(obj: any) {
    if (
      (this.fileToUpload && this.fileToUpload !== null) ||
      (this.cvToUpload && this.cvToUpload != null)
    ) {
      const formData: FormData = new FormData();
      if (this.fileToUpload && this.fileToUpload !== null)
        formData.append('image', this.fileToUpload, this.fileToUpload.name);
      if (this.cvToUpload && this.cvToUpload !== null) {
        var fileName = this.commonService.removeSpecialChar(
          'pieworks-' +
            this.candidate.name +
            '.' +
            this.cvToUpload.name.split('.')[1],
          '-.',
          '-'
        );
        formData.append('cv', this.cvToUpload, fileName);
      }

      formData.append('id', obj['id']);

      let headers = new HttpHeaders({
        Accept: 'application/json',
        Authorization: localStorage.getItem('accesstoken') + '',
      });
      let options = { headers: headers };
      this.commonService.showProcessingIcon();
      this.commonService
        .post2('mainservice/recruitment2/candidateFiles', formData, options)
        .subscribe((data: any) => {
          this.commonService.hideProcessingIcon();
          this.message = data['message'];

          if (this.reqId && this.reqId > 0 && !this.alreadyShortListed)
            this.shortListCandidate();
          else {
            this.message = data['message'];
            this.updateTags();
            if (
              !this.reqId ||
              this.reqId == undefined ||
              this.reqId == 'undefined'
            )
              this.reqId = -1;
            setTimeout(() => {
              this.router.navigate([
                'recr/discoveryDetails/' + this.reqId + '/' + this.candidate.id,
              ]);
            }, 500);
          }
        });
    } else {
      if (this.reqId && this.reqId > 0 && !this.alreadyShortListed) {
        this.shortListCandidate();
      } else {
        this.message = obj['message'];
        this.updateTags();
        this.commonService.showInfoMessage(
          'Info ',
          'Successfully discovered talent !!'
        );
        if (!this.reqId || this.reqId == undefined || this.reqId == 'undefined')
          this.reqId = -1;
        setTimeout(() => {
          this.router.navigate([
            'recr/discoveryDetails/' + this.reqId + '/' + this.candidate.id,
          ]);
        }, 500);
      }
    }
    if (!this.reqId || this.reqId < 0) {
      this.message = 'Saved successfully';
      this.commonService.showInfoMessage('Info', this.message);
      this.parentObj.discoverTalent.hide();
    }
  }
  updateSectors(obj: any): void {
    //not in use now
    for (var i = 0; i < this.sectors.length; i++) {
      this.sectors[i]['recruitmentCandidate'] = obj;
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment2/sector', this.sectors)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
      });
  }
  updateEducation(obj: any): void {
    //not in use now
    for (var i = 0; i < this.educations.length; i++) {
      this.educations[i]['recruitmentCandidate'] = obj;
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment2/education', this.educations)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.updateExperience(obj);
        } else {
          this.updateExperience(obj);
          this.message = data['message'];
        }
      });
  }
  updateExperience(obj: any): void {
    //not in use now
    for (var i = 0; i < this.experiences.length; i++) {
      this.experiences[i]['recruitmentCandidate'] = obj;
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment2/experience', this.experiences)
      .subscribe((data: any) => {
        if (this.reqId && !this.alreadyShortListed) this.shortListCandidate();
        this.commonService.hideProcessingIcon();
        this.message = data['message'];
        setTimeout(() => {
          if (this.reqId)
            this.router.navigate([
              'community/' +
                localStorage.getItem('communityId') +
                '/domain/recruitment/requirements/' +
                this.reqId +
                '/shortlisting',
            ]);
          else
            this.router.navigate([
              'community/' +
                localStorage.getItem('communityId') +
                '/domain/recruitment/candidates',
            ]);
        }, 2000);
      });
  }
  file: any;
  imgPreview: any;
  onProfilePicSelect(
    files: FileList //not in use now
  ) {
    // if(files.item(0).size > 307200)//300 Kb limit
    // {
    //     this.message = "File size too big. Please choose a file less than 300 KB.";
    //     return ;
    // }
    this.fileToUpload = files.item(0);
    // this.imgPreview =  this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.fileToUpload));
  }
  isDragging = false;
  selectedFile: File | null = null;
  // Programmatically trigger the hidden file input
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
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
  // file: any;
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
  // cvToUpload: any;
  onCvSelect(event: any) {
    if (event.target.files.length == 0) {
      return;
    }

    this.file = event.target.files[0];
    if (this.file.size > 10485760 * 5) {
      //10 MB limit
      this.message = 'File size too big. Please choose a file less than 10mb.';
      this.commonService.showErrorMessage('Error', this.message);
      return;
    }
    this.cvToUpload = event.target.files[0];

    this.cvUpload();
  }
  cvUpload(): void {

    // const formData: FormData = new FormData();
    // if (this.selectedFile && this.selectedFile !== null) {
    //   var fileName = this.selectedFile.name;
    //   fileName = this.commonService.removeSpecialChar(fileName, '-.', '-');
    //   formData.append('cv', this.selectedFile, fileName);
    // }
    // formData.append('id', 'temp');

    const formData: FormData = new FormData();
    if (this.cvToUpload && this.cvToUpload !== null) {
      var fileName = this.cvToUpload.name;
      fileName = this.commonService.removeSpecialChar(fileName, '-.', '-');
      formData.append('cv', this.cvToUpload, fileName);
    }
    formData.append('id', 'temp');

    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: localStorage.getItem('accesstoken') + '',
    });
    let options = { headers: headers };
    this.commonService.showProcessingIcon();
    this.commonService
      .post2('mainservice/recruitment2/extractDataFromCv', formData, options)
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
          this.cvToUpload = undefined;
          this.validate4Completion();
        }
      });
  }

 
  cvFileLocation: any;
  cvParsedResult: any = {};
  showClipBoard(): void {
    this.commonService.showErrorMessage(
      'Clip Board',
      'Email ID : ' +
        this.cvParsedResult.probableEmailId +
        ' ,\n' +
        'Contact No : ' +
        this.cvParsedResult.probablePhoneNo +
        ' ,\n' +
        'Linkedin URL : ' +
        this.cvParsedResult.probableLinkedinUrl
    );
  }
  alreadyShortListed: any = false;
  checkIfAlreadyShortlisted(): void {
    if (!this.reqId) return;
    var url =
      'mainservice/recruitment/shortlisting/shortlist?requirementId=' +
      this.reqId +
      '&emailId=' +
      this.candidate.emailId.trim();
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (
        data['result'] === 200 &&
        data['dataArray'] != null &&
        data['dataArray'].length > 0
      ) {
        this.alreadyShortListed = true;
        this.commonService.showErrorMessage(
          'Error',
          'This candidate has been already discovered for this position'
        );
        this.candidate = {};
      } else this.alreadyShortListed = false;
    });
  }

  members: any = [];
  otherMembersId: any = '';
  loadCommunityMembers(): void {
    this.commonService.showProcessingIcon();
    var acceptanceByAceValues = '1';
    var acceptanceByAceMakerValues = '1';
    this.commonService
      .get(
        'mainservice/framework/members/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=' +
          acceptanceByAceValues +
          '&acceptanceByAceMakerValues=' +
          acceptanceByAceMakerValues +
          '&userId=-1'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.members = data['dataArray'];
          for (var i = 0; i < this.members.length; i++) {
            if (this.members[i].user.id != this.commonService.user.id) {
              if (
                this.members[i].acceptanceByAce === 1 ||
                this.members[i].acceptanceByAceMaker === 1
              ) {
                if (this.otherMembersId == '')
                  this.otherMembersId =
                    this.otherMembersId + this.members[i].user.id;
                else
                  this.otherMembersId =
                    this.otherMembersId + ',' + this.members[i].user.id;
              }
            }
          }
        }
      });
  }
  justification1: any = '';
  justification2: any = '';
  justification3: any = '';
  justifications: any = [{}, {}, {}];
  addJustification(justification: any, index: any, shortlist: any): void {
    var today = new Date();
    this.justifications[index] = {
      recruitmentShortlisting: shortlist,
      justification: justification ? justification.trim() : ' ',
      date:
        today.getFullYear() +
        '-' +
        this.getTwoDigit(today.getMonth() + 1) +
        '-' +
        this.getTwoDigit(today.getDate()),
    };
    justification = '';
  }
  removeJustification(obj: any) {
    for (var i = 0; i < this.justifications.length; i++) {
      if (obj === this.justifications[i]) {
        this.justifications.splice(i, 1);
        break;
      }
    }
  }
  updateJustificiations(shortlist: any): void {
    this.addJustification(this.justification1, 0, shortlist);
    this.addJustification(this.justification2, 1, shortlist);
    this.addJustification(this.justification3, 2, shortlist);
    this.commonService.showProcessingIcon();
    this.commonService
      .post(
        'mainservice/recruitment/shortlisting/justification',
        this.justifications
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.justification1 = undefined;
          this.justification2 = undefined;
          this.justification3 = undefined;
          setTimeout(() => {
            if (this.saveType == 1) {
              this.router.navigate([
                //recr/discoveryDetails/88138/89851
                'recr/discoveryDetails/' + this.reqId + '/' + shortlist.id,
              ]);
              this.closeModal();
            } else {
              this.candidate = {};
              this.cdkStepper.previous();
              this.cdkStepper.previous();
              this.cdkStepper.previous();
              this.valuesArray = [];
              this.selectedValueSet1 = undefined;
              this.selectedValueSet2 = undefined;
              this.selectedValueSet3 = undefined;
            }
            this.commonService.showInfoMessage(
              'Info ',
              'Successfully discovery talent !!'
            );
          }, 500);
        }
      });
  }
  initValues() {
    this.candidate = {};
    this.searchText = '';
    this.cdkStepper.previous();
    this.cdkStepper.previous();
    this.cdkStepper.previous();
    this.valuesArray = [];
    this.selectedValueSet1 = undefined;
    this.selectedValueSet2 = undefined;
    this.selectedValueSet3 = undefined;
  }
  getTwoDigit(number: any) {
    if (number.toString().length == 1) return '0' + number;
    else return number;
  }
  updateCurrentCtcTotal(): void {
    this.candidate.currentCtcTotal = 0;
    if (this.candidate.currentCtcFixed)
      this.candidate.currentCtcTotal =
        this.candidate.currentCtcTotal + this.candidate.currentCtcFixed;
    if (this.candidate.currentCtcVariable)
      this.candidate.currentCtcTotal =
        this.candidate.currentCtcTotal + this.candidate.currentCtcVariable;
  }
  mandateSearch: any = ' ';
  // on client search
  onMandateSearch(item: any) {
    this.mandateSearch = item.term;
    this.loadMandates();
  }
  // when client is already loaded locally then this method made it local search
  mandateLocalSearch(term: string, item: any) {
    return (
      item.role.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1
    );
  }

  updateTags(): void {
    if (!this.candidate.id) return;
    var tags: any = [{ name: 'Nurture' }];
    tags[0]['recruitmentCandidate'] = this.candidate;
    this.commonService
      .post('mainservice/recruitment2/tag/' + this.candidate.id, tags)
      .subscribe((data: any) => {});
  }
  nothing(): void {}
  checkSector(): void {
    if (this.availableSectors.length == 0) this.loadAvaialbleSectors();
  }
  valuesArray: any = [];
  selectedValueSet1: any;
  selectedValueSet2: any;
  selectedValueSet3: any;
  clickedValue(value: any, set: any) {
    if (set == 0) {
      if (this.selectedValueSet1 !== undefined) {
        this.selectedValueSet1.selected = false;
        if (this.selectedValueSet1.value == value.value)
          this.selectedValueSet1 = undefined;
        else this.selectedValueSet1 = value;
      } else this.selectedValueSet1 = value;
    }
    if (set == 1) {
      if (this.selectedValueSet2 !== undefined) {
        this.selectedValueSet2.selected = false;
        if (this.selectedValueSet2.value == value.value)
          this.selectedValueSet2 = undefined;
        else this.selectedValueSet2 = value;
      } else this.selectedValueSet2 = value;
    }
    if (set == 2) {
      if (this.selectedValueSet3 !== undefined) {
        this.selectedValueSet3.selected = false;
        if (this.selectedValueSet3.value == value.value)
          this.selectedValueSet3 = undefined;
        else this.selectedValueSet3 = value;
      } else this.selectedValueSet3 = value;
    }
  }
}
