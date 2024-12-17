import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { Options } from '@angular-slider/ngx-slider';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit {
  user: any;
  isRspp: any;
  rssppMandateLabel = 'Mandates';
  @ViewChild('addModal') addModal: any;
  @ViewChild('createMandate') createMandate: any;
  @ViewChild('discoveryWindow') discoveryWindow: any;
  @ViewChild('discoverTalent') discoverTalent: any;
  @ViewChild('apprspp') apprspp: any;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', active: false, link: '/' },
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Workspace', active: true, link: '/recr/wp' },
    ]; //this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Modals', active: true }];
    document.getElementById('elmLoader')?.classList.add('d-none');
    this.user = this.commonService.user; //JSON.parse(localStorage.getItem("user") + "");
    this.loadCommunityMembers();
    this.loadMyMembership();
    this.getJobFamilies();
    this.loadAvaialbleSectors();
  }
  initRspp(): void {
    if (this.rssppMandateLabel == 'Rspp') {
      this.apprspp.message = undefined;
    }
  }
  getRandomColor(): string {
    var temp: any = ['#3BC49B', '#EF4444', '#F97316', '#234569', '#508FC8'];
    var random: any = Math.floor(Math.random() * (4 - 0) + 0);
    return temp[random];
  }
  copyLink(): void {
    var url = this.commonService.uiPrefix + 'recr/open/rspp/'+this.commonService.user.referralCode;
    this.commonService.copyMessage(url);
    this.commonService.showInfoMessage('Info', 'Link copied to clipboard');
  }
  constructor(
    public commonService: PieworksCommonService,
    private router: Router
  ) {
    if (window.location.toString().indexOf('rspp') > 0) {
      this.isRspp = true; //this.commonService.getParameterFromUrl("isRspp");
      this.rssppMandateLabel = 'Rspp';
    }
    this.communityId = localStorage.getItem('communityId');
    this.status = [];
    this.urlPrefix = this.commonService.urlPrefix;
    if (localStorage.getItem('reqFilter') != null) {
      var temp: any = [];
      temp = localStorage.getItem('reqFilter')?.split('::'); //this.searchText+"::"+this.client+"::"+this.minLpa+"::"+this.maxLpa+"::"+this.status+"::"+this.clientAnchorIds+"::"+this.creationMonth
      if (temp[0] != undefined) this.searchText = temp[0];
      if (temp[1] != undefined) this.client = temp[1];
      if (temp[2] != undefined) this.minLpa = parseInt(temp[2]);
      if (temp[3] != undefined) this.maxLpa = parseInt(temp[3]);
      if (temp[4] != undefined) {
        var longArray = temp[4].split(',');
        for (var i = 0; i < longArray.length; i++)
          this.status.push(parseInt(longArray[i]));
      }
      if (temp[5] != undefined) {
        var longArray: any = [];
        longArray = temp[5].split(',');
        for (var i = 0; i < longArray.length; i++) {
          if (parseInt(longArray[i] + '') > 0)
            this.clientAnchors.push(parseInt(longArray[i]));
        }
      }
      if (temp[6] != undefined) {
        this.creationMonth = temp[6];
      }
    }
    this.loadStatus();
    this.loadClients();
    this.loadCommunityMembers();
    this.filterChanged();
    window.onscroll = (ev) => {
      this.scrollListener(ev);
    };
    if (this.commonService.isMobileDevice) this.showFilter = false;
    this.loadFeed();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
    window.onscroll = (ev) => {};
  }
  btnSelect1: boolean = false;

  btnSelected1() {
    this.btnSelect1 = true;
  }
  // for showing the discover window model
  disWin(): void {
    this.discoveryWindow.show();
    this.discoverTalent.loadAllDetails(this.selectedReq.id);
    this.discoverTalent.initValues();
  }

  clientAnchorsFromCache: any = [];
  scrollListener(event: any): void {
    if (this.block) return;
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 1000
    ) {
      // you're at the bottom of the page
      if (this.scrollPosition != window.innerHeight + window.scrollY) {
        this.block = true;
        this.scrollPosition = window.innerHeight + window.scrollY;
        this.next();
      }
    }
    this.scrollY = window.scrollY;
  }
  block = false;
  creationMonth = '';
  scrollPosition = 0;
  scrollY = 0;
  membersArray: any = [];
  clientAnchors: any = [];
  memberSearch = '';
  member: any;
  loadCommunityMembers(): void {
    this.commonService.showProcessingIcon();
    var acceptanceByAceValues = '1';
    var acceptanceByAceMakerValues = '1';
    this.commonService
      .get(
        'mainservice/framework/members2/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=' +
          acceptanceByAceValues +
          '&searchText=' +
          this.memberSearch +
          '&acceptanceByAceMakerValues=' +
          acceptanceByAceMakerValues +
          '&userId=-1' +
          '&pageNum=1' +
          '&pageSize=10&approvedOnMonth=&jobFamily='
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.membersArray = data['dataArray'];
        }
        this.checkIfIamAceMaker();
        //this.fillSelectedClientAnchors();
      });
  }
  onMemberSearch(item: any) {
    this.memberSearch = item.term;
    this.loadCommunityMembers();
  }


  formatToIndianCurrency(amount: number): string {
    if (amount !== null && amount !== undefined) {
      const amountString = amount.toString();
      const lastThree = amountString.substring(amountString.length - 3);
      const otherNumbers = amountString.substring(0, amountString.length - 3);
  
      if (otherNumbers !== '') {
        // Add commas after every two digits in the otherNumbers part
        const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        return formattedOtherNumbers + "," + lastThree;
      } else {
        return lastThree;
      }
    }
    return '';
  }
  
  // when client is already loaded locally then this method made it local search
  memberLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }
  loadMyMembership(): void {
    if (this.member) return;
    if (!this.searchText) this.searchText = '';
    this.commonService
      .get(
        'mainservice/framework/members/' +
          this.communityId +
          '?acceptanceByAceValues=0,1,2,3,4,5,6,7,8,9,10&acceptanceByAceMakerValues=0,1,2,3,4,5,6,7,8,9,10&userId=' +
          this.commonService.user.id +
          '&roleInCommunity=0,1'
      )
      .subscribe((data: any) => {
        var temp = data['dataArray'];
        this.member = temp[0];
        this.myProfile = this.member.user;

        if (
          this.member.acceptanceByAce == 1 &&
          this.member.acceptanceByAceMaker == 1
        ) {
          this.iamConfirmedMember = true;
        }
        if (this.member.isAceMaker) {
          this.amIAceMaker = true;
        }
      });
  }
  amIAceMaker = false;
  myProfile: any;
  users: any = [];
  iamConfirmedMember = false;
  checkIfIamAceMaker(): void {
    this.amIAceMaker = false;
    this.users = [];
    for (var i = 0; i < this.membersArray.length; i++) {
      this.users.push(this.membersArray[i].user);
      if (this.membersArray[i].id.userId == this.user.id) {
        this.myProfile = this.membersArray[i].user;
        if (this.membersArray[i].acceptanceByAceMaker == 1)
          this.iamConfirmedMember = true;
      }
      if (
        this.membersArray[i].isAceMaker &&
        this.membersArray[i].id.userId == this.user.id
      ) {
        this.amIAceMaker = true;
        //break;
      }
    }

    //this.loadRequirements(false);
  }
  fillSelectedClientAnchors(): void {
    for (var i = 0; i < this.clientAnchors.length; i++) {
      for (var j = 0; j < this.membersArray.length; j++) {
        if (this.clientAnchors[i] == this.membersArray[j].user.id)
          this.clientAnchors[i] = this.membersArray[j];
      }
    }
  }
  communityId: any;
  @Input() callbackFunction: any; // (args: any) => void;
  @Input() parentObj: any;
  thisObj = this;
  loadMenuItems(): void {
    this.menuOptions = [];
    if (this.parentObj) {
      this.menuOptions.push('Select');
    }
    if (this.commonService.rbac['details']) this.menuOptions.push('Details');
    if (this.isRspp && this.commonService.rbac['rspp-create-mandate'])
      this.menuOptions.push('Create Mandate');
    if (this.isRspp) this.menuOptions.push('View RSPP');
    if (this.isRspp) this.menuOptions.push('Copy editable link');

    if (!this.isRspp) {
      if (this.commonService.rbac['join-pod'])
        this.menuOptions.push('Join Pod');
      //      if (this.commonService.rbac['discover-candidate'])
      //        this.menuOptions.push('Discover Candidate');
      if (this.commonService.rbac['discoveries'])
        this.menuOptions.push('Discovered Candidates');
      //        if (this.commonService.rbac['commit-on-discovery'])
      //            this.menuOptions.push("Commit On Discovery");
      if (this.commonService.rbac['view-rspp'])
        this.menuOptions.push('View RSPP');
      if (this.commonService.rbac['view-timeline'])
        this.menuOptions.push('View Timeline');
      if (!this.selectedReq) return;
      if (this.commonService.rbac['mark-as-focus'] || this.amIAceMaker) {
        var present = false;
        for (var i = 0; i < this.feeds.length; i++) {
          if (this.feeds[i].typeId == this.selectedReq.id) present = true;
        }
        if (!present) this.menuOptions.push('Mark as focus for current week');
        else this.menuOptions.push('Remove from focus for current week');
      }
    }
  }
  tableView = false;
  showFilter = true;
  urlPrefix = '';
  paginationMessage = '';
  status: any = [2, 3, 8];
  searchText = '';
  statusArray = [];
  loadStatus(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/recruitment/status')
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.mandates = [];
        if (data['result'] === 200) {
          this.statusArray = data['dataArray'];
        }
      });
  }
  reqHandle: any;
  clearFilters(): void {
    this.status = [];
    this.clientAnchors = [];
    this.status.push(parseInt('2'));
    this.status.push(parseInt('3'));
    this.status.push(parseInt('8'));
    this.searchText = '';
    this.client = '';
    this.onlyWithFeeds = false;
    this.minLpa = 1;
    this.maxLpa = 200;
    this.pageNum = 1;
    this.havingPendingPositions = 'na';
    this.havingClosedPositions = 'na';
    this.loadRequirements(true);
    this.creationMonth = '';
    this.selectedJobFamilyIds = undefined;
    this.selectedSectors = undefined;
  }
  analysis: any = {};
  havingPendingPositions = 'na';
  havingClosedPositions = 'na';
  onlyWithFeeds = false;
  loadReqsWithFeeds(): void {
    this.loadRequirements(true);
  }
  clientSearch = '';
  onClientSearch(item: any) {
    this.clientSearch = item.term;
    this.loadClients();
  }

  clientLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }
  jobFamiliesL1: any = [];
  getJobFamilies() {
    var url = 'mainservice/recruitment2/open/loadJobFamily?parentId=0';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200 && data['dataArray'] != null) {
        this.jobFamiliesL1 = data['dataArray'];
      }
    });
  }

  availableSectors: any = [];
  loadAvaialbleSectors(): void {
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
  selectedSectors: any;
  selectedJobFamilyIds: any;
  loadingMessage:any = '';
  loadRequirements(filterChanged: any): void {
    if (!this.iamConfirmedMember) {
      return;
    }
    if (this.reqHandle) {
      this.reqHandle.unsubscribe();
    }
    if (!this.status || this.status.length == 0) {
      this.status.push(2);
      this.status.push(3);
      this.status.push(8);
    }

    var localClientAnchors: any = this.clientAnchors.toString();
    if (this.clientAnchors.length === 0) localClientAnchors = '-1';
    var url =
      'mainservice/recruitment/requirements/' +
      this.communityId +
      '?clientAnchorIds=' +
      localClientAnchors +
      '&pageNum=' +
      this.pageNum +
      '&pageSize=' +
      this.pageSize;
    if (this.amIAceMaker || this.commonService.rbac['history-mandates'])
      url = url + '&statusId=' + this.status;
    else {
      url = url + '&statusId=2,3,8,9,10'; //open and open_hot
    }
    if (this.isRspp) url = url + ',7';
    url = url + '&creationMonth=' + this.creationMonth;
    url = url + '&searchText=' + this.searchText;
    url = url + '&onlyWithFeeds=' + this.onlyWithFeeds;
    url =
      url +
      '&client=' +
      this.client +
      '&minLpa=' +
      this.minLpa +
      '&maxLpa=' +
      this.maxLpa +
      '&havingPendingPositions=' +
      this.havingPendingPositions +
      '&havingClosedPositions=' +
      this.havingClosedPositions +
      '&includeOfferedCandidates=true';
    if (this.isRspp) url = url + '&isRspp=yes';
    else url = url + '&isRspp=no';

    if (this.selectedSectors) url = url + '&sectors=' + this.selectedSectors;

    if (this.selectedJobFamilyIds)
      url = url + '&jobFamilyIds=' + this.selectedJobFamilyIds;

    this.commonService.showProcessingIcon();
    console.log(filterChanged);

    this.loadingMessage = "just a minute, getting it for you..."
    this.reqHandle = this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (filterChanged) {
        this.mandates = [];
      }
      if (data['result'] === 200) {
        this.analysis = data['dataObject'];
        this.block = false;
        //this.mandates = this.mandates.concat(data["dataArray"]);
        this.paginationMessage = data['message'];
        var newBatch = data['dataArray'];

        for (var i = 0; i < newBatch.length; i++) {
          if (newBatch[i].activeFrom) {
            var dateParts = newBatch[i].activeFrom.split('-');
            if (dateParts.length < 3) continue;
            var d1 = new Date(); //this.requirement[i].activeFrom
            d1.setFullYear(
              parseInt(dateParts[0]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[2])
            );
            var d2 = new Date();
            var daysOld = Math.ceil(
              (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (daysOld > 1) newBatch[i].daysOld = daysOld + ' days ago';
            else newBatch[i].daysOld = daysOld + ' day ago';
            if (newBatch[i].status.id == 2 || newBatch[i].status.id == 3) {
              newBatch[i].colorCode = 'grey';
              if (daysOld >= 30 && daysOld < 60)
                newBatch[i]['colorCode'] = '#FFBF00';
              else if (daysOld >= 60) newBatch[i]['colorCode'] = 'red';
            }
          }
        }
        this.mandates = this.mandates.concat(newBatch);

        if(this.mandates.length == 0)
        this.loadingMessage = "Sorry there is no data for your search..."
      }
      if (this.mandates.length === 0 && this.pageNum > 1) {
        this.pageNum = this.pageNum - 1;
      }

      localStorage.removeItem('reqFilter');
      localStorage.setItem(
        'reqFilter',
        this.searchText +
          '::' +
          this.client +
          '::' +
          this.minLpa +
          '::' +
          this.maxLpa +
          '::' +
          this.status +
          '::' +
          localClientAnchors +
          '::' +
          this.creationMonth
      );
    });
  }
  exportToXls(): void {
    var localClientAnchors = this.clientAnchors.toString();
    if (this.clientAnchors.length === 0) localClientAnchors = '-1';
    var url = 'mainservice/recruitment/requirements/export/' + this.communityId;
    url =
      url +
      '?clientAnchorIds=' +
      localClientAnchors +
      '&statusId=' +
      this.status;
    url = url + '&creationMonth=' + this.creationMonth;
    url = url + '&searchText=' + this.searchText;
    url = url + '&onlyWithFeeds=' + this.onlyWithFeeds;
    url =
      url +
      '&client=' +
      this.client +
      '&minLpa=' +
      this.minLpa +
      '&maxLpa=' +
      this.maxLpa +
      '&havingPendingPositions=' +
      this.havingPendingPositions +
      '&havingClosedPositions=' +
      this.havingClosedPositions +
      '&includeOfferedCandidates=true';
    if (this.reqHandle) {
      this.reqHandle.unsubscribe();
    }
    this.commonService.showProcessingIcon();
    this.reqHandle = this.commonService
      .getBlob(url)
      .subscribe((response: any) => {
        this.commonService.hideProcessingIcon();
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        var filename =
          'requirements_' +
          this.commonService.getFormatedDate(new Date(), 'dd-MM-YYYY') +
          '.xlsx';
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }
  pageNum = 1;
  pageSize = 12;
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
    this.loadRequirements(false);
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
    this.loadRequirements(false);
  }
  first(): void {
    this.pageNum = 1;
    this.loadRequirements(false);
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
    this.loadRequirements(false);
  }
  filterChanged(): void {
    this.mandates = [];
    setTimeout(() => {
      if (this.minLpa < 0) {
        this.minLpa = 0;
        return;
      }
      if (this.maxLpa < 0) {
        this.maxLpa = 0;
        return;
      }
      this.pageNum = 1;
      if (this.membersArray.length == 0) {
        this.loadCommunityMembers();
      }
      {
        console.log('calling from here');
        this.loadRequirements(true);
      }
    }, 1000);
  }
  clientHandle: any;
  clients: any = [];
  client = '';
  loadClients(): void {
    if (this.clientHandle) this.clientHandle.unsubscribe();
    this.commonService.showProcessingIcon();
    this.clientHandle = this.commonService
      .get(
        'mainservice/framework/client?searchText=' +
          this.clientSearch +
          '&communityId=' +
          this.communityId
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.clients = [];
        if (data['result'] === 200) {
          this.clients = data['dataArray'];
        }
      });
  }

  joinPod(): void {
    this.loadMenuItems();
    this.handleMenu('Join Pod');
    // this.confirmAndProceed('Confirmation required', 'Would you like to bet on yourself to hire for ' + this.selectedReq?.role?.name + ',' + this.selectedReq?.client?.name + ' ?', this, "saveAcesResponsible");
  }

  copyEditableLinkForClient(reqId: any): void {
    var url = this.commonService.uiPrefix + 'recr/open/rspp/' + reqId.id;
    this.commonService.copyMessage(url);
    this.commonService.showInfoMessage('Info', 'Link copied to clipboard');
  }

  nothing(): void {}
  menuOptions: any = [];
  selectedReq: any;
  menuAction: any = '';
  handleMenu(option: any): void {
    this.menuAction = option;
    switch (option) {
      case 'Create Mandate':
        //this.createMandate.rspp = this.selectedReq;
        this.addModal.show();
        break;
      case 'Details':
        if (this.isRspp)
          this.router.navigate(['recr/rspp/' + this.selectedReq.id]);
        else this.router.navigate(['recr/wp/' + this.selectedReq.id]);
        break;
      case 'Discover Candidate':
        this.router.navigate([
          'community/' +
            localStorage.getItem('communityId') +
            '/domain/recruitment/newCandidate/' +
            this.selectedReq.id,
        ]);
        break;
      case 'Discovered Candidates':
        this.router.navigate(['/recr/discoveries/' + this.selectedReq.id]);
        break;
      case 'Commit On Discovery':
        this.showCommitmentWindow();
        break;
      case 'Select':
        this.parentObj.selectedRequirements(this.selectedReq);
        break;
      case 'Copy editable link':
        this.copyEditableLinkForClient(this.selectedReq);
        break;
      case 'Join Pod':
        this.confirmAndProceed(
          'Confirmation required',
          'Would you like to bet on yourself to hire for ' +
            this.selectedReq.role?.name +
            ',' +
            this.selectedReq.client?.name +
            ' ?',
          this,
          'saveAcesResponsible'
        );
        break;
      case 'View Timeline':
        this.router.navigate(['recr/wp/' + this.selectedReq.id + '/timeline']);
        break;
      case 'Mark as focus for current week':
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
        this.router.navigate(['recr/rspp-view/' + this.selectedReq.id]);
        break;
    }
  }
  includeInFeed(): void {
    var feed = {
      icon: this.selectedReq.client.icon,
      title: 'Mandate on focus.',
      description:
        this.selectedReq.role.name +
        '#' +
        this.selectedReq.minLpa +
        ' LPA - ' +
        this.selectedReq.maxLpa +
        ' LPA, ' +
        '#' +
        this.selectedReq.location +
        '#' +
        this.selectedReq.client.name,
      link:
        'community/' +
        localStorage.getItem('communityId') +
        '/domain/recruitment/requirements/' +
        this.selectedReq.id,
      communityId: this.communityId,
      type: 'requirement',
      typeId: this.selectedReq.id,
      userId: -1,
    };
    console.log(feed);
    // Caused by: java.sql.SQLIntegrityConstraintViolationException: Column 'created_on' cannot be null
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
            "Couldn't mark mandate as focus for the current week. Please try again later."
          );
        this.commonService.hideProcessingIcon();
        this.loadFeed();
      });
  }
  removeFromFeed(): void {
    var feed = { type: 'requirement', typeId: this.selectedReq.id };
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
            "Couldn't remove requirement from feed. Please try again later."
          );
        this.commonService.hideProcessingIcon();
        this.loadFeed();
        this.loadRequirements(true);
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
  showCommitmentWindow(): void {}
  acesResponsibleForNgModel: any = [];
  loadAcesResponsible(req: any, event: any): void {
    this.commonService.showProcessingIcon();
    this.acesResponsibleForNgModel = [];
    this.commonService
      .get('mainservice/recruitment/acesResponsible/' + req.id)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        var acesResponsible: any = [];
        if (data['result'] === 200) {
          acesResponsible = data['dataArray'];
          req.podMembers = '';
          for (var i = 0; i < acesResponsible.length; i++) {
            this.acesResponsibleForNgModel.push(acesResponsible[i].user);
            req.podMembers =
              req.podMembers + acesResponsible[i].user?.name + ', ';
          }
          if (req.podMembers.length > 0)
            req.podMembers = req.podMembers.substring(
              0,
              req.podMembers.length - 2
            );
        }
      });
  }
  acesResponsibleToBeSaved: any = [];
  saveAcesResponsible(): void {
    if (
      this.selectedReq.podMembers &&
      this.selectedReq.podMembers.indexOf(this.user.name) != -1
    ) {
      this.commonService.showErrorMessage(
        'Error',
        'You are already part of this Pod.'
      );
      return;
    }
    var ace = {
      recruitmentRequirement: this.selectedReq,
      user: this.myProfile,
    };
    this.acesResponsibleToBeSaved = []; //its an arry of user object
    this.acesResponsibleToBeSaved.push(ace);
    this.commonService.showInfoMessage('Info', 'Submited request ');
    this.commonService
      .post(
        'mainservice/recruitment/acesResponsible/' +
          this.selectedReq.id +
          '?deleteOld=no',
        this.acesResponsibleToBeSaved
      )
      .subscribe((data: any) => {
        if (
          this.selectedReq.podMembers &&
          this.selectedReq.podMembers.length > 0
        )
          this.commonService.showSuccessMessage(
            'Update',
            'Congrats, now you are teaming up with ' +
              this.selectedReq.podMembers +
              ' for ' +
              this.selectedReq.role.name +
              ', ' +
              this.selectedReq.client.name
          );
        else
          this.commonService.showSuccessMessage(
            'Update',
            'Congrats, now you are now part of the Pod for ' +
              this.selectedReq.role.name +
              ', ' +
              this.selectedReq.client.name
          );
        this.commonService.hideProcessingIcon();
        var link = 'recr/wp' + this.selectedReq.id;
        this.commonService.sendNotification(
          this.selectedReq.clientAnchor.id,
          this.myProfile.name +
            ' has joined the POD for ' +
            this.selectedReq.role.name +
            ', ' +
            this.selectedReq.client.name,
          link,
          'COMMUNITY MEMBER',
          1,
          0
        );
      });
  }
  minLpa = 1;
  maxLpa = 200;
  loadCommitments(requirement: any, event: any): void {
    if (requirement.commitments && requirement.commitments.length > 0) {
      //this.commonService.showToolTip(requirement.commitments,event);
      return;
    }
    var url = 'mainservice/recruitment/commitments/' + requirement.id;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        requirement.commitments = '';
        for (var i = 0; i < data['dataArray'].length; i++) {
          if (i == 0)
            requirement.commitments =
              data['dataArray'][i].commitedBy.name +
              '-' +
              data['dataArray'][i].remarks;
          else
            requirement.commitments =
              requirement.commitments +
              ',' +
              data['dataArray'][i].commitedBy.name +
              ' - ' +
              data['dataArray'][i].remarks;
        }
        if (data['dataArray'].length == 0)
          requirement.commitments = 'No commits yet';
        //this.commonService.showToolTip(requirement.commitments,event);
      }
    });
  }
  feeds: any = [];
  loadFeed(): void {
    this.commonService
      .get(
        'mainservice/framework/feedsByTypeAndCommunity?communityId=' +
          this.communityId +
          '&type=requirement'
      )
      .subscribe((data: any) => {
        this.feeds = data['dataArray'];
        this.loadMenuItems();
      });
  }

  // bread crum items
  breadCrumbItems!: Array<{}>;
  mandates: any = [];
  starredproduct(index: any, event: any, starred: any): any {}
  editList(index: any): void {}
  removeItem(index: any): void {}
  doubleClickCounter = 0;
  clickedOnMandate(req: any): void {
    this.doubleClickCounter++;
    if (this.doubleClickCounter >= 2) this.doubleClicked(req);
    setTimeout(() => {
      this.doubleClickCounter = 0;
    }, 300);
  }
  doubleClicked(req: any): void {
    if (this.isRspp) {
      this.router.navigate(['recr/rspp/' + req.id]);
    } else {
      localStorage.setItem(
        'discFilter',
        '-1::-1::::-1::-1::-1::false::0::500::0::50::-1::::::false'
      );
      this.router.navigate(['recr/wp/' + req.id]);
    }
  }
  sliderOptions: Options = {
    floor: 0,
    ceil: 200,
    disabled: false,
  };
  defaultdate: any = new Date();
  date: any;


}
