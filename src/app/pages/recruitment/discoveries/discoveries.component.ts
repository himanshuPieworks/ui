import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-discoveries',
  templateUrl: './discoveries.component.html',
  styleUrls: ['./discoveries.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        })
      ),
      state(
        'out',
        style({
          transform: 'translateY(-100%)',
          opacity: 0,
        })
      ),
      transition('out => in', animate('300ms ease-in')),
      transition('in => out', animate('300ms ease-out')),
    ]),
  ],
})
export class DiscoveriesComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Discoveries', link: '/recr/discoveries', active: true },
    ];

    setTimeout(() => {
      this.pageLoadedCompletely = true;
    }, 5000);
  }

  @ViewChild('filterWindow') filterWindow: any;
  @ViewChild('mailToClient') mailToClient: any;
  @ViewChild('bettersModal') bettersModal: any;
  @ViewChild('mailToClientComponent') mailToClientComponent: any;

  filterActive: boolean = false;
  specialFilterActive: boolean = false;
  myId: any = 0;

  constructor(
    public commonService: PieworksCommonService,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient
  ) {
    if (window.location.toString().indexOf('wp') != -1) this.pageSize = 100;
    this.commonService.goTop();
    if (this.commonService.isMobileDevice) this.pageNum = 0;
    this.communityId = localStorage.getItem('communityId');
    this.myId = parseInt(this.commonService.user.id + '');
    this.requirementId = this.route.snapshot.paramMap.get('reqId');
    this.reqUrl =
      '/community/' +
      this.communityId +
      '/domain/recruitment/requirements/' +
      this.requirementId;
    this.startDate = this.commonService.getParameterFromUrl('startDate');
    this.endDate = this.commonService.getParameterFromUrl('endDate');
    this.discoveryIds = this.commonService.getParameterFromUrl('discoveryIds');
    if (this.discoveryIds && this.discoveryIds.length > 0)
      localStorage.setItem(
        'discFilter',
        '-1::-1::::-1::-1::-1::false::0::500::0::50::-1::::::false'
      );
    this.modifiedStartDate =
      this.commonService.getParameterFromUrl('modifiedStartDate');
    this.modifiedEndDate =
      this.commonService.getParameterFromUrl('modifiedEndDate');

    document.body.style.overflow = 'auto !important';
    this.urlPrefix = this.commonService.urlPrefix;
    if (localStorage.getItem('discFilter') != null) {
      var temp: any = localStorage
        .getItem('discFilter')
        ?.toString()
        .split('::');
      //this.requirementId+"::"+localDiscoverers+"::"+this.searchText+"::"+localStatus+"::"+localClients+"::"+localRoles+"::"+this.top50+
      //"::"+this.minCtc+"::"+this.maxCtc+"::"+this.minExp+"::"+this.maxExp

      //if (temp[0] != undefined && (!this.requirementId || temp[0] == this.requirementId))
      {
        if (temp[1] != undefined) {
          var longArray = temp[1].split(',');
          for (var i = 0; i < longArray.length; i++) {
            if (parseInt(longArray[i]) == -1) continue;
            this.discoverers.push(parseInt(longArray[i]));
            this.filterActive = true;
          }
        }
        if (temp[2] != undefined) this.searchText = temp[2];
        if (temp[3] != undefined) {
          var longArray = temp[3].split(',');
          for (var i = 0; i < longArray.length && longArray.length < 19; i++) {
            if (longArray[i] == -1) continue;
            // alert(longArray[i]);
            this.status.push(parseInt(longArray[i]));
            if (longArray[i] !== undefined && parseInt(longArray[i]) !== -1) {
              this.filterActive = true;
            }
          }
        }
        if (temp[4] != undefined) {
          var longArray = temp[4].split(',');
          for (var i = 0; i < longArray.length; i++) {
            if (longArray[i] == -1) continue;
            this.selectedClients.push(parseInt(longArray[i]));
            if (longArray[i] != undefined && parseInt(longArray[i]) !== -1) {
              this.filterActive = true;
            }
          }
        }
        if (temp[5] != undefined) {
          var longArray = temp[5].split(',');
          for (var i = 0; i < longArray.length; i++) {
            this.selectedRoles.push(parseInt(longArray[i]));
            if (longArray[i] != undefined && parseInt(longArray[i]) !== -1) {
              this.filterActive = true;
            }
          }
        }
        if (temp[6] != undefined && this.top50 != parseInt(temp[6])) {
          this.top50 = temp[6] == 'true' ? true : false;
        }
        if (temp[7] != undefined && this.minCtc != parseInt(temp[7])) {
          this.minCtc = parseInt(temp[7]);
          this.filterActive = true;
        }
        if (temp[8] != undefined && this.maxCtc != parseInt(temp[8])) {
          this.maxCtc = parseInt(temp[8]);
          this.filterActive = true;
        }
        if (temp[9] != undefined && this.minExp != parseInt(temp[9])) {
          this.minExp = parseInt(temp[9]);
          this.filterActive = true;
        }
        if (temp[10] != undefined && this.maxExp != parseInt(temp[10])) {
          this.maxExp = parseInt(temp[10]);
          this.filterActive = true;
        }

        if (temp[11] != undefined) {
          var longArray = temp[11].split(',');
          for (var i = 0; i < longArray.length; i++) {
            if (longArray[i] != undefined && parseInt(longArray[i]) != -1) {
              this.clientAnchors.push(parseInt(longArray[i]));
              this.filterActive = true;
            }
          }
        }
        if (temp[12] != undefined) {
          this.startDate = temp[12];
          if (this.startDate.length == 0) this.startDate = undefined;
          else this.filterActive = true;
        }
        if (temp[13] != undefined) {
          this.endDate = temp[13];
          if (this.endDate.length == 0) this.endDate = undefined;
          else this.filterActive = true;
        }
        if (temp[14] != undefined && temp[14] == 'true') {
          this.nurtureCandidates = true;
          this.filterActive = true;
        }
      }
    }

    this.httpClient.get('assets/json/cities.json').subscribe((data: any) => {
      this.locations = data.cities;
    });

    this.loadRequirementDetails();
    this.loadStatus();
    this.loadClients();
    this.loadRoles();
    this.loadCommunityMembers();
    this.loadAvaialbleSectors();
    this.loadAvaialbleTags();
    window.onscroll = (ev) => {
      this.scrollListener(ev);
    };
    if (this.commonService.isMobileDevice) this.showFilter = false;
    this.loadMyMembership();
  }
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
    window.onscroll = (ev) => {};
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
        this.next();
      }
    }
    this.scrollY = window.scrollY;
  }

  isSpecialFilterVisible = false;

  toggleFilter() {
    this.isSpecialFilterVisible = !this.isSpecialFilterVisible;
  }

  keyword: string = '';
  keywordsArray: { keyword: string; isMandatory: boolean }[] = [];
  mandatoryKeywords: string[] = [];
  nonMandatoryKeywords: string[] = [];

  // addKeyword() {
  //   if (this.keyword.trim()) {
  //     this.keywordsArray.push({ keyword: this.keyword, isMandatory: false });
  //     this.keyword = ''; // Clear the input field after adding
  //   }
  // }
  // onKeyup(event: KeyboardEvent) {
  //   const inputValue = this.keyword.trim();

  //   // Check if 'Enter' key or ',' (comma) key was pressed
  //   if (event.key === 'Enter' || event.key === ',') {
  //     if (inputValue) {
  //       this.addKeyword();
  //     }
  //     // Remove the comma from the input if it's there
  //     this.keyword = '';
  //   }
  // }

  // addKeyword() {
  //   const trimmedKeyword = this.keyword.trim();
  //   if (this.keywordsArray.some((kw) => kw.keyword === trimmedKeyword)) {
  //     this.commonService.showErrorMessage(
  //       'Duplicate Keyword',
  //       'change the keyword !!'
  //     );
  //   }
  //   if (
  //     trimmedKeyword &&
  //     !this.keywordsArray.some((kw) => kw.keyword === trimmedKeyword)
  //   ) {
  //     this.keywordsArray.push({ keyword: trimmedKeyword, isMandatory: false });
  //     this.keyword = ''; // Clear the input field after adding
  //     this.updateArrays(); // Update arrays after adding
  //   }
  // }

  onKeyup(event: KeyboardEvent) {
    let inputValue = this.keyword.trim();

    // Check if 'Enter' key or ',' (comma) key was pressed
    if (event.key === 'Enter' || event.key === ',') {
      // Remove the comma if it exists at the end
      if (inputValue.endsWith(',')) {
        inputValue = inputValue.slice(0, -1).trim();
      }

      if (inputValue) {
        this.addKeyword(inputValue); // Pass the trimmed keyword
      }

      // Clear the input field
      this.keyword = '';
    }
  }

  addKeyword(trimmedKeyword: string) {
    if (trimmedKeyword) {
      this.keywordsArray.push({ keyword: trimmedKeyword, isMandatory: false });
      this.keyword = ''; // Clear the input field after adding
      this.updateArrays();
    }
  }
  removeKeyword(index: number) {
    this.keywordsArray.splice(index, 1);
    this.updateArrays();
  }

  toggleMandatory(index: number) {
    // Toggle the isMandatory flag for the specific keyword
    this.keywordsArray[index].isMandatory =
      !this.keywordsArray[index].isMandatory;

    // If any keyword is not mandatory, untoggle the "Mark all keywords as mandatory" switch
    if (!this.keywordsArray[index].isMandatory) {
      const toggleElement = document.getElementById(
        'toggleMandatory'
      ) as HTMLInputElement;
      if (toggleElement) {
        toggleElement.checked = false;
      }
    }

    // Update arrays accordingly
    this.updateArrays();
  }

  toggleAllMandatory(event: any) {
    const isMandatory = event.target.checked;
    this.keywordsArray.forEach((kw) => (kw.isMandatory = isMandatory));
    this.updateArrays();
  }

  updateArrays() {
    this.mandatoryKeywords = this.keywordsArray
      .filter((kw) => kw.isMandatory)
      .map((kw) => kw.keyword);

    this.nonMandatoryKeywords = this.keywordsArray
      .filter((kw) => !kw.isMandatory)
      .map((kw) => kw.keyword);

    console.log('This is  Mandatory array : ', this.mandatoryKeywords);
    console.log('This is Non Mandatory array : ', this.nonMandatoryKeywords);
  }
  // ngOnDestroy(): void {
  //     window.onscroll = undefined;
  // }
  scrollY: any = 0;
  block: any = false;
  scrollPosition: any = 0;
  reqUrl: any = '';
  reportType: any = 'detail';
  discoveryIds: any;
  toggleClassOnRowClick(row: any): void {
    if (!row.classOnRowClick) {
      row.classOnRowClick = 'tr-on-select';
      return;
    }
    if (row.classOnRowClick && row.classOnRowClick.length === 0)
      row.classOnRowClick = 'tr-on-select';
    else row.classOnRowClick = '';
  }
  searchText: any = '';
  paginationMessage: any = '';
  candidates: any = [{}];
  communityId: any;
  location: any = '';
  locations: any = [];
  selectedLocations: any = '';
  minExperience: any = '0';
  maxExperience: any = '60';
  expectedCtc: any = '0';
  urlPrefix: any = '';
  startDate: any; //this.commonService.getFormatedDate(new Date(),"yyyy-MM-dd");
  endDate: any; //this.commonService.getFormatedDate(new Date(),"yyyy-MM-dd");
  modifiedStartDate: any; //this.commonService.getFormatedDate(new Date(),"yyyy-MM-dd");
  modifiedEndDate: any; //this.commonService.getFormatedDate(new Date(),"yyyy-MM-dd");

  pageLoadedCompletely: any = false;
  filterChanged(): void {
    this.shortlisting = [];
    if (this.pageLoadedCompletely) {
      this.modifiedStartDate = undefined;
      this.modifiedEndDate = undefined;
    }
    setTimeout(() => {
      if (this.minExp < 0) {
        this.minExp = 0;
      }
      if (this.maxExp < 0) {
        this.maxExp = 60;
      }
      if (this.minCtc < 0) {
        this.minCtc = 0;
      }
      if (this.maxCtc < 0) {
        this.maxCtc = 0;
      }
      this.pageNum = 1;
      this.loadShortlistedCandidates(true);
      this.filterWindow.hide();
    }, 1000);
    this.filterActive = true;
  }
  // filterForSpecialChanged(): void {
  //   this.shortlisting = [];
  //   if (this.pageLoadedCompletely) {
  //     this.modifiedStartDate = undefined;
  //     this.modifiedEndDate = undefined;
  //   }
  //   setTimeout(() => {
  //     if (this.minExp < 0) {
  //       this.minExp = 0;
  //     }
  //     if (this.maxExp < 0) {
  //       this.maxExp = 60;
  //     }
  //     if (this.minCtc < 0) {
  //       this.minCtc = 0;
  //     }
  //     if (this.maxCtc < 0) {
  //       this.maxCtc = 0;
  //     }
  //     this.pageNum = 1;
  //     this.loadCandidatesAsPerCv();
  //   }, 1000);
  //   this.specialFilterActive = true;
  // }

  reqHandle: any;
  clearFilters(): void {
    this.mandatoryKeywords = [];
    this.nonMandatoryKeywords = [];
    this.keywordsArray = [];
    this.searchText = '';
    this.location = '';
    this.selectedLocations = '';
    this.minExperience = '0';
    this.maxExperience = '60';
    this.expectedCtc = '0';
    this.status = [];
    this.specialFilterActive = false;
    this.client = undefined;
    this.selectedClients = [];
    this.selectedRoles = [];
    this.discoverers = [];
    this.clientAnchors = [];
    this.minCtc = 0;
    this.maxCtc = 500;
    this.minExp = 0;
    this.maxExp = 50;
    this.top50 = false;
    this.nurtureCandidates = false;
    this.pageNum = 0;
    this.startDate = undefined; //this.commonService.getFormatedDate(new Date(),"yyyy-MM-dd");
    this.endDate = undefined; //this.commonService.getFormatedDate(new Date(),"yyyy-MM-dd");
    this.modifiedStartDate = undefined;
    this.modifiedEndDate = undefined;
    this.discoveryIds = undefined;
    this.loadShortlistedCandidates(true);
    this.roleSearchText = '';
    this.client = '';
    this.loadClients();
    this.loadRoles();
    this.selectedTag = '';
    for (var i = 0; i < this.availableTags.length; i++) {
      if (this.availableTags[i].color) this.availableTags[i].color = undefined;
    }
    this.filterActive = false;
  }
  requirementId: any;
  shortlisting: any = [];
  status: any = [];
  client: any = '';
  tableView: any = false;
  selectedDiscovery: any;
  top50: any = false;
  nurtureCandidates: any = false;
  loadingMessage: any = 'Loading...';
  discoveryTotal :any = 0;
  talentTotal:any =0;
  candidateTotal:any = 0;

  loadShortlistedCandidates(filterChanged: any): void {
    var localStatus = this.status.toString();
    if (this.status.length === 0) {
      localStatus = '-1';
      // for (var i = 0; i < this.statusArray.length; i++)
      //   localStatus = localStatus + this.statusArray[i].id + ',';
      // localStatus = localStatus.substring(0, localStatus.length - 1);
    }
    var localRoles = this.selectedRoles.toString();
    if (this.selectedRoles.length === 0) localRoles = '-1';

    var localClients = this.selectedClients.toString();
    if (this.selectedClients.length === 0) localClients = '-1';
    var localDiscoverers = this.discoverers.toString();
    //    for (var i = 0; i < this.discoverers.length; i++)
    //    {
    //        localDiscoverers = localDiscoverers + this.discoverers[i]+ ',';
    //    }
    //      localDiscoverers = localDiscoverers.substring(0, localDiscoverers.length - 1);
    if (this.discoverers.length === 0) localDiscoverers = '-1';
    var localClientAnchors = this.clientAnchors.toString();
    if (this.clientAnchors.length === 0) localClientAnchors = '-1';

    if (this.pageNum < 1) this.pageNum = 1;
    if (this.requirementId == null) this.requirementId = -1;

    var mandatoryKeywords = this.mandatoryKeywords.join('-');
    var nonMandatoryKeywords = this.nonMandatoryKeywords.join('-');

    if (mandatoryKeywords.length == 0 && nonMandatoryKeywords.length == 0)
      mandatoryKeywords = this.keyword;
    var location = this.selectedLocations;

    var url =
      'mainservice/recruitment/shortlisting/shortlist/' +
      this.requirementId +
      '?pageNum=' +
      this.pageNum +
      '&pageSize=' +
      this.pageSize;
    url =
      url +
      '&discovererIds=' +
      localDiscoverers +
      '&clientAnchorIds=' +
      localClientAnchors +
      '&searchText=' +
      this.searchText +
      '&status=' +
      localStatus +
      '&clientIds=' +
      localClients +
      '&roles=' +
      localRoles +
      '&top50=' +
      this.top50 +
      '&minCtc=' +
      this.minCtc +
      '&maxCtc=' +
      this.maxCtc +
      '&minExp=' +
      this.minExp +
      '&maxExp=' +
      this.maxExp +
      '&tag=' +
      this.selectedTag +
      '&mandatorySearchText=' +
      mandatoryKeywords +
      '&optionalSearchText=' +
      nonMandatoryKeywords +
      '&location=' +
      location;
    if (this.startDate != undefined) url = url + '&startDate=' + this.startDate;
    if (this.endDate != undefined) url = url + '&endDate=' + this.endDate;
    if (this.modifiedStartDate != undefined)
      url = url + '&modifiedStartDate=' + this.modifiedStartDate;
    if (this.modifiedEndDate != undefined)
      url = url + '&modifiedEndDate=' + this.modifiedEndDate;
    if (this.discoveryIds != undefined)
      url = url + '&discoveryIds=' + this.discoveryIds;

    if (this.reqHandle) {
      this.reqHandle.unsubscribe();
    }
    this.commonService.showProcessingIcon();
    this.totalCandidates = 0;
    this.loadingMessage = 'just a minute, getting it for you...';
    this.reqHandle = this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (filterChanged) this.shortlisting = [];
      if (data['result'] === 200) {
        this.block = false;
        var newBatch = data['dataArray'];

        if (!this.nurtureCandidates)
          this.shortlisting = this.shortlisting.concat(newBatch);

        this.paginationMessage = data['message'];
      }
      if (this.shortlisting.length === 0 && this.pageNum > 1) {
        this.pageNum = this.pageNum - 1;
      }
      localStorage.removeItem('discFilter');
      var discFilter =
        this.requirementId +
        '::' +
        localDiscoverers +
        '::' +
        this.searchText +
        '::' +
        localStatus +
        '::' +
        localClients +
        '::' +
        localRoles +
        '::' +
        this.top50 +
        '::' +
        this.minCtc +
        '::' +
        this.maxCtc +
        '::' +
        this.minExp +
        '::' +
        this.maxExp +
        '::' +
        localClientAnchors;
      if (this.startDate && this.startDate.length > 0) {
        discFilter = discFilter + '::' + this.startDate;
      } else {
        discFilter = discFilter + '::';
      }
      if (this.endDate && this.endDate.length > 0) {
        discFilter = discFilter + '::' + this.endDate;
      } else {
        discFilter = discFilter + '::';
      }
      discFilter = discFilter + '::' + this.nurtureCandidates;
      if (!this.loadSuggestionsOnly)
        localStorage.setItem('discFilter', discFilter);
      for (var i = 0; i < this.shortlisting.length; i++) {
        if (this.isBettingWindowOpen(this.shortlisting[i])) {
          this.shortlisting[i].isBettingWindowOpen = true;
        }
        if (
          this.shortlisting[i].requirement &&
          this.shortlisting[i].requirement.clientAnchor &&
          this.shortlisting[i].requirement.clientAnchor.id ==
            this.commonService.user.id
        ) {
          this.amIClientAnchor = true;
        }
        if (
          this.shortlisting[i].requirement &&
          this.shortlisting[i].requirement.standbyClientAnchor &&
          this.shortlisting[i].requirement.standbyClientAnchor.id ==
            this.commonService.user.id
        ) {
          this.amIClientAnchor = true;
        }
      }
      /*
          this.totalCandidates = parseInt(data["message"].split(" of ")[1]) * this.pageSize;
          if(this.pageNum==parseInt(data["message"].split(" of ")[1]))
              this.totalCandidates = this.shortlisting.length;
          */
      this.totalCandidates = data['dataObject'];
      this.discoveryTotal = data['dataObject'];

      if (
        (localStatus != -1 && localStatus.split(',').length < 19) ||
        localClients != '-1' ||
        localRoles != '-1' ||
        localClientAnchors != '-1'
      ) {
        return;
      }
      
      this.loadCandidates(filterChanged);

      if (this.shortlisting.length == 0)
        this.loadingMessage = 'Sorry there is no data for your search...';
    });
  }

  doubleClickCounter = 0;

  clickedOnCandidate(disc: any): void {
    this.doubleClickCounter++;
    if (this.doubleClickCounter >= 2) this.doubleClicked(disc);
    setTimeout(() => {
      this.doubleClickCounter = 0;
    }, 300);
  }

  doubleClicked(disc: any): void {
    if (disc.requirement) {
      window.open(
        this.commonService.uiPrefix +
          '/recr/discoveryDetails/' +
          disc.requirement.id +
          '/' +
          disc.id,
        '_blank'
      );
    } else {
      window.open(
        this.commonService.uiPrefix + '/recr/discoveryDetails/-1/' + disc.id,
        '_blank'
      );
    }
  }
  clickedOnCandidateTalent(disc: any): void {
    this.doubleClickCounter++;
    if (this.doubleClickCounter >= 2) this.doubleClickedTalent(disc);
    setTimeout(() => {
      this.doubleClickCounter = 0;
    }, 300);
  }

  doubleClickedTalent(disc: any): void {
    if (disc.requirement) {
      window.open(
        this.commonService.uiPrefix +
          '/recr/future-detail/' +
          disc.id,
        '_blank'
      );
    } else {
      window.open(
        this.commonService.uiPrefix + '/recr/future-detail/' + disc.id,
        '_blank'
      );
    }
  }

  truncateString(inputString: string, maxLength: number): string {
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.substring(0, maxLength) + '...';
    }
  }

  totalCandidates: any = 0;
  exportToXls(type: any): void {
    var localStatus = this.status.toString();
    if (this.status.length === 0) {
      for (var i = 0; i < this.statusArray.length; i++)
        localStatus = localStatus + this.statusArray[i].id + ',';
      localStatus = localStatus.substring(0, localStatus.length - 1);
    }
    var localRoles = this.selectedRoles.toString();
    if (this.selectedRoles.length === 0) localRoles = '-1';

    var localClients = this.selectedClients.toString();
    if (this.selectedClients.length === 0) localClients = '-1';

    var localDiscoverers = this.discoverers.toString();
    if (this.discoverers.length === 0) localDiscoverers = '-1';
    var localClientAnchors = this.clientAnchors.toString();
    if (this.clientAnchors.length === 0) localClientAnchors = '-1';

    var url =
      'mainservice/recruitment/shortlisting/export/excel/' + this.requirementId;

    url =
      url +
      '?discovererIds=' +
      localDiscoverers +
      '&clientAnchorIds=' +
      localClientAnchors +
      '&searchText=' +
      this.searchText +
      '&status=' +
      localStatus +
      '&clientIds=' +
      localClients +
      '&roles=' +
      localRoles +
      '&top50=' +
      this.top50 +
      '&minCtc=' +
      this.minCtc +
      '&maxCtc=' +
      this.maxCtc +
      '&minExp=' +
      this.minExp +
      '&maxExp=' +
      this.maxExp +
      '&type=' +
      type +
      '&tag=' +
      this.selectedTag +
      '&communityId=' +
      this.communityId;
    if (this.startDate != undefined) url = url + '&startDate=' + this.startDate;
    if (this.endDate != undefined) url = url + '&endDate=' + this.endDate;
    if (this.modifiedStartDate != undefined)
      url = url + '&modifiedStartDate=' + this.modifiedStartDate;
    if (this.modifiedEndDate != undefined)
      url = url + '&modifiedEndDate=' + this.modifiedEndDate;
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
          'discovery-' +
          type +
          '-report-' +
          this.commonService.getFormatedDate(new Date(), 'dd-MM-YYYY') +
          '.xlsx';
        if (this.requirementId != -1)
          filename =
            'discovery-' +
            type +
            '-report-' +
            this.requirement.client.name +
            '-' +
            this.requirement.role.name +
            '-' +
            this.commonService.getFormatedDate(new Date(), 'dd-MM-YYYY') +
            '.xlsx';
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }

  requirement: any = {};
  loadRequirementDetails(): void {
    if (this.requirementId == -1) return;
    if (this.requirementId == null) return;
    var url = 'mainservice/recruitment/requirement/' + this.requirementId;
    this.commonService.showProcessingIcon();
    this.amIClientAnchor = false;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.requirement = data['dataObject'];
        if (
          this.requirement.clientAnchor &&
          this.requirement.clientAnchor.id == this.commonService.user.id
        )
          this.amIClientAnchor = true;
      }
    });
  }
  amIClientAnchor: any = false;
  pageNum: any = 0;
  pageSize: any = 12;
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
    this.loadShortlistedCandidates(false);
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
    this.loadShortlistedCandidates(false);
  }
  first(): void {
    this.pageNum = 1;
    this.loadShortlistedCandidates(false);
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
    this.loadShortlistedCandidates(false);
  }
  //  goBack():void
  //  {
  //       this._location.back();
  //  }
  statusArray: any = [];
  loadStatus(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/recruitment/shortlisting/status?currentStatus=-1')
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.statusArray = data['dataArray'];
          this.loadShortlistedCandidates(false);
        }
      });
  }
  clientHandle: any;
  clients: any = [];
  selectedClients: any = [];
  onClientSearch(item: any) {
    this.clientSearch = item.term;
    this.loadClients();
  }

  // when client is already loaded locally then this method made it local search
  clientLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }
  clientSearch: any = '';
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
        //this.clients = [];
        if (data['result'] === 200) {
          this.clients = data['dataArray'];
        }
      });
  }
  roleHandle: any;
  roles: any = [];
  roleSearchText: any = '';
  selectedRoles: any = [];
  loadRoles(): void {
    setTimeout(() => {
      var localClients = this.selectedClients.toString();
      if (this.selectedClients.length === 0) localClients = '-1';
      if (this.roleHandle) this.roleHandle.unsubscribe();
      this.commonService.showProcessingIcon();
      this.roleHandle = this.commonService
        .get(
          'mainservice/recruitment2/role?clientIds=' +
            localClients +
            '&searchText=' +
            this.roleSearchText
        )
        .subscribe((data: any) => {
          this.commonService.hideProcessingIcon();
          this.roles = [];
          if (data['result'] === 200) {
            this.roles = data['dataArray'];
          }
        });
    }, 500);
  }
  onRoleSearch(item: any) {
    this.roleSearchText = item.term;
    this.loadRoles();
  }

  // when client is already loaded locally then this method made it local search
  roleLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }

  @ViewChild('reDiscover') reDiscover: any;
  @ViewChild('discover') discover: any;
  @ViewChild('updateStatusModal') updateStatusModal: any;
  selectedCandidate: any;
  menuOptions: any = ['View Profile', 'Details'];
  fillMenuOptions(discovery: any): any {
    this.selectedDiscovery = discovery;
    this.menuOptions = [];
    if (discovery.requirement) {
      this.loadDiscovererMembership();
      if (this.commonService.rbac['edit-disc-status'] || this.commonService.isTesting) {
        this.menuOptions.push('Update status');
      }
      if (discovery.candidate.nurture)
        this.menuOptions.push('Remove from nurture list');
      else this.menuOptions.push('Include in nurture list');
    }
    this.menuOptions.push('Re-Discover');
    if (discovery.createdBy.id == this.commonService.user.id)
      this.menuOptions.push('Nudge');
  }
  selectedReq: any;
  handleMenuClick(option: any): void {
    switch (option) {
      case 'Remove from nurture list':
        Swal.fire({
          title: 'Confirmation required',
          text: 'Are you sure you want to remove the talent from the nurture list ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'rgb(3, 142, 220)',
          cancelButtonColor: 'rgb(243, 78, 78)',
          confirmButtonText: 'Yes',
        }).then((result: any) => {
          if (result.value) {
            if (this.selectedDiscovery.requirement) {
              this.selectedDiscovery.candidate.nurture = false;
              this.updateCandidate(this.selectedDiscovery.candidate);
            } else {
              this.selectedDiscovery.nurture = false;
              this.updateCandidate(this.selectedDiscovery);
            }
          }
        });
        break;
      case 'Include in nurture list':
        Swal.fire({
          title: '',
          text: 'Are you sure you want to include the talent in the nurture list ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'rgb(3, 142, 220)',
          cancelButtonColor: 'rgb(243, 78, 78)',
          confirmButtonText: 'Yes',
        }).then((result: any) => {
          if (result.value) {
            if (this.selectedDiscovery.requirement) {
              this.selectedDiscovery.candidate.nurture = true;
              this.updateCandidate(this.selectedDiscovery.candidate);
            } else {
              this.selectedDiscovery.nurture = true;
              this.updateCandidate(this.selectedDiscovery);
            }
          }
        });
        break;
      case 'Re-Discover':
        this.showRediscoverWindow('quick-discover');
        break;
      case 'Update status':
        this.showUpdateStatus();
        break;
      case 'Nudge':
        this.nudgeFunction();
        break;
    }
  }

  nudgeFunction(): void {
    Swal.fire({
      title: 'Confirmation required',
      text:
        'Are you sure you want to nudge CA for the updates on candidate ' +
        this.selectedCandidate.candidate.name +
        '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      if (result.value) {
        this.commonService.sendNotification(
          this.selectedCandidate.requirement.clientAnchorId,
          this.commonService.user.name +
            ' has NUDGED you for their candidate ' +
            this.selectedCandidate.candidate.name +
            ',' +
            this.selectedCandidate.requirement.role.name,
          '/recr/discoveryDetails/' +
            this.selectedCandidate.requirement.id +
            '/' +
            this.selectedCandidate.id,
          'COMMUNITY MEMBER',
          1,
          0
        );

        this.commonService.showSuccessMessage(
          'Nudged',
          'Notification send to CA'
        );
      }
    });
  }

  showRediscoverWindow(action: any): void {
    this.reDiscover.show();
    this.discover.source = action;
    this.discover.initValues();
    this.discover.loadMandates();
    this.discover.searchText = this.selectedCandidate.candidate.emailId;
    this.discover.getCandidateByEmailId(true, false, 0);
  }
  updateCandidate(candidate: any): void {
    if (candidate['experience'] == undefined || candidate['experience'] < 0)
      candidate['experience'] = undefined;
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment2/candidate', candidate)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.commonService.showInfoMessage('Info', 'Updation successful.');
      });
  }
  showFilter: any = true;
  membersArray: any = [];
  discoverers: any = [];
  clientAnchors: any = [];
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
          this.membersArray = data['dataArray'];
        }
        this.checkIfIamAceMaker();
      });
  }

  // Add Remark
  remarkTemp: any;
  editRemark: any = false;
  shortlistId: any;
  addRemark(): void {
    if (!this.remarkTemp || this.remarkTemp.length === 0) return;
    var temp = this.remarkTemp.split(/\r?\n/);
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
          category: 'recruitment-discovery',
          categoryId: this.selectedCandidate.id,
          createdBy: this.commonService.user.id,
        };
        this.remarks.push(remarkObj);
        this.saveRemark(remarkObj);
      }
    }
    this.remarkTemp = '';
  }

  // Remove Remark
  removeRemark(obj: any): void {
    for (var i = 0; i < this.remarks.length; i++) {
      if (this.remarks[i] === obj) {
        this.remarks.splice(i, 1);
      }
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/generic/removeRemark', obj)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.loadRemarks();
          this.editRemark = false;
          this.commonService.showInfoMessage('Info', 'Updation successful.');
          return;
        } else {
          this.loadRemarks();
        }
      });
  }

  // save Remark
  saveRemark(remarkObj: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/generic/remark', remarkObj)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.loadRemarks();
          this.editRemark = false;

          // alert(this.shortlist.createdBy.id)
          // Notification
          this.commonService.sendNotification(
            this.selectedCandidate.createdBy.id,
            'Account Manager Remarks have been updated for ' +
              this.selectedCandidate.candidate.name,
            '/recr/discoveryDetails/' +
              this.selectedCandidate.requirement.id +
              '/' +
              this.selectedCandidate.id,
            'COMMUNITY MEMBER',
            1,
            0
          );
          this.commonService.showInfoMessage('Info', 'Updation successful.');
          return;
        } else {
          this.loadRemarks();
        }
      });
  }

  editClientFeedBack: any = false;
  feedback: any = '';

  getTwoDigit(number: any) {
    if (number.toString().length == 1) return '0' + number;
    else return number;
  }

  addFeedback(): void {
    var today = new Date();

    this.feedbacks.push({
      feedback:
        this.feedback + ' (' + this.commonService.user.name.split(' ')[0] + ')',
      date:
        today.getFullYear() +
        '-' +
        this.getTwoDigit(today.getMonth() + 1) +
        '-' +
        this.getTwoDigit(today.getDate()),
    });
    this.feedback = '';
  }
  removeFeedback(obj: any) {
    for (var i = 0; i < this.feedbacks.length; i++) {
      if (obj === this.feedbacks[i]) {
        this.feedbacks.splice(i, 1);
        break;
      }
    }
  }
  updateFeedbacks(): void {
    for (var i = 0; i < this.feedbacks.length; i++) {
      this.feedbacks[i]['recruitmentShortlisting'] = this.shortlist;
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post(
        'mainservice/recruitment/shortlisting/clientfeedback',
        this.feedbacks
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.editClientFeedBack = false;
        this.commonService.showInfoMessage('Info', 'Updation successful.');
        var message =' The client has given the feedback on the candidate  as - ' +
        this.feedbacks[0].feedback;
        this.commonService.sendNotification(
          this.selectedCandidate.createdBy.id,
          message,
          '/recr/discoveryDetails/' +
            this.selectedCandidate.requirement.id +
            '/' +
            this.selectedCandidate.id,
          'COMMUNITY MEMBER',
          1,
          0
        );
      });
  }

  amIAceMaker: any = false;
  aceMakersEmailIds: any = [];
  checkIfIamAceMaker(): void {
    this.amIAceMaker = false;
    this.aceMakersEmailIds = [];
    for (var i = 0; i < this.membersArray.length; i++) {
      if (this.membersArray[i].isAceMaker) {
        this.aceMakersEmailIds.push(this.membersArray[i].user.username);
      }
      if (
        this.membersArray[i].isAceMaker &&
        this.membersArray[i].id.userId == this.commonService.user.id
      ) {
        this.amIAceMaker = true;
        //break;
      }
    }
    if (this.commonService.user.id == '8') {
      //karthik needs excel download
      this.amIAceMaker = true;
    }
  }
  minCtc: any = 0;
  maxCtc: any = 500;
  minExp: any = 0;
  maxExp: any = 50;
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000);
    }
    return value;
  }

  emailToClient() {
    if (
      this.requirementId == -1 &&
      (this.selectedClients.length != 1 ||
        this.selectedClients.toString() == '-1')
    ) {
      this.commonService.showErrorMessage(
        'Error',
        'Discovery report can be sent to a single client at a time. Please select a single client.'
      );
      return;
    }
    this.mailToClientComponent.shortlist = this.shortlisting;
    this.mailToClientComponent.shortlisting = this.shortlisting;
    for (var i = 0; i < this.mailToClientComponent.shortlisting.length; i++) {
      this.mailToClientComponent.shortlisting[i].selected = true;
    }
    this.mailToClientComponent.aceMakersEmailId = this.aceMakersEmailIds;
    this.mailToClientComponent.aceMakersEmailIds = this.aceMakersEmailIds;
    this.mailToClientComponent.communityClientContacts =
      this.shortlisting[0].requirement.client.communityClientContacts;

    this.mailToClientComponent.findRoles();
    this.mailToClient.show();
  }

  reqHandle2: any;
  loadCandidates(filterChanged: any): void {
    if (this.loadSuggestionsOnly) {
      return;
    }
    if (this.requirementId > -1 || this.discoveryIds) {
      this.candidates = [];
      return;
    }
    var localDiscoverers = this.discoverers.toString();
    if (this.discoverers.length === 0) localDiscoverers = '-1';
    //        var url = "mainservice/recruitment2/candidatesByTag/"+this.communityId+"?pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&tag=NURTURE";
    //        url = url+"&searchText="+this.searchText+"&minExperience="+this.minExp+"&maxExperience="+this.maxExp+"&expectedCtc=0&emailId=";

    var mandatoryKeywords = this.mandatoryKeywords.join('-');
    var nonMandatoryKeywords = this.nonMandatoryKeywords.join('-');

    if (mandatoryKeywords.length == 0 && nonMandatoryKeywords.length == 0)
      mandatoryKeywords = this.keyword;
    var location = this.selectedLocations;

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
      '&tag=' +
      this.selectedTag +
      '&expectedCtc=' +
      this.expectedCtc +
      '&minCtc=' +
      this.minCtc +
      '&maxCtc=' +
      this.maxCtc +
      '&emailId=&discovered=0&discovererIds=' +
      localDiscoverers +
      '&mandatorySearchText=' +
      mandatoryKeywords +
      '&optionalSearchText=' +
      nonMandatoryKeywords +
      '&location=' +
      location;
    if (this.nurtureCandidates) {
      url = url + '&nurtureCandidatesOnly=' + 1;
    } else {
      url = url + '&discovered=0';
    }
    if (this.startDate != undefined)
      url = url + '&startDate=' + this.startDate + ' 00:00:00';
    if (this.endDate != undefined)
      url = url + '&endDate=' + this.endDate + ' 23:59:59';

    if (this.reqHandle2) {
      this.reqHandle2.unsubscribe();
    }
    this.commonService.showProcessingIcon();
    //this.totalCandidates = 0;
    this.reqHandle2 = this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (filterChanged) this.candidates = [];
      if (data['result'] === 200) {
        this.block = false;
        var newBatch = data['dataArray'];
        //this.candidates = this.candidates.concat(newBatch);
        //this.shortlisting = this.shortlisting.concat(newBatch);
        for (var i = 0; i < newBatch.length; i++) {
          var candidate = {
            id: newBatch[i].id,
            candidate: newBatch[i],
            createdBy: newBatch[i].createdBy,
            createdOn: newBatch[i].createdOn,
            modifiedOn: newBatch[i].modifiedOn,
            source: 'future',
          };
          this.shortlisting.push(candidate);
        }
        if(!this.filterActive)
        this.loadTalentByAccount();
        //this.paginationMessage = data["message"];
        this.candidateTotal = data['dataObject'];

        if (parseInt(data['message'].split(' of ')[1]) == 1)
          this.totalCandidates = this.totalCandidates + newBatch.length;
        else
          this.totalCandidates =
            this.totalCandidates +
            parseInt(data['message'].split(' of ')[1]) * this.pageSize;
      }
      if (newBatch?.length === 0 && this.pageNum > 1) {
        //this.pageNum=this.pageNum-1;
      }
    });
  }

  loadTalentByAccount(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/talent/getTalentAccounts?pageSize=' +
      this.pageSize +
      ',pageNum=' +
      this.pageNum +
      ',searchString=' +
      this.searchText;

      if (this.startDate != undefined)
        url = url + '&startDate=' + this.startDate + ' 00:00:00';
      if (this.endDate != undefined)
        url = url + '&endDate=' + this.endDate + ' 23:59:59';
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] == 200) {
        // this.talents = data['dataArray'];
        // this.paginationMessage = data['message'];

        this.block = false;
        var newBatch = data['dataArray'];
        //this.candidates = this.candidates.concat(newBatch);
        //this.shortlisting = this.shortlisting.concat(newBatch);
        for (var i = 0; i < newBatch.length; i++) {
          var candidate = {
            id: newBatch[i].id,
            candidate: newBatch[i],
            createdBy: newBatch[i].createdBy,
            createdOn: newBatch[i].createdOn,
            modifiedOn: newBatch[i].modifiedOn,
            source: 'talent',
          };
          this.shortlisting.push(candidate);
        }

        this.talentTotal = data['dataObject'].totalRows;

        if (parseInt(data['message'].split(' of ')[1]) == 1)
          this.totalCandidates = this.totalCandidates + newBatch.length;
        else
          this.totalCandidates =
            this.totalCandidates +
            parseInt(data['message'].split(' of ')[1]) * this.pageSize;

        // this.totalNumberOfTalent = data['dataObject'];
        // console.log(this.talents)
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
  availableTags: any = [];
  selectedTag: any = '';
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
  loadSuggestionsOnly: boolean = false;
  loadMandateSuggestions(requirement: any): void {
    this.loadSuggestionsOnly = true;
    this.requirementId = -1;
    //this.searchText = requirement.role.name.split(" ")[0].trim();
    this.searchText = requirement.role.name.trim();
    this.filterChanged();
  }
  myMemberShip: any;
  loadMyMembership(): void {
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
        this.myMemberShip = data['dataArray'][0];
      });
  }
  betOnTalent(discovery: any): void {
    if (!discovery.isBettingWindowOpen) {
      return;
    }
    if (this.myMemberShip.user.piecos < 20) {
      this.commonService.showErrorMessage(
        'Error',
        "Sorry, you don't have enough Piecoins (20) to bet on this talent."
      );
      return;
    }
    let eligiblePiecoinOnGp = '2x';
    if (discovery.numOfBetters < 5) eligiblePiecoinOnGp = '3x';
    let message =
      'Are you sure you want to bet on talent ' +
      discovery.candidate.name +
      ' ? This will cost you 20 Piecoins. ' +
      'If the talent get placed and completes the guarantee period, you will get ' +
      eligiblePiecoinOnGp +
      ' Piecoins. If the talent drops out after getting an offer, ' +
      'you will get 30 Piecoins. Also please note only 1st 10 bettors will be considered. Others are welcome to bet on. No Piecoins will be deducted or credited in this case.';
    message =
      'You are betting on ' +
      discovery.candidate.name +
      ' for 20 Piecoins. If the talent gets placed and completes guarantee period, you shall get ' +
      eligiblePiecoinOnGp +
      ' returns. Alternately, if the talent reaches only till offer stage, you shall get 1.5x.';
    if (discovery.numOfBetter >= 10) {
      message =
        'We have registered 10 bets on this talent and we have closed the betting. However you can endorse the talent for free and track his progress';
    }
    //betting window closes after 30 days of discovery
    this.selectedDiscovery = discovery;
    Swal.fire({
      title: 'Confirmation',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      if (result.value) {
        var betting: any = {
          discovery: discovery,
          user: this.commonService.user,
        };
        this.commonService
          .post('mainservice/discoveryBetting/save', betting)
          .subscribe((data: any) => {
            this.commonService.hideProcessingIcon();
            this.loadMyMembership();
            if (data['result'] == 200) {
              discovery.numOfBetters = discovery.numOfBetters + 1;
              this.commonService.showInfoMessage(
                'Info',
                'You have successfully placed your bet on ' +
                  discovery.candidate.name
              );
              if (discovery.requirement.clientAnchor) {
                this.commonService.sendNotification(
                  discovery.requirement.clientAnchor.id,
                  this.commonService.user.name +
                    ' has bet on ' +
                    discovery.candidate.name +
                    ' for the role ' +
                    discovery.requirement.role.name +
                    ', ' +
                    discovery.requirement.client.name +
                    '. Total bets received = ' +
                    discovery.numOfBetters,
                  '/recr/disoveries/' +
                    discovery.requirement +
                    '/' +
                    discovery.id,
                  'COMMUNITY MEMBER',
                  1,
                  0
                );
              }
              if (discovery.requirement.standbyClientAnchor) {
                this.commonService.sendNotification(
                  discovery.requirement.standbyClientAnchor.id,
                  this.commonService.user.name +
                    ' has bet on ' +
                    discovery.candidate.name +
                    ' for the role ' +
                    discovery.requirement.role.name +
                    ', ' +
                    discovery.requirement.client.name +
                    '. Total bets received = ' +
                    discovery.numOfBetters,
                  '/recr/disoveries/' +
                    discovery.requirement +
                    '/' +
                    discovery.id,
                  'COMMUNITY MEMBER',
                  1,
                  1
                );
              }
            } else {
              this.commonService.showErrorMessage('Error', data['message']);
            }
          });
      }
    });
  }
  betters: any = [];
  loadBetters(discovery: any): void {
    this.selectedDiscovery = discovery;
    var url = 'mainservice/discoveryBetting/get?discoveryId=' + discovery.id;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200 && data['dataArray'] != null) {
        this.betters = data['dataArray'];
        this.bettersModal.show();
      }
    });
  }
  isBettingWindowOpen(discovery: any): any {
    if (!discovery.requirement) {
      return false;
    }
    if (discovery.status > 9) {
      //selected2Adv
      return false;
    }
    if (
      this.commonService.getDaysBetween(
        this.commonService.getJsDateObject(discovery.createdOn),
        new Date()
      ) > 30
    ) {
      return false;
    }
    if (
      discovery.requirement.status.id != 2 &&
      discovery.requirement.status.id != 3 &&
      discovery.requirement.status.id != 8
    ) {
      return false;
    }
    return true;
  }

  // for updating the status of candidate

  showUpdateStatus(): void {
    this.loadShortlistingDetail();
    this.updateStatusModal.show();
    this.loadFeedbacks();
    this.loadRemarks();
    this.loadCommunityMembersForUpdate();
  }

  getMemberFromUserId(userId: any): any {
    for (var i = 0; i < this.membersArray.length; i++) {
      if (this.membersArray[i].user.id == userId) return this.membersArray[i];
    }
    return undefined;
  }

  shortlist: any = {};
  previousStatus: string = '';
  loadShortlistingDetail(): void {
    if (this.selectedCandidate.requirement.id == -1) {
      this.loadCandidateDetails();
      this.loadCommunityMembers();
      this.loadUpdateStatus();
      return;
    }
    var url =
      'mainservice/recruitment/shortlisting/shortlist/' +
      this.selectedCandidate.requirement.id +
      '/' +
      this.selectedCandidate.id;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.shortlist = data['dataObject'];
        this.previousStatus = this.shortlist.status.name;
        if (this.shortlist.candidate.currentCtcTotal == 0)
          this.shortlist.candidate.currentCtcTotal =
            this.shortlist.candidate.currentCtcFixed +
            this.shortlist.candidate.currentCtcVariable;
        if (
          this.shortlist.requirement.clientAnchorId ==
            this.commonService.user.id ||
          this.shortlist.requirement.standbyClientAnchorId ==
            this.commonService.user.id
        )
          this.amIClientAnchor = true;
        else this.amIClientAnchor = false;
        this.loadCommunityMembers();
        var createdDate = this.commonService.getJsDateObject(
          this.shortlist.createdOn
        );

        if (createdDate) {
          this.daysSinceDiscovery = this.commonService.getDaysBetween(
            createdDate,
            new Date()
          );
        } else {
          // Handle the case where createdDate is undefined
          console.error('createdDate is undefined');
        }
        this.loadUpdateStatus();
        // this.loadJustificiations();
      }
    });
  }

  candidate: any = {};
  daysSinceDiscovery: any = 0;
  loadCandidateDetails(): void {
    var url = 'mainservice/recruitment2/candidate/' + this.selectedCandidate.id;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.candidate = data['dataObject'];
        this.shortlist = {};
        this.shortlist.candidate = this.candidate;
        if (this.candidate.currentCtcTotal == 0)
          this.candidate.currentCtcTotal =
            this.candidate.currentCtcFixed + this.candidate.currentCtcVariable;
        this.daysSinceDiscovery = this.commonService.getDaysBetween(
          this.candidate.createdOn,
          new Date()
        );
      }
    });
  }
  updateStatus: any = [];
  loadUpdateStatus(): void {
    if (this.selectedCandidate.requirement.id < 1) {
      return;
    }
    this.updateStatus = [];
    var url =
      'mainservice/recruitment/shortlisting/status?currentStatus=' +
      this.shortlist.status.id;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.updateStatus = data['dataArray'];
      }
    });
    this.loadProcesses();
  }

  processes: any = [];
  loadProcesses(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment3/requirement/open/process/' +
          this.shortlist.requirement.id
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.processes = [];
        if (data['result'] === 200) {
          this.processes = data['dataArray'];
          console.log(this.processes);
        }
      });
  }

  remarks: any = [];
  feedbacks: any = [];
  loadFeedbacks(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment/shortlisting/clientfeedback/' +
          this.selectedCandidate.id
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.feedbacks = data['dataArray'];
        }
      });
  }

  // Load Remarks api
  loadRemarks() {
    this.remarks = [];
    var url =
      'mainservice/framework/generic/remark/' +
      this.selectedCandidate.id +
      '?category=recruitment-discovery';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.remarks = data['dataArray'];
      }
    });
  }

  updateDiscovery(): void {
    if (!this.shortlist.status) {
      this.commonService.showErrorMessage('Error', 'Status not selected.');
      return;
    }
    if (this.shortlist.joinedAtCtc && this.shortlist.joinedAtCtc < 100000) {
      this.commonService.showErrorMessage(
        'Error',
        'Joined at CTC to be mentioned in actual figures ex: 1000000'
      );
      return;
    }
    if (this.shortlist.status.id == 13) {
      if (!this.shortlist.doj) {
        this.commonService.showErrorMessage(
          'Error',
          'Please mention the tentative date of joining of the candidate.'
        );
        return;
      }
    }
    if (this.shortlist.status.id == 12 || this.shortlist.status.id == 17) {
      if (!this.shortlist.joinedAtCtc) {
        this.commonService.showErrorMessage(
          'Error',
          'Please mention joined at CTC in actual figures ex: 1000000'
        );
        return;
      }
      if (!this.shortlist.doj) {
        this.commonService.showErrorMessage(
          'Error',
          'Please mention the date of joining of the candidate.'
        );
        return;
      }
      if (!this.shortlist.candidateInteractorId) {
        this.commonService.showErrorMessage(
          'Error',
          'Please mention who has done the candidate interaction.'
        );
        return;
      }
    }
    this.commonService.showProcessingIcon();
    this.commonService.showInfoMessage('Info', 'Processing request');
    this.commonService
      .post('mainservice/recruitment/shortlisting/shortlist', this.shortlist)
      .subscribe((data: any) => {
        
        this.commonService.hideProcessingIcon();
        this.loadShortlistingDetail();
        if (data['result'] == 200) {
          for (var i = 0; i < this.shortlisting.length; i++) {
            if (this.shortlist.id == this.shortlisting[i].id) {
              this.shortlisting[i].status = this.shortlist.status;
              this.shortlisting[i].statusId = this.shortlist.status.id;
            }
          }
          if (this.previousStatus !== this.shortlist.status.name) {
            if (
              this.shortlist.status.id == 3 ||
              this.shortlist.status.id == 4 ||
              this.shortlist.status.id == 22 ||
              this.shortlist.status.id == 7 ||
              this.shortlist.status.id == 5 ||
              this.shortlist.status.id == 18 ||
              this.shortlist.status.id == 15 ||
              this.shortlist.status.id == 14 ||
              this.shortlist.status.id == 20 ||
              this.shortlist.status.id == 11
            ) {
              //for negative status updates, ask if the candidate needs to be marked for nurture or not.
              this.offerToNurtureCandidate();
            }
            var link =
              '/recr/discoveryDetails/' +
              this.shortlist.requirement.id +
              '/' +
              data['dataObject'].id;
            var message =
              'Discovery status of candidate ' +
              this.shortlist.candidate.name +
              ' for the role ' +
              this.shortlist.requirement.role.name +
              ' for ' +
              this.shortlist.requirement.client.name +
              ' has changed to ' +
              this.shortlist.status.name +
              '.';
            if (
              this.discovererMember &&
              this.discovererMember.acceptanceByAce === 1 &&
              this.discovererMember.acceptanceByAceMaker === 1
            ) {
              this.commonService.sendNotification(
                this.shortlist.createdBy.id + '',
                message,
                link,
                'COMMUNITY MEMBER',
                1,
                1,
                1
              );
            }
            var anchor = this.getMemberFromUserId(
              this.shortlist.requirement.standbyClientAnchorId
            );
            if (
              anchor &&
              anchor.acceptanceByAce === 1 &&
              anchor.acceptanceByAceMaker === 1 &&
              this.myId !== this.shortlist.requirement.standbyClientAnchorId
            )
              this.commonService.sendNotification(
                this.shortlist.requirement.standbyClientAnchorId + '',
                message,
                link,
                'COMMUNITY MEMBER',
                1,
                1,
                1
              );
            anchor = this.getMemberFromUserId(
              this.shortlist.requirement.clientAnchorId
            );
            if (
              anchor &&
              anchor.acceptanceByAce === 1 &&
              anchor.acceptanceByAceMaker === 1 &&
              this.myId != this.shortlist.requirement.clientAnchorId
            )
              this.commonService.sendNotification(
                this.shortlist.requirement.clientAnchorId + '',
                message,
                link,
                'COMMUNITY MEMBER',
                1,
                1,
                1
              );
          }

          this.commonService.showInfoMessage('Info', 'Updation successful.');
          this.updateStatusModal.hide();
        } else {
          this.commonService.showInfoMessage('Info', data['message']);
        }
      });
  }

  offerToNurtureCandidate(): void {
    // Swal.fire({
    //   title: '',
    //   text: "Thats unfortunate, the talent didn't get through. Would you like to mark him/her for nurture ?",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: 'rgb(3, 142, 220)',
    //   cancelButtonColor: 'rgb(243, 78, 78)',
    //   confirmButtonText: 'Yes',
    // }).then((result: any) => {
    //   if (result.value) {
    this.shortlist.candidate.nurture = true;
    this.updateCandidate(this.shortlist.candidate);
    //   }
    // });
  }

  discovererMember: any = {};
  loadDiscovererMembership(): void {
    this.commonService
      .get(
        'mainservice/framework/members/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=0,1,2,3,4,5,6,7,8,9,10&acceptanceByAceMakerValues=0,1,2,3,4,5,6,7,8,9,10&userId=' +
          this.commonService.user.id +
          '&roleInCommunity=0,1'
      )
      .subscribe((data: any) => {
        var temp = data['dataArray'];
        this.discovererMember = temp[0];
      });
  }

  // Load Community Member
  members: any = [];
  otherMembersId: any = '';
  candidateInteractor: any = '';
  myMembership: any;
  users: any = [];
  loadCommunityMembersForUpdate(): void {
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
          this.members = data['dataArray'];
          this.users = [];
          for (var i = 0; i < this.members.length; i++) {
            this.users.push(this.members[i].user);
          }
          if (!this.members || this.members.length == 0) {
            this.members = [];
            this.checkIfIamAceMaker();
            return;
          }
          this.checkIfIamAceMaker();
          for (var i = 0; i < this.members.length; i++) {
            if (
              this.shortlist.candidateInteractorId &&
              this.shortlist.candidateInteractorId == this.members[i].user.id
            ) {
              this.candidateInteractor = this.members[i].user.name;
            }
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
            } else {
              this.myMembership = this.members[i];
            }
          }
        }
        this.addCandidateInteractoryUserObj();
      });
  }
  addCandidateInteractoryUserObj(): void {
    if (!this.shortlist.candidateInteractorId) return;
    this.commonService
      .get(
        'mainservice/framework/members2/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=1,2,3,4,5,6,7,8,9' +
          '&searchText=' +
          this.memberSearch +
          '&acceptanceByAceMakerValues=1,2,3,4,5,6,7,8,9' +
          '&userId=' +
          this.shortlist.candidateInteractorId +
          '&pageNum=1' +
          '&pageSize=10&approvedOnMonth=&jobFamily='
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.members = data['dataArray'];
          if (this.members.length > 0) {
            this.users.push(this.members[0].user);
            this.candidateInteractor = this.members[0].user.name;
          }
        }
      });
  }

  confirmStatusChange(): void {
    setTimeout(() => {
      Swal.fire({
        title: 'Confirmation required',
        text:
          'Are you sure you want to update the status to ' +
          this.shortlist.status.name +
          ' ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(3, 142, 220)',
        cancelButtonColor: 'rgb(243, 78, 78)',
        confirmButtonText: 'Yes',
      }).then((result: any) => {
        if (result.value) {
          this.updateDiscovery();
          // this.edit.status = false;
        }
      });
    }, 300);
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
}
