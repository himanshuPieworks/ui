import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-client-rspp',
  templateUrl: './client-rspp.component.html',
  styleUrls: ['./client-rspp.component.scss']
})
export class ClientRsppComponent {

  user: any;
  breadCrumbItems: any = [];
  submitted = false;
  currentStep = 'Basic details';
  rsppId: any;
  completedStep1: boolean = false;
  completedStep2 = false;
  completedStep3 = false;
  completedStep4 = false;
  @Input('parentObj') parentObj: any;
  processes: any = [];
  processString: any = '';
  isOpenUrl: boolean = false;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', active: false, link: '/' },
      { label: 'Workspace', active: true, link: '/recr/wp' },
    ]; //this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Modals', active: true }];
    this.user = JSON.parse(localStorage.getItem('user') + '');

    //        this.loadClients();
    this.loadRoles();
    this.loadJobFamilyForDropdown(1);
  }
  rsppHandle: any;
  
  onRsppClientSelect(): void {
    setTimeout(() => {
      if (!this.requirement) return;
      this.requirement.companyWriteup1 = '';
      this.requirement.companyWriteup2 = '';
      this.requirement.companyWriteup3 = '';
      var url =
        'mainservice/recruitment/requirements/2?clientAnchorIds=-1&pageNum=1&pageSize=1&statusId=1,2,3,4,5,6,7,8,9,10&creationMonth=&searchText=' +
        this.requirement.orgName +
        '&onlyWithFeeds=false&client=&minLpa=1&maxLpa=200&havingPendingPositions=na&havingClosedPositions=na&includeOfferedCandidates=true&isRspp=yes';
      this.commonService.showProcessingIcon();
      this.rsppHandle = this.commonService.get(url).subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          let oldMandate = data['dataArray'];
          if (oldMandate && oldMandate.length > 0) {
            this.requirement.companyWriteup1 = oldMandate[0].companyWriteup1;
            this.requirement.companyWriteup2 = oldMandate[0].companyWriteup2;
            this.requirement.companyWriteup3 = oldMandate[0].companyWriteup3;
          }
          if (data['dataArray'].length == 0) {
            url =
              'mainservice/recruitment/requirements/2?clientAnchorIds=-1&pageNum=1&pageSize=1&statusId=1,2,3,4,5,6,7,8,9,10&creationMonth=&searchText=' +
              this.requirement.orgName +
              '&onlyWithFeeds=false&client=&minLpa=1&maxLpa=200&havingPendingPositions=na&havingClosedPositions=na&includeOfferedCandidates=true&isRspp=no';
            this.commonService.showProcessingIcon();
            this.rsppHandle = this.commonService
              .get(url)
              .subscribe((data: any) => {
                this.commonService.hideProcessingIcon();
                if (data['result'] === 200) {
                  let oldMandate = data['dataArray'];
                  if (oldMandate && oldMandate.length > 0) {
                    this.requirement.companyWriteup1 =
                      oldMandate[0].companyWriteup1;
                    this.requirement.companyWriteup2 =
                      oldMandate[0].companyWriteup2;
                    this.requirement.companyWriteup3 =
                      oldMandate[0].companyWriteup3;
                  }
                  
                }
              });
          }
        }
      });
    }, 200);
  }
  zeroVariable = false;
  setMinVariable(): void {
    setTimeout(() => {
      if (this.zeroVariable) {
        this.minVariableLpa = 0;
        this.maxVariableLpa = 0;
      }
    }, 200);
  }
  onSlide(event: any) {
    this.zeroVariable = false;
  }
  constructor(
    public commonService: PieworksCommonService,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient
  ) {
    if (window.location.toString().indexOf('open') > -1) this.isOpenUrl = true;
    this.rsppId = this.route.snapshot.paramMap.get('id');

    if (this.rsppId) this.loadRspp();
    //this.loadJobFamilyForDropdown(1);
    this.httpClient.get('assets/json/cities.json').subscribe((data: any) => {
      this.locations = data.cities;
    });
  }
  initVariables(): void {
    this.workModes = [
      { name: 'WFH' },
      { name: 'WFO' },
      { name: 'Hybrid' },
      { name: 'Community' },
    ];
    this.locations = [];
    this.selectedLocations = [];
    this.requirement = {};
    this.writeup1 = undefined;
    this.writeup2 = undefined;
    this.writeup3 = undefined;
    this.valuesArray = [];
    this.selectedValueSet1 = undefined;
    this.selectedValueSet2 = undefined;
    this.selectedValueSet3 = undefined;
    this.submitted = false;
    this.currentStep = 'Basic details';
    this.completedStep1 = false;
    this.completedStep2 = false;
    this.completedStep3 = false;
    this.completedStep4 = false;
  }
  workModes = [
    { name: 'WFH' },
    { name: 'WFO' },
    { name: 'Hybrid' },
    { name: 'Community' },
  ];
  locations = [];
  selectedLocations = [];
  requirement: any = {};
  writeup1: any;
  writeup2: any;
  writeup3: any;
  otherJobFamily = false;
  otherJobFamilyChange() {
    this.otherJobFamily = true;
    console.log(this.otherJobFamily);
  }
  change(event: any) {
    this.submitted = true;
    console.log(event);
  }
  clientHandle: any;
  clients: any = [];
  clientSearchText: any = '';
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
  validatePage1Completion(): void {
    this.completedStep1 = false;
    /*if (!this.parentObj.isRspp && !this.requirement.client) {
            this.completedStep1 = false;
            return;
        }*/
    if (
      this.requirement.orgName&&
      this.requirement.roleDescr &&
      this.roleSearchText&&
      this.selectedLocations &&
      this.maxFixedLpa
      //      &&
      //      this.requirement.companyWriteup1 &&
      //      this.requirement.companyWriteup2 &&
      //      this.requirement.companyWriteup3
    )
      this.completedStep1 = true; //if same client has that then it will come
  }
  validatePage2Completion(): void {
    this.completedStep2 = false;
    if (
      (this.selectedJobFamilyL1 || this.otherJobFamilyL1) &&
      (this.selectedJobFamilyL2 || this.otherJobFamilyL2) &&
      this.roleSearchText &&
      this.selectedLocations &&
      this.maxFixedLpa
    ) {
      this.completedStep2 = true;
    }
    // if (this.roleSearchText && this.selectedLocations && this.maxFixedLpa)
    //   this.completedStep2 = true;
  }
  validatePage3Completion(): void {
    this.completedStep3 = false;
    if (
      this.requirement.orgLevel &&
      this.requirement.totalOrgLevels &&
      this.requirement.experience != undefined &&
      this.requirement.workMode &&
      this.requirement.mandatorySkill
    )
      this.completedStep3 = true;
  }
  validatePage4Completion(): void {
    this.completedStep4 = false;
    if (
      this.selectedValueSet1 &&
      this.selectedValueSet2 &&
      this.selectedValueSet3
    )
      this.completedStep4 = true;
  }
  filterClients() {
    let element = document.getElementById('ngSelectId') as HTMLInputElement;
    this.clientSearchText = element.value;
    this.loadClients();
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
            } else if (level == 2) {
              this.jobFamiliesL2 = data['dataArray'];
              for (var i = 0; i < this.jobFamiliesL2.length; i++) {
                if (
                  this.jobFamiliesL2[i].id == this.requirement.jobFamily?.id
                ) {
                  this.selectedJobFamilyL2 = this.jobFamiliesL2[i];
                  break;
                }
              }
            } else if (level == 3) {
              this.jobFamiliesL3 = data['dataArray'];
            }
          }
        }
      });
    }, 500);
  }
  roleHandle: any;
  roles: any = [];
  roleSearchText: any = '';
  loadRoles(): void {
    if (this.roleHandle) this.roleHandle.unsubscribe();
    this.commonService.showProcessingIcon();
    this.roleHandle = this.commonService
      .get(
        'mainservice/recruitment2/open/role?searchText=' + this.roleSearchText
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.roles = [];
        if (data['result'] === 200) {
          this.roles = data['dataArray'];
        }
      });
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
  };
  updateTotalLpa(): void {
    this.requirement.minLpa =
      this.requirement.minFixedLpa + this.requirement.minVariableLpa;
    this.requirement.maxLpa =
      this.requirement.maxFixedLpa + this.requirement.maxVariableLpa;
  }
  minFixedLpa = 1;
  maxFixedLpa = 1;
  minVariableLpa = 1;
  maxVariableLpa = 1;
  valueSets: any = [
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
    if (!value) return;
    value.selected = !value.selected;
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

  saveRoleIfRequiredAndPostRequirement(): void {
    var role = { name: this.roleSearchText.trim() };
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment2/open/role', role)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.requirement.role = data['dataObject'];
          setTimeout(() => {
            this.postRequirement();
            
              this.commonService.sendNotification(
                this.requirement.createdBy,
                'A RSPP has been Created by the Client.',
                '/recr/rspp' + this.requirement.id,
                'COMMUNITY MEMBER',
                1,
                0
              );

              //var url = 'recr/open/rspp-view/' + this.rsppId;
              //this.commonService.navigateTo(url, { showBudget: true });
            
          }, 500);
        }
      });
  }
  /*
   * fields to be added to GUI - status,noOfVaccancy, retainer fee, client and standby anchors.
   * additional info, option to attach file., selection rounds.
   */
  postRequirement(): void {
    this.valuesArray = [];
    if (this.selectedValueSet1.value)
      this.valuesArray.push(this.selectedValueSet1.value);
    if (this.selectedValueSet2.value)
      this.valuesArray.push(this.selectedValueSet2.value);
    if (this.selectedValueSet2.value)
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
    if (this.requirement.clientAnchor)
      this.requirement.clientAnchorId = this.requirement.clientAnchor.id;
    if (this.requirement.standbyClientAnchor)
      this.requirement.standbyClientAnchorId =
        this.requirement.standbyClientAnchor.id;
      //if(!this.requirement.hiringManager)
      {
          this.requirement.hiringManager = {id:1};
      }
    //        this.requirement.client.id = this.requirement.clientId;
    //this.requirement.role.id = this.requirement.roleId;
    this.requirement.statusId = 3; //this.requirement.status.id;
    if (!this.requirement.retainerFee) this.requirement.retainerFee = 0;
    this.commonService.showProcessingIcon();
    this.requirement.jobFamily = this.selectedJobFamilyL2;

    var date = new Date();
    this.requirement['uniqueId'] = this.getUniqueId();
    if (this.requirement['id'] === undefined) {
      this.requirement['id'] = 0;
      this.requirement['statusId'] = 2; //this.requirement["status"].id;
      this.requirement.clientId = 0;
      //this.requirement["statusId"]=2;//open
      //this.requirement["status"]={id:2};//open
      if (
        localStorage.getItem('communityId') == null ||
        localStorage.getItem('communityId') == undefined
      ) {
        this.requirement['communityId'] = 2;
      } else {
        this.requirement['communityId'] = parseInt(
          localStorage.getItem('communityId') + ''
        );
      }
    }
    //        if(this.requirement.companyWriteup2)
    //            this.requirement.companyWriteup1 = this.requirement.companyWriteup1 + this.requirement.companyWriteup2;
    //        if(this.requirement.companyWriteup3)
    //            this.requirement.companyWriteup1 = this.requirement.companyWriteup1 + this.requirement.companyWriteup3;

    this.requirement.noOfVaccancyPending = this.requirement.noOfVaccancy;
    if (this.requirement.clientAnchor)
      this.requirement.clientAnchorId = this.requirement.clientAnchor.id;
    if (this.requirement.standbyClientAnchor)
      this.requirement.standbyClientAnchorId =
        this.requirement.standbyClientAnchor.id;
    if (!this.requirement.retainerFee) this.requirement.retainerFee = 0;
    this.commonService.showSuccessMessage('Update', 'Posting new RSPP');
    if (
      this.commonService.user &&
      this.commonService.user.id &&
      !this.requirement.id
    ) {
      this.requirement.createdBy = this.commonService.user.id;
    }

    this.commonService
      .post('mainservice/recruitment/open/requirement', this.requirement)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.roles = [];
        if (data['result'] === 200) {
          this.requirement = data['dataObject'];
          this.uploadFile();
          // call the api of other job family
          if(this.otherJobFamily)
            this.saveOtherJobFamily(this.requirement.id);
        } else {
          this.message = 'Couldnt save RSPP. Please try again later.';
          this.commonService.showErrorMessage(
            'Update',
            'Couldnt save RSPP. Please try again later.'
          );
        }
      });
  }

  checkJobFamilyName:any;
  checkNewJobFamilyName(l1l2:any): void{
    let url = 'mainservice/framework2/forward?api=recruitmentservice/requirement/checkJobFamilyByName?name='+this.otherJobFamilyL1;
    if(l1l2=="l2")
        url = 'mainservice/framework2/forward?api=recruitmentservice/requirement/checkJobFamilyByName?name='+this.otherJobFamilyL2;
    this.commonService.get(url).subscribe((data:any)=>{
      this.checkJobFamilyName = data['dataObject'];
        if (this.checkJobFamilyName)
        {
            this.commonService.showErrorMessage("Error",data['message']);
            if(l1l2=="l1")
                this.otherJobFamilyL1=undefined;
            else
                this.otherJobFamilyL2=undefined;
        }
        this.validatePage2Completion();
    })
  }
  saveOtherJobFamily(reqId:any): void {
    let url = 'mainservice/recruitment3/requirement/linkOtherJobFamily';
    let body = {
      jobFamilyL1: this.otherJobFamilyL1 ? this.otherJobFamilyL1 : this.selectedJobFamilyL1.name,
      jobFamilyL2:  this.otherJobFamilyL2,
      reqId: reqId,
    };
    this.commonService
      .post(url, body)
      .subscribe((data: any) => {});
  }

  getUniqueId(): string {
    var clientCode = '00'; //this.requirement["client"].name.replaceAll(" ", "_");
    var role = this.requirement['role'].name;
    var parts = this.requirement['role'].name.split(' '); //role
    var roleCode = '';
    for (var i = 0; i < parts.length; i++) {
      roleCode = roleCode + parts[i].charAt(0);
    }
    if (roleCode.length == 1) {
      if (role.length >= 4) roleCode = role.substring(0, 3);
      else roleCode = role;
    }
    var locCode = this.requirement.location;
    if (this.requirement.location.length >= 4)
      locCode = this.requirement.location.substring(0, 3);
    var vac = this.requirement.noOfVaccancy + '';
    if (vac.length == 1) vac = '00' + vac;
    if (vac.length == 2) vac = '0' + vac;
    var d1 = this.commonService.getFormatedDate(new Date(), 'ddMMyyyyhhmmss');
    return (
      clientCode +
      '-' +
      roleCode +
      '-' +
      locCode +
      '-' +
      d1
    ).toUpperCase();
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
  message: any;
  uploadFile() {
    this.message = '';
    const formData: FormData = new FormData();
    if (this.fileToUpload && this.fileToUpload !== null) {
      var fileName = this.fileToUpload.name;
      fileName = this.commonService.removeSpecialChar(fileName, '-.', '-');
      formData.append('image', this.fileToUpload, fileName);
      this.saveRounds(false);
    } else {
      if (this.parentObj) {
        this.parentObj.addModal.hide();
        this.parentObj.clearFilters();
      }
      this.saveRounds(true);
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
      .post2(
        'mainservice/recruitment3/open/uploadMandateFiles',
        formData,
        options
      )
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          setTimeout(() => {
            this.parentObj.addModal.hide();
            this.parentObj.clearFilters();
          }, 500);
          this.initVariables();
          this.message = 'Saved RSPP successfully';
          this.commonService.showSuccessMessage(
            'Update',
            this.parentObj.isRspp
              ? 'Saved RSPP successfully'
              : 'Saved mandate successfully'
          );
        } else {
          this.parentObj.addModal.hide();
          this.parentObj.clearFilters();
          this.initVariables();
          this.message =
            "Saved RSPP successfully.Couldnt upload file':'Saved mandate successfully.Couldnt upload file";
          this.commonService.showSuccessMessage(
            'Update',
            this.parentObj.isRspp
              ? 'Saved RSPP successfully. Couldnt upload file'
              : 'Saved mandate successfully.Couldnt upload file'
          );
        }
      });
  }

  // load rssp using rsspId
  loadRspp(): void {
    var url = 'mainservice/recruitment/open/requirement/' + this.rsppId;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.requirement = data['dataObject'];
        this.loadProcesses();
        this.roleSearchText = this.requirement.role.name;
        this.selectedLocations = this.requirement.location.split(',');
        this.minFixedLpa = this.requirement.minFixedLpa;
        this.minVariableLpa = this.requirement.minVariableLpa;
        this.maxFixedLpa = this.requirement.maxFixedLpa;
        this.updateTotalLpa();
        if (this.requirement.cultureValues) {
          var temp: any = this.requirement.cultureValues.split(',');
          this.clickedValue(this.getValueFromValueSet(temp[0], 0), 0);
          this.clickedValue(this.getValueFromValueSet(temp[1], 1), 1);
          this.clickedValue(this.getValueFromValueSet(temp[2], 2), 2);
        }
        this.validatePage1Completion();
        this.validatePage2Completion();
        this.validatePage3Completion();
        this.validatePage4Completion();
      }
    });
  }
  getValueFromValueSet(valueString: any, setIndex: any): any {
    for (var i = 0; i < this.valueSets[setIndex].values.length; i++) {
      if (this.valueSets[setIndex].values[i].value == valueString) {
        return this.valueSets[setIndex].values[i];
      }
    }
  }

  addProcess(): void {
    if (this.processString && this.processString.length > 0)
      this.processes.push({ process: this.processString });
    this.processString = '';
  }

  saveRounds(initVars: boolean): void {
    var rounds: any = [];
    for (var i = 0; i < this.processes.length; i++) {
      var obj: any = this.processes[i];
      if (!obj.requirement) obj.requirementId = this.requirement.id;
      rounds.push(obj);
    }
    this.commonService
      .post('mainservice/recruitment3/requirement/open/process', rounds)
      .subscribe((data: any) => {
        this.message = 'Saved RSPP successfully';
        this.commonService.showSuccessMessage(
          'Update',
          'Saved RSPP successfully'
        );
        if (initVars) {
          this.initVariables();
        }
      });
  }
  loadProcesses(): void {
    if (!this.requirement || !this.requirement.id) {
      this.processes = [];
      return;
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment3/requirement/open/process/' +
          this.requirement.id
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.processes = [];
        if (data['result'] === 200) {
          this.processes = data['dataArray'];
        }
      });
  }
}
