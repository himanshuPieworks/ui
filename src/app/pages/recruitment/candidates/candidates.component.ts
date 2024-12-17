import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss'],
})
export class CandidatesComponent {
  constructor(
    public commonService: PieworksCommonService,
    private router: Router
  ) {}
  searchText = '';
  paginationMessage = '';
  candidates: any = [];
  futures: any = [];
  communityId: any;
  showFutureOnly = false;
  location = '';
  minExperience = 0;
  maxExperience = 60;
  expectedCtc = 0;
  emailId = '';
  urlPrefix = '';
  startDate: any = undefined;
  endDate: any = undefined;
  breadCrumbItems = [
    { label: 'Home', link: '/', active: false },
    { label: 'Manage', link: '/recr/manage', active: false },
    { label: 'Candidates', link: '/recr/candidates', active: true },
  ];
  ngOnInit(): void {
    this.communityId = localStorage.getItem('communityId');
    this.loadMyMembership();
    this.urlPrefix = this.commonService.urlPrefix;
    if (localStorage.getItem('candFilter') != null) {
      var cf = localStorage.getItem('candFilter') + '';
      var temp = cf.split('::'); //this.searchText+"::"+this.minExperience+"::"+this.maxExperience+"::"+this.expectedCtc
      if (temp[0] != undefined) this.searchText = temp[0];
      if (temp[1] != undefined) this.minExperience = parseInt(temp[1]);
      if (temp[2] != undefined) this.maxExperience = parseInt(temp[2]);
      if (temp[3] != undefined) this.expectedCtc = parseInt(temp[3]);
    }
    this.loadCandidates(true);
    this.loadAvaialbleTags();
    this.loadAvaialbleSectors();
    window.onscroll = (ev) => {
      this.scrollListener(ev);
    };
  }

  @ViewChild('reDiscover') reDiscover: any;

  truncateString(inputString: string, maxLength: number): string {
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.substring(0, maxLength) + '...';
    }
  }
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
        if (this.candidates.length != 0) this.next();
      }
    }
    this.scrollY = window.scrollY;
  }
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
    window.onscroll = (ev) => {};
  }
  block = false;
  scrollPosition = 0;
  scrollY = 0;
  filterChanged(): void {
    this.candidates = [];
    setTimeout(() => {
      if (this.minExperience < 0) {
        this.minExperience = 0;
      }
      if (this.maxExperience < 0) {
        this.maxExperience = 60;
      }
      if (this.expectedCtc < 0) {
        this.expectedCtc = 0;
      }
      this.pageNum = 1;
      this.loadCandidates(true);
    }, 1000);
  }
  reqHandle: any;
  clearFilters(): void {
    this.searchText = '';
    this.location = '';
    this.minExperience = 0;
    this.maxExperience = 60;
    this.expectedCtc = 0;
    this.emailId = '';
    this.showFutureOnly = false;
    this.startDate = undefined;
    this.endDate = undefined;
    //this.loadNonValidatedFutures
    this.loadCandidates(true);
    for (var i = 0; i < this.availableTags.length; i++) {
      if (this.availableTags[i].color) this.availableTags[i].color = undefined;
    }
  }
  loadNonValidatedFutures(): void {
    this.searchText = '';
    this.location = '';
    this.minExperience = 0;
    this.maxExperience = 60;
    this.expectedCtc = 0;
    this.emailId = '';
    this.startDate = undefined;
    this.endDate = undefined;
    this.loadNonValidatedOnes = true;
    this.candidates = [];
    this.pageNum = 1;
    this.loadFutureCandidtes(true);
  }
  totalCandidates: any;
  loadCandidates(filterChanged: any): void {
    if (filterChanged) {
      this.pageNum = 1;
    }
    var url =
      'mainservice/recruitment2/candidates/' +
      this.communityId +
      '?pageNum=' +
      this.pageNum +
      '&pageSize=' +
      this.pageSize;
    url =
      url +
      '&searchText=' +
      this.searchText +
      '&minExperience=' +
      this.minExperience +
      '&maxExperience=' +
      this.maxExperience +
      '&expectedCtc=' +
      this.expectedCtc +
      '&emailId=' +
      this.emailId;
    if (this.startDate != undefined)
      url = url + '&startDate=' + this.startDate + ' 00:00:00';
    if (this.endDate != undefined)
      url = url + '&endDate=' + this.endDate + ' 23:59:59';
    if (this.reqHandle) {
      this.reqHandle.unsubscribe();
    }
    this.commonService.showProcessingIcon();
    this.totalCandidates = 0;
    this.reqHandle = this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (filterChanged) {
        this.pageNum = 1;
        this.candidates = [];
      }
      if (!this.showFutureOnly && data['result'] === 200) {
        this.block = false;
        var newBatch = data['dataArray'];
        this.candidates = this.candidates.concat(newBatch);
        console.log(this.candidates);
        this.paginationMessage = data['message'];
        this.totalCandidates =
          parseInt(data['message'].split(' of ')[1]) * this.pageSize;
      }
      //if(newBatch.length===0 && this.pageNum>1)
      //{
      //this.pageNum=this.pageNum-1;
      //}
      localStorage.removeItem('candFilter');
      localStorage.setItem(
        'candFilter',
        this.searchText +
          '::' +
          this.minExperience +
          '::' +
          this.maxExperience +
          '::' +
          this.expectedCtc
      );
      this.loadFutureCandidtes(filterChanged);
    });
  }
  loadNonValidatedOnes = false;
  numOfNonValidatedOnes = 0;
  loadFutureCandidtes(filterChanged: any): void {
    var validated = -1;
    if (this.amIAceMaker || this.commonService.rbac['future-validate'])
      validated = -1;
    else validated = 1;
    if (this.loadNonValidatedOnes) validated = 0;
    var url =
      'mainservice/recruitment/future/getAll/' +
      this.communityId +
      '?pageNum=' +
      this.pageNum +
      '&pageSize=' +
      this.pageSize;
    url =
      url +
      '&searchText=' +
      this.searchText +
      '&minExperience=' +
      this.minExperience +
      '&maxExperience=' +
      this.maxExperience +
      '&expectedCtc=' +
      this.expectedCtc +
      '&emailId=' +
      this.emailId +
      '&validated=' +
      validated;
    if (this.startDate != undefined)
      url = url + '&startDate=' + this.startDate + ' 00:00:00';
    if (this.endDate != undefined)
      url = url + '&endDate=' + this.endDate + ' 23:59:59';
    if (this.reqHandle) {
      this.reqHandle.unsubscribe();
    }
    this.commonService.showProcessingIcon();
    this.reqHandle = this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (filterChanged) this.futures = [];
      if (data['result'] === 200) {
        this.block = false;
        var newBatch = data['dataArray'];
        this.candidates = this.candidates.concat(newBatch);
        this.paginationMessage = data['message'];
        this.totalFutures = data['dataObject'];
        this.numOfNonValidatedOnes = 0;
        for (var i = 0; i < this.candidates.length; i++) {
          if (
            this.candidates[i].validated !== undefined &&
            this.candidates[i].validated == 0
          )
            this.numOfNonValidatedOnes++;
        }
      }
    });
  }
  exportFutureCandidtes(): void {
    var validated = -1;
    if (this.amIAceMaker || this.commonService.rbac['non-validated-futures'])
      validated = -1;
    else validated = 1;
    if (this.loadNonValidatedOnes) validated = 0;
    var url =
      'mainservice/recruitment/future/export/getAll/' +
      this.communityId +
      '?pageNum=1&pageSize=10000000';
    url =
      url +
      '&searchText=' +
      this.searchText +
      '&minExperience=' +
      this.minExperience +
      '&maxExperience=' +
      this.maxExperience +
      '&expectedCtc=' +
      this.expectedCtc +
      '&emailId=' +
      this.emailId +
      '&validated=' +
      validated;
    if (this.startDate != undefined)
      url = url + '&startDate=' + this.startDate + ' 00:00:00';
    if (this.endDate != undefined)
      url = url + '&endDate=' + this.endDate + ' 23:59:59';
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
          'futures-report-' +
          this.commonService.getFormatedDate(new Date(), 'dd-MM-YYYY') +
          '.xlsx';
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }
  totalFutures = 0;
  pageNum = 1;
  pageSize = 12;
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
    this.loadCandidates(false);
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
    this.loadCandidates(false);
  }
  first(): void {
    this.pageNum = 1;
    this.loadCandidates(false);
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
    this.loadCandidates(false);
  }
  tableView = false;
  selectedCandidate: any;
  menuOptions: any = ['View Profile', 'Rediscover Candidate'];
  loadMenuItems(): void {
    if (this.selectedCandidate.orgCulture) {
      // console.log(this.selectedCandidate);
      this.menuOptions = ['View Details', 'Discover Candidate'];

      if (
        this.selectedCandidate.createdBy == this.commonService.user.id ||
        this.amIAceMaker ||
        this.commonService.rbac['future-edit']
      )
        this.menuOptions.push('Edit');
      if (
        (!this.selectedCandidate.validated &&
          this.commonService.rbac['future-edit']) ||
        this.amIAceMaker
      )
        this.menuOptions.push('Mark As Validated');
    } else {
      this.menuOptions = ['View Profile', 'Rediscover Candidate'];
      // this.menuOptions.push('Mark As Validated');
    }
  }
  selectedReq: any;
  handleMenuClick(option: any): void {
    switch (option) {
      case 'View Profile':
        this.router.navigate([
          'recr/discoveryDetails/-1/' + this.selectedCandidate.id,
        ]);
        break;
      case 'Rediscover Candidate':
        this.showRediscoverWindow('quick-discover');
        break;
      case 'Discover Candidate':
        this.showRediscoverWindow('quick-discover');
        break;
      case 'View Details':
        this.router.navigate([
          'recr/future-detail/' + this.selectedCandidate.id,
        ]);
        break;
      case 'Edit':
        this.router.navigate(['recr/future-edit/' + this.selectedCandidate.id]);
        break;
      case 'Mark As Validated':
        this.markAsValidated(false);
        break;
    }
  }
  markAsValidated(confirmed: any): void {
    if (!confirmed) {
      this.commonService.showConfirmWindow(
        'Confirmation',
        'Are you sure, you want to mark ' +
          this.selectedCandidate.name +
          ' as validated ?',
        () => {
          this.markAsValidated(true);
        },
        undefined
      );
      return;
    }
    this.selectedCandidate.validated = 1;
    this.selectedCandidate.validatedById = this.commonService.user.id;
    this.commonService
      .post(
        'mainservice/recruitment/future/openresource/save',
        this.selectedCandidate
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.loadCandidates(true)
          this.commonService.showSuccessMessage("Validate","Validation Done :)")
        } else {
          this.selectedCandidate.validated = 0;
          this.commonService.showErrorMessage('Error', data['message']);
        }
      });
  }
  availableTags: any = [];
  loadAvaialbleTags(): void {
    this.availableTags = [];
    var url = 'mainservice/recruitment2/availableTags?searchText=';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200 && data['dataArray'] != null) {
        this.availableTags = data['dataArray'];
      }
    });
  }
  searchByTag(tagName: any): void {
    var url =
      'mainservice/recruitment2/candidatesByTag/' +
      this.communityId +
      '?pageNum=' +
      this.pageNum +
      '&pageSize=' +
      this.pageSize +
      '&tag=' +
      tagName;
    url =
      url +
      '&searchText=' +
      this.searchText +
      '&minExperience=' +
      this.minExperience +
      '&maxExperience=' +
      this.maxExperience +
      '&expectedCtc=' +
      this.expectedCtc +
      '&emailId=' +
      this.emailId;
    if (this.startDate != undefined)
      url = url + '&startDate=' + this.startDate + ' 00:00:00';
    if (this.endDate != undefined)
      url = url + '&endDate=' + this.endDate + ' 23:59:59';
    if (this.reqHandle) {
      this.reqHandle.unsubscribe();
    }
    this.commonService.showProcessingIcon();
    this.reqHandle = this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      this.candidates = [];
      if (data['result'] === 200) {
        this.candidates = data['dataArray'];
        this.paginationMessage = data['message'];
      }
      if (this.candidates.length === 0 && this.pageNum > 1) {
        this.pageNum = this.pageNum - 1;
      }
    });
  }
  exportToXls(): void {
    var url =
      'mainservice/recruitment2/export/candidates/' +
      this.communityId +
      '?pageNum=1&pageSize=' +
      100000;
    url =
      url +
      '&searchText=' +
      this.searchText +
      '&minExperience=' +
      this.minExperience +
      '&maxExperience=' +
      this.maxExperience +
      '&expectedCtc=' +
      this.expectedCtc +
      '&emailId=' +
      this.emailId;
    if (this.startDate != undefined)
      url = url + '&startDate=' + this.startDate + ' 00:00:00';
    if (this.endDate != undefined)
      url = url + '&endDate=' + this.endDate + ' 23:59:59';
    if (this.showFutureOnly)
      url = url + '&showFutureOnly=' + this.showFutureOnly;
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
          'candidates-report-' +
          this.commonService.getFormatedDate(new Date(), 'dd-MM-YYYY') +
          '.xlsx';
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }
  newSector: any = '';
  availableSectors: any = [];
  loadAvaialbleSectors(): void {
    this.availableSectors = [];
    var url = 'mainservice/recruitment2/availableSectors?searchText=';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200 && data['dataArray'] != null) {
        this.availableSectors = data['dataArray'];
      }
    });
  }
  @ViewChild('discover') discover: any;
  candidateSelected: any;
  showRediscoverWindow(action: any): void {
    this.reDiscover.show();
    this.discover.source = action;

    this.discover.initValues();
    this.discover.loadMandates();

    this.discover.searchText = this.candidateSelected.emailId;
    if (this.candidateSelected.validated == undefined) {
      this.discover.getCandidateByEmailId(true, false, 0);
    } else {
      this.discover.candidate.currentLocation =
        this.candidateSelected.preferredLocation;
    }
    this.discover.candidate.name = this.candidateSelected.name;
    this.discover.candidate.emailId = this.candidateSelected.emailId;
    this.discover.candidate.phoneNo = this.candidateSelected.phoneNo;
    this.discover.candidate.linkedInUrl = this.candidateSelected.linkedInUrl;
    this.discover.candidate.cv = this.candidateSelected.cv;
  }
  loadMyMembership(): void {
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
        if (temp[0].isAceMaker) {
          this.amIAceMaker = true;
        }
      });
  }
  amIAceMaker = false;
}
