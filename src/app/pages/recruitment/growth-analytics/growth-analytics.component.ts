import { Component, ViewChild } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-growth-analytics',
  templateUrl: './growth-analytics.component.html',
  styleUrls: ['./growth-analytics.component.scss'],
})
export class GrowthAnalyticsComponent {
  @ViewChild('bargraph') bargraph: any;
  @ViewChild('linegraph') linegraph: any;
  breadCrumbItems!: Array<{}>;

  endDate: any;
  startDate: any;
  years: any = [];
  selectedMonth: any;
  selectedYear: any;
  selectedIndividualMonth: any;
  constructor(private commonService: PieworksCommonService) {
    setTimeout(() => {
      this.loadBarGraph('growth/clients', 'Clients');
    }, 300);

    this.years.push(new Date().getFullYear());
    this.years.push(new Date().getFullYear() - 1);
    this.years.push(new Date().getFullYear() - 2);
    this.years.push(new Date().getFullYear() - 3);
    this.years.push(new Date().getFullYear() - 4);

    this.endDate = this.commonService
      .getFormatedDate(new Date(), this.commonService.mysqlFormat)
      .split(' ')[0];
    this.startDate = this.commonService
      .getFormatedDate(
        this.commonService.getDateXDaysAgo(
          new Date().getDate() - 1,
          new Date()
        ),
        this.commonService.mysqlFormat
      )
      .split(' ')[0];

    let temp = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sept,Oct,Nov,Dec'.split(',');
    const currentMonthIndex = new Date().getMonth();
    temp = temp.slice(0, currentMonthIndex + 1).reverse();
    let year = new Date().getFullYear();
    for (var i = 0; i < 5; i++) {
      if (i > 0)
        temp = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sept,Oct,Nov,Dec'
          .split(',')
          .reverse();
      let month = 0;
      for (var j = 0; j < temp.length; j++) {
        month = temp.length - j;
        let monthString = month + '';
        if (month < 10) monthString = '0' + monthString;
        let nextMonth = month + 1;
        let nextMonthString = nextMonth + '';
        if (nextMonth < 10) nextMonthString = '0' + nextMonthString;
        let nextYear = year;
        if (nextMonth == 13) {
          nextYear = year + 1;
          nextMonthString = '01';
        }
        this.allMonths.push({
          name: temp[j] + ', ' + year,
          startDate: year + '-' + monthString + '-01',
          endDate: nextYear + '-' + nextMonthString + '-01',
        });
        if (this.startDate == year + '-' + monthString + '-01')
          this.selectedIndividualMonth = {
            name: temp[j] + ', ' + year,
            startDate: year + '-' + monthString + '-01',
            endDate: nextYear + '-' + nextMonthString + '-01',
          };
      }
      year = year - 1;
    }

    this.loadClients();
    this.loadAvaialbleSectors();
    this.loadGrades();
    this.loadMembers();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Analytics', link: '/recr/analytics', active: false },
      { label: 'Client-Analytics', active: true },
    ];

    this.getNpsOrgData();
  }

  // Nps Org data
  npsOrgData: any;
  getNpsOrgData() {
    let url =
      'mainservice/recruitment3/forward?api=analytics2/orgNps?communityId=' +
      localStorage.getItem('communityId');

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.npsOrgData = data['dataObject'];
        console.log('NPS Org Data: ', this.npsOrgData);
      }
    });
  }

  //   for start Date End date filters by months:)
  months = [
    { name: 'Jan-Mar', startDate: '01-01', endDate: '03-31' },
    { name: 'Apr-Jun', startDate: '04-01', endDate: '06-30' },
    { name: 'Jul-Sep', startDate: '07-01', endDate: '09-30' },
    { name: 'Oct-Dec', startDate: '10-01', endDate: '12-31' },
  ];
  allMonths: any = [];
  loadMonthlyReport(): void {
    this.selectedMonth = undefined;
    this.selectedYear = undefined;
    this.startDate = this.selectedIndividualMonth.startDate;
    this.endDate = this.selectedIndividualMonth.endDate;
    this.filterChanged();
  }
  loadQuarterReport(): void {
    this.selectedIndividualMonth = undefined;
    if (this.selectedMonth && this.selectedYear) {
      this.startDate = this.selectedYear + '-' + this.selectedMonth.startDate;
      this.endDate = this.selectedYear + '-' + this.selectedMonth.endDate;
      this.filterChanged();
    }
  }
  section = 1;
  selectedReport: any = 'Active Ratio';
  selectedReportName: any;
  bargraphLabels: any = ['1', '2'];
  bargraphData: any = [{ data: [0.0, 0.0], label: this.selectedReport }];
  userId: any = -1;
  selectedTab: any = 'community';
  gradeId: any = -1;
  gender: any = 'all';
  clientId: any = -1;
  sector: any = 'all';
  monthlyCreation: any = 'true';
  barChar: any = false;
  loadBarGraph(reportName: any, selectedReportTitle: any) {
    this.barChar = true;
    this.selectedDetails = '';
    var report = 'unknown';
    if (selectedReportTitle == 'Average Interviews Attended') {
      report = 'avgInterviews';
    }
    if (selectedReportTitle == 'Average Offers') {
      report = 'avgOffers';
    }
    if (selectedReportTitle == 'Average Declines') {
      report = 'avgDeclines';
    }
    this.selectedReportName = reportName;
    this.selectedReport = selectedReportTitle;
    this.commonService.goTop();

    if (!this.userId) this.userId = -1;
    if (!this.gradeId) this.gradeId = -1;
    if (!this.clientId) this.clientId = -1;
    if (!this.sector) this.sector = 'all';
    if (!this.gender) this.gender = 'all';

    var url =
      'mainservice/recruitment3/forward?api=analytics/' +
      reportName +
      '?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.userId;
    url = url + ',gradeId=' + this.gradeId;
    url = url + ',gender=' + this.gender;
    url = url + ',clientId=' + this.clientId;
    url = url + ',sector=' + this.sector;
    url =
      url +
      ',countByJobFunction=' +
      this.countByJobFunction +
      ',countBySector=' +
      this.countBySector +
      ',countByRole=' +
      this.countByRole +
      ',countByCtcBucket=' +
      this.countByCtcBucket;
    url =
      url +
      ',reportName=' +
      report +
      ',monthlyCreation=' +
      this.monthlyCreation;
    this.commonService.showProcessingIcon();
    //this.bargraph.render([], []);
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.commonService.hideProcessingIcon();
        this.infoArray = data['dataObject'].split('#');
        this.bargraphLabels = this.infoArray[0].split(',').reverse();
        if (this.infoArray.length > 1)
          this.infoArray = this.infoArray[1].split(',').reverse();
        else this.infoArray = [];
        this.bargraphData[0].data = data['dataArray'].reverse();
        this.bargraphData[0].label = selectedReportTitle;
        this.bargraph.render(this.bargraphLabels, this.bargraphData[0].data);
        this.bargraph.parentObj = this;
      }
    });
    this.enableFilters(this.selectedReportName, this.selectedReport);
  }
  infoArray: any = [];
  selectedDetails: any = '';
  linegraphLabels: any = ['1', '2'];
  loadBarGraphNewMandate(reportName: any, selectedReportTitle: any) {
    this.barChar = false;
    this.selectedDetails = '';

    this.selectedReportName = reportName;
    this.selectedReport = selectedReportTitle;

    var url =
      'mainservice/recruitment3/forward?api=analytics2/oldNewClientComparison?communityId=' +
      localStorage.getItem('communityId') +
      ',startDate=' +
      this.startDate +
      ',endDate=' +
      this.endDate;

    //    var url =
    //    'mainservice/recruitment3/forward?api=analytics2/oldNewClientComparison?communityId=' +
    //    localStorage.getItem('communityId') +
    //    ',startDate=2023-01-01,endDate=2023-04-01';
    console.log('calling url');
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.commonService.hideProcessingIcon();
        this.linegraphLabels = data['dataObject'].months;
        this.linegraph.parentObj = this;
        this.linegraph.render(this.linegraphLabels, [
          {
            data: data['dataObject'].oldClientsCount,
            name: 'Old Client Mandates',
          },
          {
            data: data['dataObject'].newClientsCount,
            name: 'New Client Mandates',
          },
        ]);
      } else {
        console.log('else area');
        this.linegraphLabels = [];
        this.linegraph.render(this.linegraphLabels, []);
      }
    });
    this.enableFilters(this.selectedReportName, this.selectedReport);
  }

  clientSearch: any = '';
  clientHandle: any;
  clients: any = [];
  loadClients(): void {
    if (this.clientHandle) this.clientHandle.unsubscribe();
    this.commonService.showProcessingIcon();
    this.clientHandle = this.commonService
      .get(
        'mainservice/framework/client?searchText=' +
          this.clientSearch +
          '&communityId=' +
          localStorage.getItem('communityId')
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        //this.clients = [];
        if (data['result'] === 200) {
          this.clients = data['dataArray'];
        }
      });
  }
  availableSectors: any = [];
  searchText: any;
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
  genders: any = ['Male', 'Female', 'Transgender', 'Transexual'];
  grades: any = [];
  grade: any = -1;
  loadGrades(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/grades')
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.grades = data['dataArray'];
      });
  }
  countByJobFunction: any = 'false';
  countBySector: any = 'true';
  countByRole: any = 'false';
  countByCtcBucket: any = 'false';
  selectedCountTalentBy(name: any) {
    this.countByJobFunction = 'false';
    this.countBySector = 'false';
    this.countByRole = 'false';
    this.countByCtcBucket = 'false';
    if (name == 'Job Function Wise') {
      this.countByJobFunction = 'true';
    } else if (name == 'Role Wise') {
      this.countByRole = 'true';
    } else if (name == 'Sector Wise') {
      this.countBySector = 'true';
    } else if (name == 'CTC bucket Wise') {
      this.countByCtcBucket = 'true';
    }
    this.filterChanged();
  }
  filterChanged(): void {
    setTimeout(() => {
      this.loadBarGraph(this.selectedReportName, this.selectedReport);
      this.loadBarGraphNewMandate(this.selectedReportName, this.selectedReport);
    }, 500);
  }
  clearFilter(): void {
    setTimeout(() => {
      this.userId = -1;
      this.gradeId = -1;
      this.clientId = -1;
      this.sector = 'all';
      this.gender = 'all';
      this.countByJobFunction = 'false';
      this.countBySector = 'false';
      this.countByRole = 'false';
      this.countByCtcBucket = 'true';
      this.selectedMonth = undefined;
      this.selectedYear = undefined;
      this.endDate = this.commonService
        .getFormatedDate(new Date(), this.commonService.mysqlFormat)
        .split(' ')[0];

      this.startDate = this.commonService
        .getFormatedDate(
          this.commonService.getDateXDaysAgo(
            new Date().getDate() - 1,
            new Date()
          ),
          this.commonService.mysqlFormat
        )
        .split(' ')[0];

      this.filterChanged();
    }, 500);
  }
  memberSearch: any;
  members: any;
  originalMembersList: any;
  loadMembers(): void {
    this.commonService.showProcessingIcon();
    var acceptanceByAceValues = '1';
    var acceptanceByAceMakerValues = '1';
    var roleInCommunity = '1';
    this.commonService
      .get(
        'mainservice/framework/members/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=' +
          acceptanceByAceValues +
          '&acceptanceByAceMakerValues=' +
          acceptanceByAceMakerValues +
          '&userId=-1&roleInCommunity=' +
          roleInCommunity
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.originalMembersList = data['dataArray'];
          this.members = JSON.parse(JSON.stringify(this.originalMembersList));
        }
      });
  }
  filterMembers(): void {
    this.members = JSON.parse(JSON.stringify(this.originalMembersList));
    for (var i = 0; i < this.members.length; ) {
      if (
        this.members[i].user.name
          .toUpperCase()
          .indexOf(this.memberSearch.toUpperCase()) == -1
      )
        this.members.splice(i, 1);
      else i = i + 1;
    }
  }
  filters: any = {};
  enableFilters(selectedReportName: any, selectedReport: any): void {
    this.filters = {};
    if (selectedReport == 'Active Ratio') {
      //this.filters["stage"]=true;
      //this.filters["gender"]=true;
    } else if (selectedReport == 'Efficiency Ratio') {
      this.filters['cm'] = true;
      this.filters['stage'] = true;
      this.filters['gender'] = true;
      this.filters['client'] = true;
      this.filters['sector'] = true;
    } else if (selectedReport == 'Attrition Ratio') {
      //this.filters["stage"]=true;
      //this.filters["gender"]=true;
    } else if (selectedReport == 'Wealth Ratio') {
      //this.filters["stage"]=true;
      //this.filters["gender"]=true;
    } else if (selectedReport == 'Hygiene') {
    } else if (selectedReport == 'Yield Ratio') {
      this.filters['cm'] = true;
      this.filters['stage'] = true;
      //this.filters["gender"]=true;
      this.filters['client'] = true;
      this.filters['sector'] = true;
    } else if (selectedReport == 'Hit Ratio') {
      this.filters['cm'] = true;
      this.filters['stage'] = true;
      //this.filters["gender"]=true;
      this.filters['client'] = true;
      this.filters['sector'] = true;
    } else if (selectedReport == 'Success Ratio') {
      this.filters['cm'] = true;
      this.filters['stage'] = true;
      //this.filters["gender"]=true;
      this.filters['client'] = true;
      this.filters['sector'] = true;
    } else if (selectedReport == 'Success Position Ratio') {
    } else if (selectedReport == 'Batches Position Ratio') {
    } else if (selectedReport == 'Discovery Aging') {
      this.filters['client'] = true;
      this.filters['position'] = true;
    } else if (selectedReport == 'Time To Closure') {
      this.filters['client'] = true;
    } else if (selectedReport == '9 Candidate Meeting') {
      this.filters['client'] = true;
    } else if (selectedReport == 'Average Interviews Attended') {
      this.filters['countByJobFunction'] = true;
      this.filters['countByRole'] = true;
      this.filters['countBySector'] = true;
      //this.filters["countByCtcBucket"]=true;
    } else if (selectedReport == 'Average Offers') {
      this.filters['countByJobFunction'] = true;
      this.filters['countByRole'] = true;
      this.filters['countBySector'] = true;
      //this.filters["countByCtcBucket"]=true;
    } else if (selectedReport == 'Average Declines') {
      this.filters['countByJobFunction'] = true;
      this.filters['countByRole'] = true;
      this.filters['countBySector'] = true;
      //this.filters["countByCtcBucket"]=true;
    } else if (selectedReport == 'Talent Count') {
      this.filters['countByJobFunction'] = true;
      this.filters['countByRole'] = true;
      this.filters['countBySector'] = true;
      this.filters['countByCtcBucket'] = true;
    } else if (selectedReport == 'Members') {
      this.filters['monthlyStrength'] = true;
      this.filters['monthlyCreation'] = true;
    } else if (selectedReportName.indexOf('growth') != -1) {
      this.filters['monthlyCreation'] = true;
    }
  }
  clickedOnBar(index: any, obj: any) {
    obj.selectedDetails = obj.infoArray[index];
  }

  // on client search
  onClientSearch(item: any) {
    this.clientSearch = item.term;
    this.loadClients();
  }

  // when client is already loaded locally then this method made it local search
  clientLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }
}
