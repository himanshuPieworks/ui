import { Component, OnInit, ViewChild } from '@angular/core';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import {GenericCompareLineChartComponent} from '../generic-compare-line-chart/generic-compare-line-chart.component';

@Component({
  selector: 'app-analytics-report',
  templateUrl: './analytics-report.component.html',
  styleUrls: ['./analytics-report.component.scss'],
})
export class AnalyticsReportComponent {
  @ViewChild('bargraph') bargraph: any;
  @ViewChild('stackedbargraph') stackedbargraph: any;
  @ViewChild('linegraph') linegraph: any;
  @ViewChild('compareLinegraph') compareLinegraph: any;
  breadCrumbItems!: Array<{}>;
  constructor(private commonService: PieworksCommonService) {
    setTimeout(() => {
      this.loadBarGraph('s2c', 's2c');
      this.loadLineGraph('s2c', 's2c');
      this.loadCompareLineGraph('s2c', 's2c');
    }, 300);
     setTimeout(() => {
     this.hideAllGraphs();
     this.loadBarGraph('s2c', 's2c');
    }, 2000);
    this.years.push(new Date().getFullYear());
    this.years.push(new Date().getFullYear() - 1);
    this.years.push(new Date().getFullYear() - 2);
    this.years.push(new Date().getFullYear() - 3);
    this.years.push(new Date().getFullYear() - 4);
    this.loadClients(undefined);
    this.loadAvaialbleSectors();
    this.loadGrades();
    this.loadMembers();
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
  }
  allMonths: any = [];
  summary: any = '';
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Analytics', link: '/recr/analytics', active: false },
      { label: 'Delivery-Analytics', active: true },
    ];
  }
  months = [
    { name: 'Jan-Mar', startDate: '01-01', endDate: '03-31' },
    { name: 'Apr-Jun', startDate: '04-01', endDate: '06-30' },
    { name: 'Jul-Sep', startDate: '07-01', endDate: '09-30' },
    { name: 'Oct-Dec', startDate: '10-01', endDate: '12-31' },
  ];
  years: any = [];
  selectedMonth: any;
  selectedYear: any;
  selectedIndividualMonth: any;
  loadMonthlyReport(): void {
    this.selectedMonth = undefined;
    this.selectedYear = undefined;
    this.startDate = this.selectedIndividualMonth.startDate;
    this.endDate = this.selectedIndividualMonth.endDate;
    this.filterChanged();
  }
  // loadQuarterReport(): void {
  //   this.selectedIndividualMonth = undefined;
  //   if (this.selectedMonth && this.selectedYear) {
  //     this.startDate = this.selectedYear + '-' + this.selectedMonth.startDate;
  //     this.endDate = this.selectedYear + '-' + this.selectedMonth.endDate;
  //     this.filterChanged();
  //   }
  // }
  loadQuarterReport(): void {
    this.selectedIndividualMonth = undefined;
    if (this.selectedMonth && this.selectedYear) {
      // Case when both month and year are selected
      this.startDate = `${this.selectedYear}-${this.selectedMonth.startDate}`;
      this.endDate = `${this.selectedYear}-${this.selectedMonth.endDate}`;
    } else if (this.selectedYear) {
      // Case when only year is selected
      this.startDate = `${this.selectedYear}-01-01`;
      this.endDate = `${this.selectedYear}-12-31`;
    }
    this.filterChanged();
  }

  section = 1;
  selectedReport: any = 'Active Ratio';
  selectedReportName: any;
  bargraphLabels: any = ['1', '2'];
  bargraphData: any = [{ data: [0.0, 0.0], label: this.selectedReport }];
  userId: any = -1;
  selectedTab: any = 'community';
  startDate: any;
  endDate: any;
  gradeId: any = -1;
  gender: any = 'all';
  clientId: any = [];
  clientAnchorId: any;
  sector: any = 'all';
  monthlyCreation: any = 'true';
  enableBar:any=true;
  enableStackedbargraph:any=true;
  enableMultipleLineComparison:any=true;
  enableCompareLineGraph:any=true;
  hideAllGraphs():void
  {  
    this.enableBar=false;
    this.enableStackedbargraph=false;
    this.enableMultipleLineComparison=false;
    this.enableCompareLineGraph=false;
  }
  // mainservice/recruitment3/forward?api=analytics2/northstarComparision?communityId=2,userIds=3,2900,startDate=2024-01-01,endDate=2024-07-31,clientId=-1,reportName=s2c,clientAnchorId=-1
  loadBarGraph(reportName: any, selectedReportTitle: any) {
    //this.commonService.showInfoMessage("Info","loading data...")
    this.enableBar = true;
    this.selectedDetails = '';
    this.selectedReportName = reportName;
    this.selectedReport = selectedReportTitle;
    this.commonService.goTop();
    var tempClientId: any = '';
    if (!this.clientId || this.clientId.length == 0) {
      this.clientId = [];
      this.clientId.push(-1);
    }
    for (var i = 0; i < this.clientId.length; i++) {
      if (i == 0) tempClientId = this.clientId[i];
      else tempClientId = tempClientId + '=' + this.clientId[i];
    }

    if (this.clientId[0] == -1) this.clientId = [];
    var url =
      'mainservice/recruitment3/forward?api=analytics2/' +
      reportName +
      '?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.userId;
    url = url + ',startDate=' + this.startDate;
    url = url + ',endDate=' + this.endDate;
    url = url + ',clientId=' + tempClientId;
    url = url + ',reportName=' + reportName;
    if (this.clientAnchorId)
      url = url + ',clientAnchorId=' + this.clientAnchorId;
    else url = url + ',clientAnchorId=-1';
    this.commonService.showProcessingIcon();
    //this.bargraph.render([], []);
    this.summary = '';
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.commonService.hideProcessingIcon();
        this.infoArray = data['dataObject'].split('#');
        var onBarLabels: any;
        if (this.infoArray.length > 2) {
          onBarLabels = this.infoArray[2].split(',');
        }
        this.bargraphLabels = this.infoArray[0].split(',').reverse();
        if (this.infoArray.length > 1)
          this.infoArray = this.infoArray[1].split(',').reverse();
        else this.infoArray = [];
        console.log(this.infoArray.length + ' RAJEEN');
        this.bargraphData[0].data = data['dataArray'].reverse();
        this.bargraphData[0].label = selectedReportTitle;
        this.bargraph.parentObj = this;
        this.bargraph.render(
          this.bargraphLabels,
          this.bargraphData[0].data,
          onBarLabels
        );
        this.formSummary();
      } else {
        this.bargraphData[0].data = [];
        this.bargraphLabels = [];
        this.bargraph.render(
          this.bargraphLabels,
          this.bargraphData[0].data,
          onBarLabels
        );
      }
    });
    this.enableFilters(this.selectedReportName, this.selectedReport);
  }
  formSummary(): void {
    if (this.bargraphData[0].data.length == 0) {
      return;
    }
    this.summary = '';
    if (
      this.selectedReportName == 's2c' ||
      this.selectedReportName == '2callNInterested' ||
      this.selectedReportName == 'expCallAndIntv' ||
      this.selectedReportName == 'offerSent' ||
      this.selectedReportName == 'joined' ||
      this.selectedReportName == 'suretyPrdOver'
    ) {
      let sum = 0;
      for (let i = 0; i < this.bargraphData[0].data.length; i++) {
        sum = sum + this.bargraphData[0].data[i];
      }
      this.summary = 'Total : ' + sum;
    }
    if (this.selectedReportName == 'timeToHire') {
      let avg = 0;
      for (let i = 0; i < this.bargraphData[0].data.length; i++) {
        avg = avg + this.bargraphData[0].data[i];
      }
      this.summary = 'Average : ' + avg / this.bargraphData[0].data.length;
      this.summary = this.summary.split('.')[0];
    }
  }
  infoArray: any = [];
  selectedDetails: any = '';
  clientSearch: any = '';
  clientHandle: any;
  clients: any = [];
  loadClients(cb: any): void {
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
          if (cb) cb();
        }
      });
  }
  // on client search
  onClientSearch(item: any) {
    this.clientSearch = item.term;
    this.loadClients(undefined);
  }

  // when client is already loaded locally then this method made it local search
  clientLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
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
      if (this.enableBar)
        this.loadBarGraph(this.selectedReportName, this.selectedReport);
      else if (this.enableStackedbargraph) {
        this.summary = '';
        this.loadStackedBarGraph(this.selectedReportName, this.selectedReport);
      }
      if (this.enableMultipleLineComparison)
        this.loadLineGraph(this.selectedReportName, this.selectedReport);
      if(this.enableCompareLineGraph)
        this.loadCompareLineGraph(this.selectedReportName, this.selectedReport);
    }, 500);
  }
  clearFilter(): void {
    setTimeout(() => {
      this.clientAnchorId = undefined;
      this.selectedIndividualMonth = undefined;
      this.userId = -1;
      this.userIds="";
      this.gradeId = -1;
      this.clientId = [];
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
  filters: any = [];
  enableFilters(selectedReportName: any, selectedReport: any): void {
    this.filters = [];
    this.filters['months'] = true;
    this.filters['quarter'] = true;
    this.filters['year'] = true;
    this.filters['from'] = true;
    this.filters['to'] = true;
    this.filters['client'] = true;
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
    } else if (selectedReportName.indexOf('openMandateAging') != -1) {
      this.filters['months'] = false;
      this.filters['quarter'] = false;
      this.filters['year'] = false;
    }
    else if(selectedReportName=='northstarComparision')
    {
        this.filters['cm'] = true;
        this.filters['from'] = false;
        this.filters['to'] = false;
        this.filters['months'] = false;
    }
     else if(selectedReportName=='unattendedDiscoveries')
    {
        this.filters['client'] = true;
        this.filters['months'] = false;
        this.filters['quarter'] = false;
        this.filters['year'] = false;
        this.filters['from'] = false;
        this.filters['to'] = false;
    }
  }
  doubleClicked = 0;
  clickedOnBar(index: any, obj: any) {
    obj.selectedDetails = obj.infoArray[index];
    obj.selectedDetails = obj.selectedDetails.split("1 talents are").join("1 talent is");
    this.doubleClicked = obj.doubleClicked + 1;
    if (obj.doubleClicked == 2) {
      var clientName = obj.selectedDetails
        .split('for ')[1]
        .split('.')[0]
        .trim();
      var temp = this.clientSearch;
      obj.clientSearch = clientName;
      obj.loadClients(() => {
        for (var i = 0; i < obj.clients.length; i++) {
          if (obj.clients[i].name.trim() == clientName) {
            obj.clientId = [];
            obj.clientId.push(obj.clients[i].id);
            obj.loadBarGraph(obj.selectedReportName, obj.selectedReport);
            break;
          }
        }
        obj.clientSearch = temp;
        obj.loadClients(undefined);
      });
    }
    setTimeout(() => {
      this.doubleClicked = 0;
    }, 500);
  }
  loadStackedBarGraph(reportName: any, selectedReportTitle: any) {
    //        this.commonService.showInfoMessage("Info","loading data...")
    this.enableStackedbargraph=true;
    this.selectedDetails = '';
    this.summary = '';
    this.selectedReportName = reportName;
    this.selectedReport = selectedReportTitle;
    this.commonService.goTop();
    var tempClientId: any = '';
    if (!this.clientId || this.clientId.length == 0) {
      this.clientId = [];
      this.clientId.push(-1);
    }
    for (var i = 0; i < this.clientId.length; i++) {
      if (i == 0) tempClientId = this.clientId[i];
      else tempClientId = tempClientId + '=' + this.clientId[i];
    }

    if (this.clientId[0] == -1) this.clientId = [];
    var url =
      'mainservice/recruitment3/forward?api=analytics2/' +
      reportName +
      '?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.userId;
    url = url + ',startDate=' + this.startDate;
    url = url + ',endDate=' + this.endDate;
    url = url + ',clientId=' + tempClientId;
    url = url + ',reportName=' + reportName;
    if (this.clientAnchorId)
      url = url + ',clientAnchorId=' + this.clientAnchorId;
    else url = url + ',clientAnchorId=-1';
    this.commonService.showProcessingIcon();
    //this.bargraph.render([], []);
    var i = 0;
    console.log('calling url');
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.commonService.hideProcessingIcon();
        this.infoArray = data['dataObject'].split('#');
        this.bargraphLabels = this.infoArray[0].split(',');
        if (this.infoArray.length > 1)
          this.infoArray = this.infoArray[1].split(',');
        else this.infoArray = [];
        this.stackedbargraph.parentObj = this;
        this.stackedbargraph.render(this.bargraphLabels, data['dataArray']);
      } else {
        console.log('else area');
        this.bargraphLabels = [];
        this.stackedbargraph.render(this.bargraphLabels, []);
      }
    });
    this.enableFilters(this.selectedReportName, this.selectedReport);
  }
  linegraphLabels: any = ['1', '2'];
  loadLineGraph(reportName: any, selectedReportTitle: any) {
    //        this.commonService.showInfoMessage("Info","loading data...")
    this.enableMultipleLineComparison=true;
    this.selectedDetails = '';
    this.selectedReportName = reportName;
    this.selectedReport = selectedReportTitle;
    this.commonService.goTop();
    var tempClientId: any = '';
    if (!this.clientId || this.clientId.length == 0) {
      this.clientId = [];
      this.clientId.push(-1);
    }
    for (var i = 0; i < this.clientId.length; i++) {
      if (i == 0) tempClientId = this.clientId[i];
      else tempClientId = tempClientId + '=' + this.clientId[i];
    }

    if (this.clientId[0] == -1) this.clientId = [];
    var url =
      'mainservice/recruitment3/forward?api=analytics2/lineComparison?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.userId;
    url = url + ',startDate=' + this.startDate;
    url = url + ',endDate=' + this.endDate;
    url = url + ',clientId=' + tempClientId;
    url = url + ',reportName=' + reportName;
    if (this.clientAnchorId)
      url = url + ',clientAnchorId=' + this.clientAnchorId;
    else url = url + ',clientAnchorId=-1';
    this.commonService.showProcessingIcon();
    //this.bargraph.render([], []);
    var i = 0;
    console.log('calling url');
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.commonService.hideProcessingIcon();
        var infoArray = data['dataObject'].split('#');
        this.linegraphLabels = infoArray[0].split(',');

        this.linegraph.parentObj = this;
        this.linegraph.render(
          this.linegraphLabels,
          data['dataArray'].reverse()
        );
      } else {
        console.log('else area');
        this.linegraphLabels = [];
        this.linegraph.render(this.linegraphLabels, []);
      }
    });
    this.enableFilters(this.selectedReportName, this.selectedReport);
  }
 compareLinegraphLabels="";userIds:any=[];
  loadCompareLineGraph(reportName: any, selectedReportTitle: any) {
    this.enableCompareLineGraph=true;
    this.selectedDetails = '';
    this.selectedReportName = reportName;
    this.selectedReport = selectedReportTitle;
    this.commonService.goTop();
    var tempClientId: any = '';
    if (!this.clientId || this.clientId.length == 0) {
      this.clientId = [];
      this.clientId.push(-1);
    }
    for (var i = 0; i < this.clientId.length; i++) {
      if (i == 0) tempClientId = this.clientId[i];
      else tempClientId = tempClientId + '=' + this.clientId[i];
    }

    if (this.clientId[0] == -1) this.clientId = [];
    var url =
      'mainservice/recruitment3/forward?api=analytics2/northstarComparision?communityId=' +
      localStorage.getItem('communityId') +
      ',userIds=' +
      (this.userIds.toString()).split(",").join("-");

    url = url + ',startDate=' + this.startDate;
    url = url + ',endDate=' + this.endDate;
    url = url + ',clientId=' + tempClientId;
    url = url + ',reportName=' + reportName;
    if (this.clientAnchorId)
      url = url + ',clientAnchorId=' + this.clientAnchorId;
    else url = url + ',clientAnchorId=-1';


    this.commonService.showProcessingIcon();
    //this.bargraph.render([], []);
    var i = 0;
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.commonService.hideProcessingIcon();
        var infoArray = data['dataObject'].split('#');
        this.compareLinegraphLabels = infoArray[0].split(',');

        this.compareLinegraph.parentObj = this;
        if (this.userIds.length>1)
        {
          this.compareLinegraph.globalColors = this.compareLinegraph.generateRandomColors(20,false);
          this.compareLinegraph._lineWithDataLabelsChart(JSON.stringify(this.compareLinegraph.globalColors));
        }
        else
        {
          this.compareLinegraph.globalColors = this.compareLinegraph.generateRandomColors(20,true);
          this.compareLinegraph._lineWithDataLabelsChart(JSON.stringify(this.compareLinegraph.globalColors));
        }
        this.compareLinegraph.render(
          this.compareLinegraphLabels,
          data['dataArray'].reverse()
        );
      } else {
        console.log('else area');
        this.linegraphLabels = [];
        this.compareLinegraph.render(this.linegraphLabels, []);
      }
    });
    this.enableFilters(this.selectedReportName, this.selectedReport);

  }


  areColumnsVisible = true;

  onSelectChange(event: any) {
    this.areColumnsVisible = event.selectedOption;
    this.filterChanged()
  }
}
