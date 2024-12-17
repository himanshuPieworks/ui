import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-my-payout',
  templateUrl: './my-payout.component.html',
  styleUrls: ['./my-payout.component.scss'],
})
export class MyPayoutComponent implements OnInit {
  @Input() userIdFromParent: any;
  userId: any;
  constructor(public commonService: PieworksCommonService) {
    setTimeout(() => {
      this.loadPayoutAll();
    }, 1000);
  }

  loadPayoutAll() {
    if (this.userIdFromParent) this.userId = this.userIdFromParent;
    else this.userId = this.commonService.user.id;
    this.loadPreviousPayouts();
    this.loadLast6MonthsNorthstar();
  }
  block: any = false;
  scrollPosition: any = 0;

  communityId: any;
  @Input() callbackFunction: (args: any) => void = (args: any) => {};
  @Input() parentObj: any;

  // both of this is used for payout Breakup
  @ViewChild('payoutBreakup') payoutBreakup: any;
  selectedReq: any;
  ngOnInit(): void {}

  pageNum: any = 1;
  pageSize: any = 12;
  paginationMessage: any = '';
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
  }
  first(): void {
    this.pageNum = 1;
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
  }
  filterChanged(): void {
    setTimeout(() => {
      this.pageNum = 1;
      this.loadPreviousPayouts();
      //this.loadPreviousPayouts();
      //this.loadMembers();
    }, 1000);
  }

  showGeneratedPayoutSlip(payoutId: any): void {
    this.commonService.showProcessingIcon();
    var url =
      'mainservice/finance/recruitment/printablePreviousPayout/' + payoutId;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.commonService.hideProcessingIcon();
        var newWindow = window.open('', '', 'status');

        if (newWindow) {
          var newContent = data['message'];
          newWindow.document.write(newContent);
          newWindow.document.close();
        } else {
          // Handle the case where window.open failed to create a new window
        }
      }
    });
  }
  invoices: any = [];
  pendingInvoices: any = [];
  piecosInvoices: any = [];
  pendingPiecosInvoices: any = [];
  loadPreviousPayouts(): void {
    this.commonService.showProcessingIcon();
    this.contract = {};
    var url =
      'mainservice/finance/recruitment/payoutSlip?userId=' +
      this.userId +
      '&pageNum=' +
      this.pageNum +
      '&pageSize=' +
      this.pageSize +
      '&status=processing,processed,rejected';
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.invoices = data['dataArray'];
      }
    });
    url =
      'mainservice/finance/recruitment/payoutSlip?userId=' +
      this.userId +
      '&pageNum=' +
      this.pageNum +
      '&pageSize=' +
      this.pageSize +
      '&status=processing';
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.pendingInvoices = data['dataArray'];
      }
    });

    url =
      'mainservice/finance/piecospayout/report?userId=' +
      this.userId +
      '&pageNum=' +
      this.pageNum +
      '&pageSize=' +
      this.pageSize +
      '&status=processing,processed,rejected';
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.piecosInvoices = data['dataArray'];
      }
    });
    url =
      'mainservice/finance/piecospayout/report?userId=' +
      this.userId +
      '&pageNum=' +
      this.pageNum +
      '&pageSize=' +
      this.pageSize +
      '&status=processing';
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.pendingPiecosInvoices = data['dataArray'];
      }
    });
  }
  payoutItems: any;
  selectedPayout: any;
  contract: any;
  loadPayoutItems(): void {
    this.commonService.showProcessingIcon();
    this.contract = {};
    var url =
      'mainservice/finance/recruitment/payoutSlipItems?payoutId=' +
      this.selectedPayout.id;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.payoutItems = data['dataArray'];
        this.pendingTotal = 0;
        for (var i = 0; i < this.payoutItems.length; i++) {
          this.pendingTotal =
            this.pendingTotal + this.payoutItems[i].maturedAmountPassed;
        }
      }
    });
  }
  pendingTotal: any;

  selectedPiecosPayout: any;
  piecosStatement: any;
  month: any;
  totalPiecosAmount: any = 0;
  loadPiecosPayoutItems(): void {
    this.piecosStatement = [];
    this.totalPiecosAmount = 0;
    this.commonService
      .get(
        'mainservice/finance/piecospayout/statementsOfPayout?userId=' +
          this.selectedPiecosPayout.userId +
          '&payoutId=' +
          this.selectedPiecosPayout.id
      )
      .subscribe((data: any) => {
        this.piecosStatement = data['dataArray'];
        for (var i = 0; i < this.piecosStatement.length; i++) {
          this.totalPiecosAmount =
            this.totalPiecosAmount + this.piecosStatement[i].amountPassed;
        }
      });
  }

  correctionDueToPenalty = 0;
  penaltyDetails = [];
  loadLast6MonthsNorthstar(): void {
    if (!this.userId) return;
    var tempDateDays = this.commonService.getDateXDaysAgo(35, new Date());
    var tempDates = this.commonService.getStartingEndingDatesOfMonthWithDate(
      tempDateDays ? tempDateDays : new Date()
    );
    let startDate = tempDates[0];
    let endDate = tempDates[1];
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment/shortlisting/penaltyDetails/2?userId=' +
          this.userId +
          '&createdOnFrom=' +
          this.commonService.getFormatedDate(startDate, 'yyyy-MM-dd') +
          ' 00:00:00&createdOnTill=' +
          this.commonService.getFormatedDate(endDate, 'yyyy-MM-dd') +
          ' 00:00:00&pageNum=1&pageSize=100&weeksPassed=5'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.correctionDueToPenalty = data['dataObject'];
          this.penaltyDetails = data['dataArray'];
        }
      });
  }
}
