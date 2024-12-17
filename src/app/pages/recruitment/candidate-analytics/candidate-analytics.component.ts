import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-candidate-analytics',
  templateUrl: './candidate-analytics.component.html',
  styleUrls: ['./candidate-analytics.component.scss'],
})
export class CandidateAnalyticsComponent {
  breadCrumbItems!: Array<{}>;
  @ViewChild('report') report: any;
  @ViewChild('report2') report2: any;
  candidate: any;
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Analytics', link: '/recr/analytics', active: false },
    ];

    this.years.push(new Date().getFullYear());
    this.years.push(new Date().getFullYear() - 1);
    this.years.push(new Date().getFullYear() - 2);
    this.years.push(new Date().getFullYear() - 3);
    this.years.push(new Date().getFullYear() - 4);
    this.loadClients(undefined);

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

    // this.candidate.endDate = this.endDate;
    // this.candidate.endDate = this.endDate;
    // setTimeout(()=> {this.report.endDate = this.endDate},500)

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

    this.getCandidateData();
  }
  months = [
    { name: 'Jan-Mar', startDate: '01-01', endDate: '03-31' },
    { name: 'Apr-Jun', startDate: '04-01', endDate: '06-30' },
    { name: 'Jul-Sep', startDate: '07-01', endDate: '09-30' },
    { name: 'Oct-Dec', startDate: '10-01', endDate: '12-31' },
  ];
  allMonths: any = [];
  summary = '';
  Table: any = [];
  myData: any;
  endDate: any;
  startDate: any;
  getCandidateData() {
    var url =
      'mainservice/dipstick/getSticksReport?pageNum=1&pageSize=100&startDate=' +
      this.startDate +
      '&endDate=' +
      this.endDate +
      '&clientId=' +
      this.clientId +
      '&talentName=' +
      this.talentName;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.myData = data['dataArray'];

        if (this.candidateDipstick) this.report.getCandidateData();
        if (this.clientDipstick) this.report2.getCandidateData();

        // setTimeout(() => {
        //   this.loadCandidate(this.myData[0].discoveryId);
        // }, 300);
      }
    });
  }

  years: any = [];
  selectedMonth: any;
  selectedYear: any;
  selectedIndividualMonth: any;
  loadMonthlyReport(): void {
    this.selectedMonth = undefined;
    this.selectedYear = undefined;
    this.startDate = this.selectedIndividualMonth.startDate;
    this.endDate = this.selectedIndividualMonth.endDate;

    if (this.candidateDipstick) {
      this.report.endDate = this.endDate;
      this.report.clientId = this.clientId;
      this.report.talentName = this.talentName;
      this.report.endDate = this.endDate;
      this.report.startDate = this.startDate;
    }
    if (this.clientDipstick) {
      this.report2.endDate = this.endDate;
      this.report2.clientId = this.clientId;
      this.report2.talentName = this.talentName;
      this.report2.endDate = this.endDate;
      this.report2.startDate = this.startDate;
    }
    this.filterChanged();
  }
  loadQuarterReport(): void {
    this.selectedIndividualMonth = undefined;
    if (this.selectedMonth && this.selectedYear) {
      this.startDate = this.selectedYear + '-' + this.selectedMonth.startDate;
      this.endDate = this.selectedYear + '-' + this.selectedMonth.endDate;

      if (this.candidateDipstick) {
        this.report.endDate = this.endDate;
        this.report.clientId = this.clientId;
        this.report.talentName = this.talentName;
        this.report.endDate = this.endDate;
        this.report.startDate = this.startDate;
      }
      if (this.clientDipstick) {
        this.report2.endDate = this.endDate;
        this.report2.clientId = this.clientId;
        this.report2.talentName = this.talentName;
        this.report2.endDate = this.endDate;
        this.report2.startDate = this.startDate;
      }
      this.filterChanged();
    }
  }
  infoArray: any = [];
  selectedDetails: any = '';
  clientSearch: any = '';
  clientHandle: any;
  clients: any = [];
  clientId: any = -1;
  talentName: any = '';
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

  candidateDipstick: boolean = false;
  clientDipstick: boolean = false;

  onClickDipstick(name: string) {
    if (name == 'candidate') {
      this.candidateDipstick = true;
      this.clientDipstick = false;
    }
    if (name == 'client') {
      this.candidateDipstick = false;
      this.clientDipstick = true;
    }
    if (name == 'nothing') {
      this.candidateDipstick = false;
      this.clientDipstick = false;
    }
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
  filterChanged(): void {
    if (this.candidateDipstick) {
      this.report.clientId = this.clientId;
      this.report.talentName = this.talentName;
    }
    if (this.clientDipstick) {
      this.report2.endDate = this.endDate;
      this.report2.clientId = this.clientId;
      this.report2.talentName = this.talentName;
      this.report2.endDate = this.endDate;
      this.report2.startDate = this.startDate;
    }
    this.getCandidateData();
    // if(this.candidateDipstick)
    //   this.report.getCandidateData();
  }
  clearFilter(): void {
    setTimeout(() => {
      this.clientId = -1;
      this.talentName = '';
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

      if (this.candidateDipstick) {
        this.report.endDate = this.endDate;
        this.report.clientId = this.clientId;
        this.report.talentName = this.talentName;
        this.report.endDate = this.endDate;
        this.report.startDate = this.startDate;
      }
      if (this.clientDipstick) {
        this.report2.endDate = this.endDate;
        this.report2.clientId = this.clientId;
        this.report2.talentName = this.talentName;
        this.report2.endDate = this.endDate;
        this.report2.startDate = this.startDate;
      }
      this.filterChanged();
    }, 500);
  }


  areColumnsVisible = true;

  onSelectChange(event: any) {
    this.areColumnsVisible = event.selectedOption;
    this.filterChanged()
  }
}
