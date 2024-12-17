import { Component, OnInit, ViewChild } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-hiring-overview',
  templateUrl: './hiring-overview.component.html',
  styleUrls: ['./hiring-overview.component.scss'],
})
export class HiringOverviewComponent implements OnInit {
  constructor(public commonService: PieworksCommonService) {
    this.years.push(new Date().getFullYear());
    this.years.push(new Date().getFullYear() - 1);
    this.years.push(new Date().getFullYear() - 2);
    this.years.push(new Date().getFullYear() - 3);
    this.years.push(new Date().getFullYear() - 4);
  }

  ngOnInit(): void {
    this.loadHiringOverview();
    this.ccEmailId = this.commonService.user.username;
  }
  allCaData = true;

  ccEmailId = '';
  @ViewChild('clientReport') clientReport: any;
  @ViewChild('clientReportFilter') clientReportFilter: any;

  hiringOverview: any;
  clientHiring: any;

  loadHiringOverview(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/discovery/clientAnchorHiringOverview?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.commonService.user.id +
      ',allCaData=' +
      this.allCaData;

    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.hiringOverview = data['dataArray'];
        this.clientHiring = data['dataObject'];

        console.log(this.hiringOverview);
        console.log(this.clientHiring);

        this.decideColor();
      } else console.error('Error in getting data');
    });
  }

  lastValue: boolean = false;
  decideColor(): any {
    for (let i = 0; i < this.hiringOverview.length; i++) {
      if (this.hiringOverview[i].interestedCount > 0) {
        this.hiringOverview[i].color = '#5B73FF';
        this.hiringOverview[i].bgColor = '#F0F7FF';
        this.hiringOverview[i].interestedcLast = true;
      }
      if (this.hiringOverview[i].s2cCount > 0) {
        this.hiringOverview[i].color = '#F98550';
        this.hiringOverview[i].bgColor = '#FFF0EA';
        this.hiringOverview[i].isS2cLast = true;
      }
      if (this.hiringOverview[i].exploratoryCall > 0) {
        this.hiringOverview[i].color = '#EF6471';
        this.hiringOverview[i].bgColor = '#FEECEE';
        this.hiringOverview[i].isExplCallLast = true;
      }
      if (this.hiringOverview[i].interviewCount > 0) {
        this.hiringOverview[i].color = '#22CAAD';
        this.hiringOverview[i].bgColor = '#E9FAF7';
        this.hiringOverview[i].isIntrvLast = true;
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

  navigateToDiscoveries(reqId: any, status: any): void {
    switch (status) {
      case 'interested':
        localStorage.setItem(
          'discFilter',
          '-1::-1::::2::-1::-1::false::0::500::0::50::-1::::::false'
        );

        this.commonService.navigateTo('recr/discoveries/' + reqId, {});
        break;
      case 's2c':
        localStorage.setItem(
          'discFilter',
          '-1::-1::::6::-1::-1::false::0::500::0::50::-1::::::false'
        );
        this.commonService.navigateTo('recr/discoveries/' + reqId, {});
        break;
      case 'exploratoryCall':
        localStorage.setItem(
          'discFilter',
          '-1::-1::::19::-1::-1::false::0::500::0::50::-1::::::false'
        );
        this.commonService.navigateTo('recr/discoveries/' + reqId, {});
        break;
      case 'intrv':
        localStorage.setItem(
          'discFilter',
          '-1::-1::::8::-1::-1::false::0::500::0::50::-1::::::false'
        );
        this.commonService.navigateTo('recr/discoveries/' + reqId, {});
        break;
    }
  }
}
