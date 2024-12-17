import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-client-hiring-overview',
  templateUrl: './client-hiring-overview.component.html',
  styleUrls: ['./client-hiring-overview.component.scss'],
})
export class ClientHiringOverviewComponent implements OnInit {

  @ViewChild('addModal') addModal:any;
  @Input() callbackFunction: any; // (args: any) => void;
  @Input() parentObj: any;
  thisObj = this;

  constructor(
    public commonService: PieworksCommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.years.push(new Date().getFullYear());
    this.years.push(new Date().getFullYear() - 1);
    this.years.push(new Date().getFullYear() - 2);
    this.years.push(new Date().getFullYear() - 3);
    this.years.push(new Date().getFullYear() - 4);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.clientHiringOverview();
    }, 500);

    this.ccEmailId = this.commonService.user.username;
  }
  allCaData = true;

  ccEmailId = '';
  @ViewChild('clientReport') clientReport: any;
  @ViewChild('clientReportFilter') clientReportFilter: any;
  @ViewChild('apprspp') apprspp: any;

  hiringOverview: any;
  clientHiring: any;
  clientHiringOverview() {
    let clientIds = this.commonService.clientIds
      .toString()
      .split(',')
      .join('-');
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/client/hiringOverview?clientIds=' +
      clientIds;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.hiringOverview = data['dataArray'];
        this.clientHiring = data['dataObject'];
        this.decideColor();
      }
    });
  }

  rssppMandateLabel = 'Rspp'
  isRspp = true;

  rsppModalShow() {
    this.apprspp.requirement.orgName = localStorage.getItem('clientOrgName');
    this.apprspp.onRsppClientSelect();
    this.apprspp.validatePage1Completion();
    this.addModal.show();
  }

  lastValue: boolean = false;
  decideColor(): any {
    for (let i = 0; i < this.hiringOverview.length; i++) {
      if (this.hiringOverview[i].new > 0) {
        this.hiringOverview[i].color = '#5B73FF';
        this.hiringOverview[i].bgColor = '#F0F7FF';
      }
      if (this.hiringOverview[i].exploratoryCall > 0) {
        this.hiringOverview[i].color = '#F98550';
        this.hiringOverview[i].bgColor = '#FFF0EA';
      }
      if (this.hiringOverview[i].intrv > 0) {
        this.hiringOverview[i].color = '#EF6471';
        this.hiringOverview[i].bgColor = '#FEECEE';
      }
      if (this.hiringOverview[i].offers > 0) {
        this.hiringOverview[i].color = '#22CAAD';
        this.hiringOverview[i].bgColor = '#E9FAF7';
      } else {
        this.lastValue = false;
      }
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
          this.clientHiring = data['dataArray'];
          if (cb) cb();
        }
      });
  }

  truncateString(inputString: string, maxLength: number): string {
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.substring(0, maxLength) + '...';
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

  months = [
    { name: 'Jan-Mar', startDate: '01-01', endDate: '03-31' },
    { name: 'Apr-Jun', startDate: '04-01', endDate: '06-30' },
    { name: 'Jul-Sep', startDate: '07-01', endDate: '09-30' },
    { name: 'Oct-Dec', startDate: '10-01', endDate: '12-31' },
  ];
  years: any = [];
  selectedMonth: any;
  selectedYear: any;
  loadQuarterReport(): void {
    if (this.selectedMonth && this.selectedYear) {
      this.startDate = this.selectedYear + '-' + this.selectedMonth.startDate;
      this.endDate = this.selectedYear + '-' + this.selectedMonth.endDate;
    }
  }
  section = 1;
  userId: any;
  clientAnchorId: any;
  gradeId: any;
  clientId: any;
  sector: any;
  gender: any;

  endDate: any;
  startDate: any;
  clearFilter(): void {
    setTimeout(() => {
      this.clientAnchorId = undefined;
      this.userId = -1;
      this.gradeId = -1;
      this.clientId = [];
      this.sector = 'all';
      this.gender = 'all';
      this.selectedMonth = undefined;
      this.selectedYear = undefined;
      this.endDate = this.commonService
        .getFormatedDate(new Date(), this.commonService.mysqlFormat)
        .split(' ')[0];
      this.startDate = this.commonService
        .getFormatedDate(
          this.commonService.getDateXDaysAgo(31, new Date()),
          this.commonService.mysqlFormat
        )
        .split(' ')[0];
      // this.filterChanged();
    }, 500);
  }

  filterChanged(): void {
    this.clientReportFilter.hide();
    this.clientReport.show();
    this.loadClientReport();
  }

  getFirstName(fullName: any): string {
    // Split the full name and return the first part
    return fullName.split(' ')[0];
  }

  loadedClientReport: any;
  loadClientReport(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/discovery/monthlyClientReport?clientId=' +
      this.clientId +
      ',startDate=' +
      this.startDate +
      ',endDate=' +
      this.endDate;

    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.loadedClientReport = data['dataArray'];

        console.log(this.loadedClientReport);
      } else console.error('Error in getting data');
    });
  }
  clientAnchorRemarks = '';
  recepientName: any;
  subject: any;
  clientEmailId: any = '';
  // roopaEmailId:any = 'roopa.sirivara@pieworks.in';
  // anushEmailId:any = 'anush@pieworks.in';
  postMailToclient(): void {
    for (var i = 0; i < this.loadedClientReport.length; i++) {
      if (
        !this.loadedClientReport[i].sendersFeedback ||
        !this.loadedClientReport[i].sendersFeedback == null
      ) {
        this.loadedClientReport[i].sendersFeedback = '-';
      }
    }
    var url =
      'mainservice/recruitment3/emailMonthlyClientReport?sender=' +
      this.commonService.user.name +
      '&to=' +
      this.clientEmailId +
      '&bcc=' +
      '' +
      '&subject=' +
      this.subject +
      '&cc=anush@pieworks.in,' +
      this.ccEmailId +
      '&clientAnchorRemarks=' +
      this.clientAnchorRemarks +
      '&recepientName=' +
      this.recepientName;
    this.commonService
      .post(url, this.loadedClientReport)
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.commonService.showSuccessMessage('Saved', 'Mail sent...');
          this.clientEmailId = '';
          this.clientReport.hide();
        } else
          this.commonService.showErrorMessage(
            'Error',
            "Couldn't send the mail."
          );
        this.commonService.hideProcessingIcon();
      });
  }

  navigateToTracker(reqId: any, status: any, statusIds: any): void {
    switch (status) {
      case 'new':
        this.router.navigate(['fw/client/tracker/' + reqId + '/' + statusIds]);
        break;

      case 'exploratoryCall':
        this.router.navigate(['fw/client/tracker/' + reqId + '/' + statusIds]);
        break;
      case 'intrv':
        this.router.navigate(['fw/client/tracker/' + reqId + '/' + statusIds]);
        break;
      case 'offers':
        this.router.navigate(['fw/client/tracker/' + reqId + '/' + statusIds]);
        break;
      case 'total':
        this.router.navigate(['fw/client/tracker/' + reqId + '/' + -1]);
        break;
    }
  }
}
