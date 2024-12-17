import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Options } from '@angular-slider/ngx-slider';
// import { Validators, Editor, Toolbar } from 'ngx-editor';
import Swal from 'sweetalert2';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Validators, Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-mandate-detail',
  templateUrl: './mandate-detail.component.html',
  styleUrls: ['./mandate-detail.component.scss'],
})
export class MandateDetailComponent {
  breadCrumbItems!: Array<{}>;
  isRspp: any;
  @ViewChild('discoveryWindow') discoveryWindow: any;
  @ViewChild('discoverTalent') discoverTalent: any;
  @ViewChild('suggestions') suggestions: any;
  @ViewChild('statusRemarks') statusRemarks: any;
  @ViewChild('shareModal') shareModal: any;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  jobUrl: string = '';
  reqId: any = 0;

  linkedinShareUrl: string;
  whatsappShareUrl: string;
  facebookShareUrl: string; 
  twitterShareUrl: string;

  telegramShareUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.reqId = this.route.snapshot.paramMap.get('reqId');
    this.loadOfficeAddress();
    if (window.location.toString().indexOf('rspp') > 0) {
      this.isRspp = true; //this.commonService.getParameterFromUrl("isRspp");
      this.rssppMandateLabel = 'Rspp';
    }
    this.loadRequirementDetails();
    this.breadCrumbItems = [
      { label: 'Earn', link: '/recr/earn', active: true },
    ];
    this.loadJobFamilyForDropdown(1);
    this.loadRoles();
    this.httpClient.get('assets/json/cities.json').subscribe((data: any) => {
      this.locations = data.cities;
    });
    this.loadMenuItems();
    this.myRole = localStorage.getItem('role') + '';

    console.log('This is commonService : ', this.commonService.user);

    this.jobUrl =
      this.commonService.uiPrefix +
      'recr/open/jd/' +
      this.reqId +
      '/' +
      this.commonService.user.referralCode;

    // Dynamic Share URLs
    // this.linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    //   this.jobUrl
    // )}`;

    const validUrl = new URL(this.jobUrl); // This will throw if the URL is invalid
    const encodedJobUrl = encodeURIComponent(validUrl.toString());
    this.linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedJobUrl}`;
    this.whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${this.instagramInstructions}`
    )}`;
    this.facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      this.instagramInstructions
    )}`;
    this.twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      this.instagramInstructions
    )}&url=${encodeURIComponent(this.jobUrl)}&hashtags=JobAlert,TechJobs`;

    this.telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
      this.jobUrl
    )}&text=${encodeURIComponent(this.instagramInstructions)}`;
  }

  editor!: Editor;
  editor1!: Editor;
  editor2!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  // ngOnDestroy(): void {
  //   this.editor.destroy();
  // }

  // postRequirement(): void {
  //   console.log('Requirement Saved:', this.requirement.mandatorySkill);
  //   this.edit.mandatorySkill = false;
  // }

  ngOnInit(): void {
    this.loadAvaialbleSectors();
    this.loadStatus();
    this.editor = new Editor();
    this.editor1 = new Editor();
    this.editor2 = new Editor();
  }

  adjustHeight(event: Event): void {
    const element = event.target as HTMLElement;
    element.style.height = 'auto'; // Reset height
    element.style.height = element.scrollHeight + 'px'; // Adjust to content
  }

  // instagramInstructions: string = `${this.jobText} ${this.jobUrl}`;
  hideColumn1: boolean = false;
  workModes = [
    { name: 'WFH' },
    { name: 'WFO' },
    { name: 'Hybrid' },
    { name: 'Community' },
  ];
  locations = [];
  selectedLocations = [];
  rssppMandateLabel = 'Mandate';

  requirement: any = {};
  iAmClientAnchor = false;
  clientUrl: any = '';
  members: any = [];
  message = '';
  amIAceMaker = false;

  loadRequirementDetails(): void {
    var url = 'mainservice/recruitment/requirement/' + this.reqId;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.requirement = data['dataObject'];
        this.clientUrl =
          '/community/' +
          localStorage.getItem('communityId') +
          '/domain/recruitment/clients/' +
          this.requirement.client.id;
        this.loadCommunityMembers();
        this.loadOfferedCandidates();
        this.previousStatus = this.requirement.status.name;
        if (
          (this.requirement.clientAnchor &&
            this.requirement.clientAnchor.id == this.commonService.user.id) ||
          (this.requirement.standbyClientAnchor &&
            this.requirement.standbyClientAnchor.id ==
              this.commonService.user.id)
        )
          this.iAmClientAnchor = true;
        else this.iAmClientAnchor = false;
        this.loadFounders();
        this.loadReferenceLinks();
        this.loadCompetetors();
        this._Pyramid(
          '["--tb-primary", "--tb-secondary", "--tb-success", "--tb-warning", "--tb-info", "--tb-danger"]'
        );
        this.loadJobFamily();
        if (
          this.requirement.cultureValues &&
          this.requirement.cultureValues.length > 0
        )
          this.cultureValuesSelected =
            this.requirement.cultureValues.split(',');
        //if(this.requirement.minFixedLpa && this.requirement.minFixedLpa>0)
        this.minFixedLpa = this.requirement.minFixedLpa;
        //if(this.requirement.maxFixedLpa && this.requirement.maxFixedLpa>0)
        this.maxFixedLpa = this.requirement.maxFixedLpa;
        //if(this.requirement.maxVariableLpa && this.requirement.maxVariableLpa>0)
        this.maxVariableLpa = this.requirement.maxVariableLpa;
        //if(this.requirement.minVariableLpa && this.requirement.minVariableLpa>0)
        this.minVariableLpa = this.requirement.minVariableLpa;
        setTimeout(() => {
          this.onChangeDisabled();
        }, 2000);
        if (this.requirement.cultureValues) {
          var values = this.requirement.cultureValues.split(',');
          for (var i = 0; i < values.length; i++) {
            for (var j = 0; j < this.valueSets.length; j++) {
              for (var k = 0; k < this.valueSets[j].values.length; k++) {
                if (values[i] == this.valueSets[j].values[k].value) {
                  this.valueSets[j].values[k].selected = true;
                  this.clickedValue(this.valueSets[j].values[k], j);
                }
              }
            }
          }
        }
      }
      this.loadProcesses();
      this.suggestions?.loadMandateSuggestions(this.requirement);
    });
  }
  dummy = 1;
  cultureValuesSelected: any = [];
  edit: any = {};
  memberUsers: any = [];
  loadCommunityMembers(): void {
    this.commonService.showProcessingIcon();
    var acceptanceByAceValues = '1';
    var acceptanceByAceMakerValues = '1';
    this.commonService
      .get(
        'mainservice/framework/members/' +
          this.requirement.communityId +
          '?acceptanceByAceValues=' +
          acceptanceByAceValues +
          '&acceptanceByAceMakerValues=' +
          acceptanceByAceMakerValues +
          '&searchText=' +
          this.memberSearch +
          '&userId=-1'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.memberUsers = [];
          this.members = data['dataArray'];
          this.loadDiscoveryWinners();
          this.loadAcesResponsible();
          if (!this.members || this.members.length == 0) {
            this.members = [];
            this.checkIfIamAceMaker();
            return;
          }
          this.checkIfIamAceMaker();
          for (var i = 0; i < this.members.length; i++) {
            this.users.push(this.members[i].user);
            this.memberUsers.push(this.members[i].user);
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
            } else this.myMemberObj = this.members[i];
          }
        }
      });
  }
  myRole = '';
  myMemberObj: any = { grade: { id: 3 } };
  saveYoutubeLink() {
    if (this.requirement.videoLink) {
      this.requirement.videoLink = this.getEmbedUrlYouTube(
        this.requirement.videoLink
      );

      this.postRequirement();
    } else {
      this.requirement.videoLink = '';
      this.postRequirement();
    }
  }

  getEmbedUrlYouTube(url: string): string {
    let videoId = '';
    let additionalParams = '';

    // Handle regular YouTube URLs
    if (url.includes('watch?v=')) {
      const parts = url.split('watch?v=');
      videoId = parts[1].split('&')[0];
      additionalParams = parts[1].split('&').slice(1).join('&');
    }
    // Handle short YouTube URLs (e.g., youtu.be)
    else if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/');
      videoId = parts[1].split('?')[0];
      additionalParams = parts[1].split('?')[1] || '';
    }
    // Handle YouTube Shorts URLs
    else if (url.includes('youtube.com/shorts/')) {
      const parts = url.split('/shorts/');
      videoId = parts[1].split('?')[0];
      additionalParams = parts[1].split('?')[1] || '';
    }

    // Construct the embed URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return additionalParams ? `${embedUrl}?${additionalParams}` : embedUrl;
  }

  routeToTimeline() {
    this.router.navigate(['recr/wp/' + this.selectedPost.id + '/timeline']);
  }

  // for showing the discover window model
  disWin(): void {
    this.discoveryWindow.show();
    this.discoverTalent.loadAllDetails(this.requirement.id);
  }

  shareModalNetwork() {
    this.jobUrl =
      this.commonService.uiPrefix +
      'recr/open/jd/' +
      this.reqId +
      '/' +
      this.commonService.user.referralCode;
    this.instagramInstructions =
      'We are hiring for - ' +
      this.requirement?.role?.name +
      '\n\nThe client, based in ' +
      this.requirement?.location +
      ', operates in the ' +
      this.requirement?.client?.sector +
      ' sector and has been in business since ' +
      this.requirement?.client?.established +
      '. With a team size of ' +
      this.requirement?.client?.employees +
      ' employees and ' +
      this.requirement?.client?.latestFunding +
      ' funding, they are seeking ' +
      'candidates with ' +
      this.requirement?.experience +
      '-' +
      this.requirement?.experienceLimit +
      ' years of experience, offering a competitive salary range of ₹' +
      this.requirement?.minFixedLpa +
      '-' +
      this.requirement?.maxFixedLpa +
      'LPA.\n\n' +
      'click the below link to apply\n\n' +
      this.jobUrl;

    this.whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${this.instagramInstructions}`
    )}`;

    this.facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.jobUrl)}`;
    this.twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      this.instagramInstructions
    )}&hashtags=JobAlert,TechJobs`;

    this.telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
      this.jobUrl
    )}&text=${encodeURIComponent(this.instagramInstructions)}`;
    this.generateImage();
    this.shareModal.show();
  }

  getjsonString(obj: any): string {
    return JSON.stringify(obj);
  }
  checkIfIamAceMaker(): void {
    if (this.commonService.user.id == '7') {
      //noor,rajeen
      this.amIAceMaker = true;
      return;
    }
    this.amIAceMaker = false;
    for (var i = 0; i < this.members.length; i++) {
      if (
        this.members[i].isAceMaker &&
        this.members[i].id.userId == this.commonService.user.id
      ) {
        this.amIAceMaker = true;
        //break;
      }
      if (this.members[i].user.id == this.requirement.clientAnchorId)
        this.requirement.clientAnchor = this.members[i].user; //this is required as the obj reference also must be same for the data to get binded at UI
      if (this.members[i].user.id == this.requirement.standbyClientAnchorId)
        this.requirement.standbyClientAnchor = this.members[i].user;
    }
    this.loadFeed();
  }
  roleHandle: any;
  roles: any = [];
  roleSearchText: any = '';
  loadRoles(): void {
    if (this.roleHandle) this.roleHandle.unsubscribe();
    this.commonService.showProcessingIcon();
    this.roleHandle = this.commonService
      .get('mainservice/recruitment2/role?searchText=' + this.roleSearchText)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.roles = [];
        if (data['result'] === 200) {
          this.roles = data['dataArray'];
        }
      });
  }
  clientHandle: any;
  clients: any = [];
  clientSearchText = '';
  loadClients(): void {
    if (this.clientHandle) this.clientHandle.unsubscribe();
    this.commonService.showProcessingIcon();
    this.clientHandle = this.commonService
      .get(
        'mainservice/framework/client?searchText=' +
          this.clientSearchText +
          '&communityId=' +
          localStorage.getItem('communityId')
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.clients = [];
        if (data['result'] === 200) {
          this.clients = data['dataArray'];
        }
      });
  }
  slabs = [];
  loadContractSlabs(event: any): void {
    setTimeout(() => {
      this.commonService.showProcessingIcon();
      this.commonService
        .get('mainservice/recruitment/contract/' + this.requirement.clientId)
        .subscribe((data: any) => {
          this.commonService.hideProcessingIcon();
          this.slabs = [];
          if (data['result'] === 200) {
            this.slabs = data['dataArray'];
          }
        });
    }, 1000);
  }
  updateTotalLpa(): void {
    this.requirement.minLpa =
      this.requirement.minFixedLpa + this.requirement.minVariableLpa;
    this.requirement.maxLpa =
      this.requirement.maxFixedLpa + this.requirement.maxVariableLpa;
  }

  memberSearch: any = '';
  onMemberSearch(item: any) {
    this.memberSearch = item.term;
    this.loadCommunityMembers();
  }

  // when client is already loaded locally then this method made it local search
  memberLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }

  saveRoleIfRequiredAndPostRequirement(): void {
    //if(!this.validateRequirement())
    //     return;
    var role = { name: this.roleSearchText };
    this.message = '';
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment2/role', role)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.message = data['message'];
        if (data['result'] === 200) {
          this.requirement.role = data['dataObject'];
          setTimeout(() => {
            this.postRequirement();
          }, 500);
        }
      });
  }
  validateStatus() {
    if (
      this.requirement.status.id == 1 ||
      this.requirement.status.id == 6 ||
      this.requirement.status.id == 7 ||
      this.requirement.status.id == 4 ||
      this.requirement.status.id == 5
    ) {
      this.statusRemarks.show();
    } else {
      this.postRequirement();
    }
  }
  previousStatus: any = '';
  postRequirement(): void {
    // Store the original values (before making any changes)
    let originalRequirement = { ...this.requirement };

    this.valuesArray = [];
    if (this.selectedValueSet1?.value)
      this.valuesArray.push(this.selectedValueSet1.value);
    if (this.selectedValueSet2?.value)
      this.valuesArray.push(this.selectedValueSet2.value);
    if (this.selectedValueSet3?.value)
      this.valuesArray.push(this.selectedValueSet3.value);
    if (this.valuesArray.length == 3)
      this.requirement.cultureValues = this.valuesArray.toString();

    if (this.selectedLocations && this.selectedLocations.length > 0)
      this.requirement.location = this.selectedLocations.toString();
    this.requirement.minFixedLpa = this.minFixedLpa;
    this.requirement.maxFixedLpa = this.maxFixedLpa;
    this.requirement.minVariableLpa = this.minVariableLpa;
    this.requirement.maxVariableLpa = this.maxVariableLpa;
    this.updateTotalLpa();
    this.message = 'Updating requirement...';

    if (this.requirement.clientAnchor)
      this.requirement.clientAnchorId = this.requirement.clientAnchor.id;
    if (this.requirement.standbyClientAnchor)
      this.requirement.standbyClientAnchorId =
        this.requirement.standbyClientAnchor.id;

    this.requirement.client.id = this.requirement.clientId;
    this.requirement.statusId = this.requirement.status.id;

    if (!this.requirement.retainerFee) this.requirement.retainerFee = 0;
    if (this.selectedJobFamilyL2)
      this.requirement.jobFamily = this.selectedJobFamilyL2;

    this.commonService.showProcessingIcon();

    this.commonService
      .post('mainservice/recruitment/requirement', this.requirement)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.roles = [];
        if (data['result'] === 200) {
          if (this.edit.process) this.saveRounds();
          if (this.edit.orgHierarchy) location.reload();
          this.edit = {};
          this.onChangeDisabled();

          // Call this function from your main function like this
          this.detectAndNotifyChanges(originalRequirement, this.requirement);

          // Existing logic for status change notifications
          if (this.previousStatus !== this.requirement.status.name) {
            var link = '/recr/wp/' + this.requirement.id;
            var msg =
              'Status of requirement ' +
              this.requirement.role.name +
              ', ' +
              this.requirement.client.name +
              ' has been updated  to ' +
              this.requirement.status.name +
              '.';
            this.commonService.sendNotification(
              this.otherMembersId,
              msg,
              link,
              'COMMUNITY MEMBER',
              1,
              0,
              1
            );
            msg =
              msg +
              '<br> Click ' +
              this.commonService.uiPrefix +
              link +
              ' for more details.';
          }

          this.commonService.showSuccessMessage(
            'Update',
            this.isRspp
              ? 'Saved RSPP successfully'
              : 'Saved mandate successfully'
          );
        } else {
          this.message = data['message'];
          this.loadRequirementDetails();
        }
      });
  }

  // Function to compare fields and generate the notification
  detectAndNotifyChanges(originalRequirement: any, requirement: any) {
    let changesMade = false;
    let changesList = [];

    // Compare each field and track changes
    if (originalRequirement.role.name !== requirement.role.name) {
      changesMade = true;
      changesList.push(
        `Role changed from ${originalRequirement.role.name} to ${requirement.role.name}`
      );
    }

    if (originalRequirement.client.name !== requirement.client.name) {
      changesMade = true;
      changesList.push(
        `Client changed from ${originalRequirement.client.name} to ${requirement.client.name}`
      );
    }

    if (originalRequirement.location !== requirement.location) {
      changesMade = true;
      changesList.push(
        `Location changed from ${originalRequirement.location} to ${requirement.location}`
      );
    }

    if (originalRequirement.minFixedLpa !== requirement.minFixedLpa) {
      changesMade = true;
      changesList.push(
        `Minimum Fixed CTC changed from ${originalRequirement.minFixedLpa} to ${requirement.minFixedLpa}`
      );
    }

    if (originalRequirement.maxFixedLpa !== requirement.maxFixedLpa) {
      changesMade = true;
      changesList.push(
        `Maximum Fixed CTC changed from ${originalRequirement.maxFixedLpa} to ${requirement.maxFixedLpa}`
      );
    }

    if (originalRequirement.minVariableLpa !== requirement.minVariableLpa) {
      changesMade = true;
      changesList.push(
        `Minimum Variable CTC changed from ${originalRequirement.minVariableLpa} to ${requirement.minVariableLpa}`
      );
    }

    if (originalRequirement.maxVariableLpa !== requirement.maxVariableLpa) {
      changesMade = true;
      changesList.push(
        `Maximum Variable CTC changed from ${originalRequirement.maxVariableLpa} to ${requirement.maxVariableLpa}`
      );
    }

    if (originalRequirement.retainerFee !== requirement.retainerFee) {
      changesMade = true;
      changesList.push(
        `Retainer Fee changed from ${originalRequirement.retainerFee} to ${requirement.retainerFee}`
      );
    }

    if (originalRequirement.cultureValues !== requirement.cultureValues) {
      changesMade = true;
      changesList.push(
        `Culture Values changed from ${originalRequirement.cultureValues} to ${requirement.cultureValues}`
      );
    }

    if (originalRequirement.clientAnchorId !== requirement.clientAnchorId) {
      changesMade = true;
      changesList.push(
        `Account Manager changed from ${originalRequirement.clientAnchor.name} to ${requirement.clientAnchor.name}`
      );
    }

    if (
      originalRequirement.standbyClientAnchorId !==
      requirement.standbyClientAnchorId
    ) {
      changesMade = true;
      changesList.push(
        `Standby Account Manager changed from ${originalRequirement.standbyClientAnchor.name} to ${requirement.standbyClientAnchor.name}`
      );
    }

    if (originalRequirement.workMode !== requirement.workMode) {
      changesMade = true;
      changesList.push(
        `Work Mode changed from ${originalRequirement.workMode} to ${requirement.workMode}`
      );
    }
    if (originalRequirement.successProfile !== requirement.successProfile) {
      changesMade = true;
      changesList.push(
        `Success Profile changed from ${originalRequirement.successProfile} to ${requirement.successProfile}`
      );
    }
    if (originalRequirement.clientAnchor !== requirement.clientAnchor) {
      changesMade = true;
      changesList.push(
        `Account Manager changed from ${originalRequirement.clientAnchor} to ${requirement.clientAnchor}`
      );
    }
    if (
      originalRequirement.standbyClientAnchor !==
      requirement.standbyClientAnchor
    ) {
      changesMade = true;
      changesList.push(
        `Standby Account Manager changed from ${originalRequirement.standbyClientAnchor} to ${requirement.standbyClientAnchor}`
      );
    }
    if (originalRequirement.videoLink !== requirement.videoLink) {
      changesMade = true;
      changesList.push(
        `Video for mandate changed from ${originalRequirement.videoLink} to ${requirement.videoLink}`
      );
    }

    // Add more fields as needed to track changes

    // If changes were made, build the notification message
    if (changesMade) {
      const notificationMessage = `The following changes were made to the requirement:\n${changesList.join(
        ',\n'
      )}`;
      this.sendChangeNotification(requirement, changesList); // Send notification using a separate function
    }
  }

  // Function to send the notification
  sendChangeNotification(requirement: any, changesList: string[]) {
    const link = `/recr/wp/${requirement.id}`;
    const msg = `Details of requirement ${requirement.role.name}, ${
      requirement.client.name
    } have been updated:\n${changesList.join(',\n')}.`;

    this.commonService.sendNotification(
      this.otherMembersId,
      msg,
      link,
      'COMMUNITY MEMBER',
      1,
      1,
      1
    );
  }


  // method to send to another page delay
  navigateWithDelay(url: string, text: string): void {
    this.commonService.copyLink(text); 
    this.shareModal.hide();
    setTimeout(() => {
      window.open(url, '_blank'); 
    }, 2000); // Delay in milliseconds
  }
  offeredCandidates: any = [];
  loadOfferedCandidates(): void {
    var url =
      'mainservice/recruitment/shortlisting/shortlist/' +
      this.requirement.id +
      '?pageNum=' +
      1 +
      '&pageSize=' +
      100;
    url =
      url +
      '&discovererIds=-1&searchText=&status=13,12,17&clientIds=-1' +
      '&roles=-1&top50=false&minCtc=0&maxCtc=200&minExp=0&maxExp=50';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      this.offeredCandidates = [];
      if (data['result'] === 200) {
        this.offeredCandidates = data['dataArray'];
      }
    });
  }
  referenceLinks: any = [];
  loadReferenceLinks(): void {
    this.referenceLinks = [];
    var url =
      'mainservice/framework/generic/remark/' +
      this.requirement.client.id +
      '?category=client-links';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.referenceLinks = data['dataArray'];
      }
    });
  }
  removeReferenceLinks(obj: any): void {
    for (var i = 0; i < this.referenceLinks.length; i++) {
      if (this.referenceLinks[i] === obj) {
        this.referenceLinks.splice(i, 1);
      }
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/generic/removeRemark', obj)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.message = data['message'];
          this.loadReferenceLinks();
          //this.editRemark=false;
          return;
        } else {
          this.message = data['message'];
          this.loadReferenceLinks();
        }
      });
  }
  addresses: any = [];
  loadOfficeAddress(): void {
    this.addresses = [];
    var url =
      'mainservice/framework/generic/remark/' +
      this.reqId +
      '?category=mandate-office-address';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.addresses = data['dataArray'];
      }
    });
  }
  addressTemp: any;
  addAddress(): void {
    if (!this.addressTemp || this.addressTemp.length === 0) return;
    var temp = this.addressTemp.split(/\r?\n/);
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].trim().length == 0) continue;
      var temp2: any = [];
      if (temp[i].length > 300) {
        temp2 = temp[i].match(/.{1,300}/g);
      } else {
        temp2.push(temp[i]);
      }
      for (var j = 0; j < temp2.length; j++) {
        if (temp2[j].trim().length == 0) continue;
        var remarkObj = {
          remark: temp2[j],
          category: 'mandate-office-address',
          categoryId: this.reqId,
          createdBy: this.commonService.user.id,
        };
        this.addresses.push(remarkObj);
        this.saveOfficeAddress(remarkObj);
      }
    }
    this.addressTemp = '';
  }
  saveOfficeAddress(remarkObj: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/generic/remark', remarkObj)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.loadOfficeAddress();
          this.edit.officeAddress = false;
          this.commonService.showInfoMessage('Info', 'Updation successful.');

          // Send the notification
          var link = '/recr/wp/' + remarkObj.categoryId;
          var msg = `Details of requirement office address is changed !`;
          this.commonService.sendNotification(
            this.otherMembersId,
            msg,
            link,
            'COMMUNITY MEMBER',
            1,
            0,
            1
          );

          return;
        } else {
          this.loadOfficeAddress();
        }
      });
  }
  removeOfficeAddress(obj: any): void {
    for (var i = 0; i < this.addresses.length; i++) {
      if (this.addresses[i] === obj) {
        this.addresses.splice(i, 1);
      }
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/generic/removeRemark', obj)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.commonService.showInfoMessage(
            'Update',
            'Address removed successfully.'
          );
          this.message = data['message'];
          this.loadOfficeAddress();
          return;
        } else {
          this.message = data['message'];
          this.loadReferenceLinks();
        }
      });
  }
  founders: any = [];
  otherMembersId: any = '';
  loadFounders(): void {
    this.founders = [];
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/framework/founders?clientId=' + this.requirement.client.id
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.founders = data['dataArray'];
        }
      });
  }
  competetors: any = [];
  competetorTemp: any;
  editCompetetor = false;
  addCompetetor(): void {
    if (!this.competetorTemp || this.competetorTemp.length === 0) return;
    var temp = this.competetorTemp.split(/\r?\n/);
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].trim().length == 0) continue;
      var temp2: any = [];
      if (temp[i].length > 300) {
        temp2 = temp[i].match(/.{1,300}/g);
      } else {
        temp2.push(temp[i]);
      }
      for (var j = 0; j < temp2.length; j++) {
        if (temp2[j].trim().length == 0) continue;
        var competetorObj = {
          name: temp2[j],
          requirementId: parseInt(this.requirement.id),
        };
        this.competetors.push(competetorObj);
        this.saveCompetetor(this.competetors);
      }
    }
    this.edit = {};
    this.competetorTemp = '';
  }
  removeCompetetor(obj: any): void {
    for (var i = 0; i < this.competetors.length; i++) {
      if (this.competetors[i] === obj) {
        this.competetors.splice(i, 1);
      }
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/client/removeCompetetor', obj)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.loadCompetetors();
          this.editCompetetor = false;

          if (data['result'] === 200)
            this.commonService.showSuccessMessage(
              'Update',
              'Updated mandate successfully'
            );
          else
            this.commonService.showErrorMessage(
              'Update',
              'Couldnt update mandate. Please try again later.'
            );
          return;
        } else {
          this.loadCompetetors();
        }
        this.edit = {};
      });
  }
  saveCompetetor(competetorObj: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/client/competetor', competetorObj)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.loadCompetetors();
          this.editCompetetor = false;
          if (data['result'] === 200)
            this.commonService.showSuccessMessage(
              'Update',
              'Updated mandate successfully'
            );
          else
            this.commonService.showErrorMessage(
              'Update',
              'Couldnt update mandate. Please try again later.'
            );
          return;
        } else {
          this.loadCompetetors();
        }
        this.edit = {};
      });
  }
  loadCompetetors() {
    this.competetors = [];
    var url = 'mainservice/framework/client/competetor/' + this.reqId;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.competetors = data['dataArray'];
      }
    });
  }
  questions: any = [];
  loadJobFamily(): void {
    if (!this.requirement.rspp) {
      return;
    }
    var parentId = 0;
    this.questions = [];
    setTimeout(() => {
      var url =
        'mainservice/recruitment2/open/loadJobFamily?parentId=' +
        this.requirement.rspp?.jobFamily?.id;
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200 && data['dataArray'] != null) {
          this.questions = data['dataArray'];
        }
      });
    }, 500);
  }

  /*chart starts here*/
  chartdata: any = [200, 330, 548, 740, 880, 990, 1100, 1380]; //example data
  Pyramid: any;
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(' ', '');
      if (newValue.indexOf(',') === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(
          newValue
        );
        if (color) {
          color = color.replace(' ', '');
          return color;
        } else return newValue;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue(val[0]);
          rgbaColor = 'rgba(' + rgbaColor + ',' + val[1] + ')';
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  public _Pyramid(colors: any) {
    colors = this.getChartColorsArray(colors);
    var tempData: any = [];
    var tempLabels: any = [];
    if (this.requirement.totalOrgLevels) {
      for (var i = 1; i <= this.requirement.totalOrgLevels; i++) {
        tempData.push(i);
        tempLabels.push(' ');
      }
    }
    if (this.requirement.orgLevel)
      tempLabels[this.requirement.totalOrgLevels - this.requirement.orgLevel] =
        this.requirement.role.name;
    this.Pyramid = {
      series: [
        {
          name: '',
          data: tempData,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: false,
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          distributed: true,
          barHeight: '80%',
          isFunnel: true,
        },
      },
      colors: colors,
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opt: any) {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        dropShadow: {
          enabled: true,
        },
      },
      title: {
        text: ' ',
        align: 'center',
      },
      xaxis: {
        categories: tempLabels,
        tooltip: {
          enabled: false,
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        //not working
        show: false,
        enabled: false,
      },
    };
    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._Pyramid(
        '["--tb-primary", "--tb-secondary", "--tb-success", "--tb-warning", "--tb-info", "--tb-danger"]'
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor],
    });
  }

  Responsive = {
    infinite: true,
    slidesToShow: 2,
    autoplay: true,
    dots: true,
  };

  users: any = [];
  acesResponsible: any = [];
  acesResponsibleForNgModel: any = [];
  podMembers: any = [];
  loadAcesResponsible(): void {
    if (this.acesResponsibleForNgModel?.length > 0) return;
    this.users = [];
    this.commonService.showProcessingIcon();
    this.acesResponsibleForNgModel = [];
    this.commonService
      .get('mainservice/recruitment/acesResponsible/' + this.reqId)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.acesResponsible = [];
        if (data['result'] === 200) {
          this.acesResponsible = data['dataArray'];
          console.log(this.acesResponsible);
          for (var i = 0; i < this.acesResponsible.length; i++) {
            this.acesResponsibleForNgModel.push(this.acesResponsible[i].user);
            for (var j = 0; j < this.members.length; j++) {
              this.users.push(this.members[j].user);
              if (
                this.members[j].user?.id === this.acesResponsible[i].user?.id
              ) {
                this.podMembers.push(this.members[j]);
              }
            }
          }
        }
      });
  }

  getOnlineStatusIcon(status: any): any {
    switch (status) {
      case 'WORK_ON_MODE':
        return ' ri-checkbox-blank-circle-fill pieworks-green';
      case 'IN_A_MEETING':
        return ' ri-checkbox-blank-circle-fill pieworks-red';
      case 'WORK_OFF_MODE':
        return ' ri-checkbox-blank-circle-line';
      default:
        return 'icofont-exit';
    }
  }
  discoveryWinners: any = [];
  discoveryWinnersForNgModel: any = [];
  loadDiscoveryWinners(): void {
    this.commonService.showProcessingIcon();
    this.discoveryWinnersForNgModel = [];
    this.commonService
      .get('mainservice/recruitment/discoveryWinner/' + this.reqId)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.discoveryWinners = [];
        if (data['result'] === 200) {
          this.discoveryWinners = data['dataArray'];
          for (var i = 0; i < this.discoveryWinners.length; i++) {
            for (var j = 0; j < this.members.length; j++) {
              if (
                this.members[j].user.id === this.discoveryWinners[i].user.id
              ) {
                this.discoveryWinnersForNgModel.push(this.members[j].user);
              }
            }
          }
        }
      });
  }
  mouseoutListener(name: string): void {
    setTimeout(() => {
      this.edit[name] = false;
    }, 10000);
  }
  getWriteUpRows(text: any): any {
    if (!text) return 3;
    //return 5;
    return text.length / 80;
  }
  jobFamiliesL1: any = [];
  jobFamiliesL2: any = [];
  jobFamiliesL3: any = [];
  selectedJobFamilyL3: any;
  selectedJobFamilyL2: any;
  selectedJobFamilyL1 = { id: 0, name: 'Select Job Family*' };
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
              for (var i = 0; i < this.jobFamiliesL1.length; i++) {
                if (
                  this.jobFamiliesL1[i].id ==
                  this.requirement.jobFamily?.parentNodeId
                ) {
                  this.selectedJobFamilyL1 = this.jobFamiliesL1[i];
                  this.loadJobFamilyForDropdown(2);
                  break;
                }
              }
              if (!this.selectedJobFamilyL1)
                this.selectedJobFamilyL1 = {
                  id: 0,
                  name: 'Select Job Family*',
                };
            } else if (level == 2) {
              this.jobFamiliesL2 = data['dataArray'];
              for (var i = 0; i < this.jobFamiliesL2.length; i++) {
                if (this.jobFamiliesL2[i].id == this.requirement.jobFamily.id) {
                  this.selectedJobFamilyL2 = this.jobFamiliesL2[i];
                  break;
                }
              }
              if (!this.selectedJobFamilyL2)
                this.selectedJobFamilyL2 = {
                  id: 0,
                  name: 'Select ' + this.jobFamiliesL2[0]?.label + '*',
                };
            } else if (level == 3) {
              this.jobFamiliesL3 = data['dataArray'];
              this.selectedJobFamilyL3 = {
                id: 0,
                name: 'Select ' + this.jobFamiliesL3[0]?.label + '*',
              };
            }
          }
        }
      });
    }, 500);
  }
  sliderOptions: Options = {
    floor: 0,
    ceil: 200,
    disabled: false,
  };
  sliderOptionsDisabled: Options = {
    floor: 0,
    ceil: 200,
    disabled: true,
    hideLimitLabels: true,
  };
  minFixedLpa = 1;
  maxFixedLpa = 1;
  minVariableLpa = 1;
  maxVariableLpa = 1;
  onChangeDisabled(): void {
    //alert("called");
    this.sliderOptions = Object.assign({}, this.sliderOptions, {
      disabled: !this.edit.budget,
    });
    this.sliderOptionsDisabled = Object.assign({}, this.sliderOptionsDisabled, {
      disabled: !this.edit.budget,
    });
    //window.dispatchEvent(new Event('resize'));
    //this.sliderOptions.disabled = !this.sliderOptions.disabled;
  }
  isLinkedIn: any = ['Yes', 'No'];
  acesResponsibleToBeSaved: any = [];
  saveAcesResponsible(req: any): void {
    this.acesResponsibleToBeSaved = []; //its an arry of user object
    var userIds: any = '';
    for (var i = 0; i < this.acesResponsibleForNgModel.length; i++) {
      var ace: any = {
        recruitmentRequirement: req,
        user: this.acesResponsibleForNgModel[i],
      };
      var id: any = this.searchUserInAcesResponsibleFromDb(
        this.acesResponsibleForNgModel[i].id
      );
      if (id !== null) ace['id'] = id;
      else {
        userIds = userIds + ace.user.id + ',';
      }
      this.acesResponsibleToBeSaved.push(ace);
    }

    this.commonService.showProcessingIcon();
    this.commonService.showInfoMessage('Info', 'Submited request ');
    this.commonService
      .post(
        'mainservice/recruitment/acesResponsible/' +
          this.requirement.id +
          '?deleteOld=yes',
        this.acesResponsibleToBeSaved
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.message = data['message'];
        this.acesResponsibleForNgModel = [];
        this.loadRequirementDetails();
        var link = '/recr/wp' + req.id;
        if (userIds.length > 0) {
          userIds = userIds.substring(0, userIds.length - 1);
          this.commonService.sendNotification(
            userIds,
            'You have been assigned the responsibility for discovering talents for ' +
              req.role.name +
              ', ' +
              req.client.name,
            link,
            'COMMUNITY MEMBER',
            1,
            1
          );
        }
        this.edit = {};
        if (data['result'] === 200)
          this.commonService.showSuccessMessage(
            'Update',
            'Updated mandate successfully'
          );
        else
          this.commonService.showErrorMessage(
            'Update',
            'Couldnt update mandate. Please try again later.'
          );
      });
  }
  searchUserInAcesResponsibleFromDb(userId: any): any {
    for (var i = 0; i < this.acesResponsible.length; i++) {
      if (userId === this.acesResponsible[i].user.id) {
        return this.acesResponsible[i].id;
      }
    }
    return null;
  }
  winnersToBeSaved: any = [];
  saveDiscoveryWinners(req: any): void {
    this.winnersToBeSaved = []; //its an arry of user object
    for (var i = 0; i < this.discoveryWinnersForNgModel.length; i++) {
      var winner: any = {
        recruitmentRequirement: req,
        user: this.discoveryWinnersForNgModel[i],
      };
      var id = this.searchUserInWinnersFromDb(
        this.discoveryWinnersForNgModel[i].id
      );
      if (id !== null) winner['id'] = id;
      this.winnersToBeSaved.push(winner);
    }

    this.commonService.showProcessingIcon();
    this.commonService
      .post(
        'mainservice/recruitment/discoveryWinner/' + this.requirement.id,
        this.winnersToBeSaved
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.message = data['message'];
        this.loadRequirementDetails();
        this.edit = {};

        if (data['result'] === 200)
          this.commonService.showSuccessMessage(
            'Update',
            'Updated mandate successfully'
          );
        else
          this.commonService.showErrorMessage(
            'Update',
            'Couldnt update mandate. Please try again later.'
          );
      });
  }
  searchUserInWinnersFromDb(userId: any): any {
    for (var i = 0; i < this.discoveryWinners.length; i++) {
      if (userId === this.discoveryWinners[i].user.id) {
        return this.discoveryWinners[i].id;
      }
    }
    return null;
  }
  availableSectors: any = [];
  newSector: any = '';
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
  updateClient(): void {
    this.commonService
      .post('mainservice/framework/updateClient', this.requirement.client)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.message = data['message'];
        this.loadRequirementDetails();
        this.edit = {};
        if (data['result'] === 200)
          this.commonService.showSuccessMessage(
            'Update',
            'Updated mandate successfully'
          );
        else
          this.commonService.showErrorMessage(
            'Update',
            'Couldnt update mandate. Please try again later.'
          );
      });
  }
  menuOptions: any = [];
  feeds: any = [];
  loadRsppMenuItems(): void {
    this.menuOptions = [];
    this.menuOptions.push('Copy editable link to share with client');
    this.menuOptions.push('Copy viewable link to share with client');
    this.menuOptions.push('Copy link to share with talents');
  }
  loadMenuItems(): void {
    if (this.isRspp) {
      this.loadRsppMenuItems();
      return;
    }
    this.menuOptions = [];
    if (this.commonService.rbac['discover-candidate'])
      this.menuOptions.push('Discover Candidate');
    // if (this.commonService.rbac['discoveries'])
    //   this.menuOptions.push('Discovered Candidates');
    // if (this.commonService.rbac['view-rspp'])
    //   this.menuOptions.push('View RSPP');
    if (this.commonService.rbac['join-pod']) this.menuOptions.push('Join POD');
    if (this.commonService.rbac['view-timeline'])
      this.menuOptions.push('View Timeline');
    if (this.commonService.rbac['mark-as-focus'] || this.amIAceMaker) {
      var present = false;
      for (var i = 0; i < this.feeds.length; i++) {
        if (this.feeds[i].typeId == this.requirement.id) present = true;
      }
      if (!present) this.menuOptions.push('Mark as Focus for Current Week');
      else this.menuOptions.push('Remove from focus for current week');
    }
  }
  loadFeed(): void {
    this.commonService
      .get(
        'mainservice/framework/feedsByTypeAndCommunity?communityId=' +
          this.requirement.communityId +
          '&type=requirement'
      )
      .subscribe((data: any) => {
        this.feeds = data['dataArray'];
        this.loadMenuItems();
      });
  }
  handleMenu(option: any): void {
    switch (option) {
      //          case "Details":
      //              this.router.navigate(["community/"+localStorage.getItem("communityId")+"/domain/recruitment/requirements/"+this.selectedReq.id]);
      //              break;
      case 'Discover Candidate':
        this.disWin();
        break;
      case 'Discovered Candidates':
        this.router.navigate(['/recr/discoveries/' + this.requirement.id]);
        break;
      case 'View Timeline':
        this.router.navigate(['recr/wp/' + this.requirement.id + '/timeline']);
        break;
      case 'Mark as Focus for Current Week':
        this.confirmAndProceed(
          'Confirmation required',
          'Are you sure you want to mark this mandate as focus for the current week ?',
          this,
          'includeInFeed'
        );
        break;
      case 'Remove from focus for current week':
        this.confirmAndProceed(
          'Confirmation required',
          'Are you sure you want to remove this mandate for focus for the current week ?',
          this,
          'removeFromFeed'
        );
        break;
      case 'View RSPP':
        this.router.navigate(['recr/rspp-view/' + this.requirement.id]);
        break;
      case 'Copy editable link to share with client':
        this.copyEditableLinkForClient();
        break;
      case 'Copy viewable link to share with client':
        this.copyLinkForClient();
        break;
      case 'Copy link to share with talents':
        this.copyLinkForTalent();
        break;
    }
  }
  copyEditableLinkForClient(): void {
    var url =
      this.commonService.uiPrefix + 'recr/open/rspp/' + this.requirement.id;
    this.commonService.copyMessage(url);
    this.commonService.showInfoMessage('Info', 'Link copied to clipboard');
  }
  copyLinkForClient(): void {
    var url =
      this.commonService.uiPrefix +
      'recr/open/rspp-view/' +
      this.requirement.id +
      '?showBudget=true';
    this.commonService.copyMessage(url);
    this.commonService.showInfoMessage('Info', 'Link copied to clipboard');
  }
  copyLinkForTalent(): void {
    var url =
      this.commonService.uiPrefix +
      'recr/open/rspp-view/' +
      this.requirement.id;
    this.commonService.copyMessage(url);
    this.commonService.showInfoMessage('Info', 'Link copied to clipboard');
  }
  includeInFeed(): void {
    var feed = {
      icon: this.requirement.client.icon,
      title: 'Mandate on focus.',
      description:
        this.requirement.role.name +
        '#' +
        this.requirement.minLpa +
        ' LPA - ' +
        this.requirement.maxLpa +
        ' LPA, ' +
        '#' +
        this.requirement.location +
        '#' +
        this.requirement.client.name,
      link:
        'community/' +
        localStorage.getItem('communityId') +
        '/domain/recruitment/requirements/' +
        this.requirement.id,
      communityId: this.requirement.communityId,
      type: 'requirement',
      typeId: this.requirement.id,
      userId: -1,
    };
    this.commonService
      .post('mainservice/framework/includeInFeeds', feed)
      .subscribe((data: any) => {
        if (data['result'] == 200)
          this.commonService.showSuccessMessage(
            'Update',
            'Mandate included in feed.'
          );
        else
          this.commonService.showErrorMessage(
            'Error',
            "Couldn't mark requirement as focus on for the current week. Please try again later."
          );
        this.commonService.hideProcessingIcon();
        this.loadFeed();
      });
  }
  removeFromFeed(): void {
    var feed = { type: 'requirement', typeId: this.requirement.id };
    this.commonService
      .post('mainservice/framework/removeFromFeeds', feed)
      .subscribe((data: any) => {
        if (data['result'] == 200)
          this.commonService.showSuccessMessage(
            'Update',
            'Mandate removed from focus for the current week.'
          );
        else
          this.commonService.showErrorMessage(
            'Error',
            "Couldn't remove requirement for focus. Please try again later."
          );
        this.commonService.hideProcessingIcon();
        this.loadFeed();
        this.loadRequirementDetails();
      });
  }

  confirmAndProceed(title: any, message: any, parentObj: any, cb: any): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        if (cb) parentObj[cb]();
      }
    });
  }
  loadStatus(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/recruitment/status')
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.status = [];
        if (data['result'] === 200) {
          this.status = data['dataArray'];
        }
      });
  }
  status: any = [];
  valueSets = [
    {
      question: 'How we deliver ?',
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
      question: 'How we treat each other ?',
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
      question: 'How we identify ourselves ?',
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
  file: any;
  fileToUpload: File | null = null;
  onFileSelect(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList![0].size > 10 * 1024 * 1024) {
      //10 MB limit
      this.commonService.showErrorMessage(
        'ERror',
        'File size too big. Please choose a file less than 10 MB.'
      );
      return;
    }
    this.fileToUpload = fileList![0];
  }
  uploadFile() {
    this.message = '';
    const formData: FormData = new FormData();
    if (this.fileToUpload && this.fileToUpload !== null) {
      var fileName = this.fileToUpload.name;
      fileName = this.commonService.removeSpecialChar(fileName, '-.', '-');
      formData.append('image', this.fileToUpload, fileName);
    } else {
      this.message = 'Saved RSPP successfully';
      this.commonService.showSuccessMessage('Update', this.message);
      return;
    }
    formData.append('id', this.requirement.id);
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: localStorage.getItem('accesstoken') + '',
    });
    let options = { headers: headers };
    //this.message = "Saving ...";
    this.commonService.showProcessingIcon();
    this.commonService
      .post2('mainservice/recruitment3/uploadMandateFiles', formData, options)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.message = this.isRspp
            ? 'Saved RSPP successfully'
            : 'Saved mandate successfully';
          this.commonService.showSuccessMessage('Update', this.message);
        } else {
          this.message =
            "Couldnt upload file':'Saved mandate successfully.Couldnt upload file";
          this.commonService.showSuccessMessage(
            'Update',
            'Couldnt upload file'
          );
        }
      });
  }

  processes: any = [];
  processString: any = '';
  addProcess(): void {
    if (this.processString && this.processString.length > 0)
      this.processes.push({
        requirementId: this.requirement.id,
        process: this.processString,
      });
    this.processString = '';
  }
  saveRounds(): void {
    this.commonService
      .post('mainservice/recruitment3/requirement/open/process', this.processes)
      .subscribe((data: any) => {
        this.message = this.isRspp
          ? 'Saved RSPP successfully'
          : 'Saved mandate successfully';
        this.commonService.showSuccessMessage('Update', this.message);
      });
  }
  loadProcesses(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/recruitment3/requirement/open/process/' + this.reqId)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.processes = [];
        if (data['result'] === 200) {
          this.processes = data['dataArray'];
        }
      });
  }
  removeProcess(process: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment3/requirement/open/process/delete', process)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.processes = [];
        if (data['result'] === 200) {
          this.loadProcesses();
        }
      });
  }

  selectedPost: any = {};

  linkedInPost() {
    var post =
      'Hi everyone,\n\n' +
      'We are looking for a ' +
      this.selectedPost.role.name +
      ' in the ' +
      this.selectedPost.client.sector +
      ' sector with more than ' +
      this.selectedPost.experience +
      ' years of experience!\n\n' +
      'Must-have skills:\n' +
      this.selectedPost.mandatorySkill +
      '\n\n' +
      'Responsibilities include:\n' +
      this.selectedPost.roleDescr +
      '\n\n' +
      'Interested candidates, please send your resume to ' +
      this.commonService.user.username +
      '\n\n' +
      'Looking forward to hearing from you!';

    Swal.fire({
      title: 'Post',
      html:
        '<textarea id="swal-textarea" style="font-size:17px;width:100%;height:200px;">' +
        post +
        '</textarea>',
      icon: 'success',
      showCancelButton: true,
      width: '80vw',
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        const editedPost = (
          document.getElementById('swal-textarea') as HTMLTextAreaElement
        ).value;
        this.commonService.sharedViaLinkedin(editedPost); // Use edited post content
      }
    });
  }

  generatedImage: string | null = null;
  // The job URL to share
  instagramInstructions = '';

  generateImage() {
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Blue band
      ctx.fillStyle = '#162444';
      ctx.fillRect(0, 0, canvasWidth, 80);

      // Load and draw logo
      const logo = new Image();
      logo.src = 'assets/images/Logo-White.png'; // Replace with the correct path to your logo
      logo.onload = () => {
        const logoMaxWidth = 200; // Maximum width for the logo
        const logoMaxHeight = 60; // Maximum height for the logo
        const aspectRatio = logo.width / logo.height;

        let logoWidth = logoMaxWidth;
        let logoHeight = logoMaxHeight;

        // Adjust logo size to maintain aspect ratio
        if (logo.width > logo.height) {
          logoHeight = logoMaxWidth / aspectRatio;
        } else {
          logoWidth = logoMaxHeight * aspectRatio;
        }

        const logoX = (canvasWidth - logoWidth) / 2; // Center horizontally
        const logoY = (80 - logoHeight) / 2; // Center vertically in the blue band
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

        // Add Title
        ctx.font = '20px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText('Job Opportunity', 20, 110);

        // Add Role
        ctx.font = '18px Arial';
        ctx.fillStyle = '#333333';
        ctx.fillText(`Role: ${this.requirement.role?.name}`, 20, 160);

        // Add Requirements with word wrapping
        const plainText = this.requirement.mandatorySkill.replace(/<\/?[^>]+(>|$)/g, '')
        const mandatorySkill = `Requirements: ${plainText}`;
        ctx.font = '15px Arial';
        ctx.fillStyle = '#555555';
        this.wrapText(ctx, mandatorySkill, 20, 200, canvasWidth - 40, 20);

        // Convert to image and update change detection
        this.generatedImage = canvas.toDataURL('image/png');
        this.cdr.detectChanges();
      };
    }
  }

  wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

}
