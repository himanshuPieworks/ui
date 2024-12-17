import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-member-payouts',
  templateUrl: './member-payouts.component.html',
  styleUrls: ['./member-payouts.component.scss'],
})
export class MemberPayoutsComponent implements OnInit {
  endingDate: any;
  startingDate: any;
  d: any;

  constructor(public commonService: PieworksCommonService) {
    var todayDate = new Date().toISOString().slice(0, 10);
    this.d = new Date(todayDate);
    this.endingDate = this.d.toISOString().slice(0, 10);
    this.d.setDate(1);
    this.startingDate = this.d.toISOString().slice(0, 10);
    this.loadMembers();
  }

  breadCrumbItems!: Array<{}>;
  temp: any;

  bsModalRef!: BsModalRef;
  // payoutItems:any[] = [];
  item: any = [];

  openModal(item: any) {
    this.item = item; // Set the selected item data
    this.bsModalRef = this.payoutItem.show(this.payoutItem);
    this.loadLast6MonthsNorthstar();
    this.getWorthOfPiecosAwardedForDisc();
  }

  total: any;
  getTotal(): any {
    if (!this.item) return 0;
    var total =
      this.item.candidateInteractionShare +
      this.item.clientAnchorShare +
      this.item.clientRefererShare +
      this.item.communityLeaderShare +
      this.item.discovererShare;
    this.total = total;
    return total;
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', active: false, link: '/' },
      { label: 'Manage', active: false, link: '/recr/manage' },
      { label: 'Finance', active: false, link: '/fw/finance' },
      {
        label: 'Member-Payout',
        active: true,
        link: 'fw/member-payouts',
      },
    ];

    this.loadPreviousPayouts();
  }

  memberHandle: any;
  members: any = [];
  member: any = '';
  users: any = [];
  loadMembers(): void {
    //this.startingDate=this.d.toISOString().slice(0, 10);
    //this.startingDate="2022-01-01 00:00:00";
    //this.endingDate=this.commonService.getFormatedDate(new Date(),'yyyy-MM-dd hh:mm:ss');
    if (this.memberHandle) this.memberHandle.unsubscribe();
    this.commonService.showProcessingIcon();
    this.memberHandle = this.commonService
      .get(
        'mainservice/framework/members2/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=1' +
          '&acceptanceByAceMakerValues=1' +
          '&userId=-1&roleInCommunity=0,1' +
          '&pageNum=' +
          1 +
          '&pageSize=' +
          100 +
          '&searchText=' +
          this.member +
          '&showMembersWithKyc=' +
          false +
          '&showMembersWithPhone=' +
          false+'&approvedOnMonth=&jobFamily='
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.members = [];
        //if(data["result"]===200)
        {
          this.members = data['dataArray'];
          this.users = [];
          for (var i = 0; i < this.members.length; i++) {
            this.users.push(this.members[i].user);
          }
        }
      });
  }

  @ViewChild('payoutItem') payoutItem: any;

  pageNum: any = 1;
  pageSize: any = 100;
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
      // this.loadUnbilledItems(this);
      this.loadPreviousPayouts();
      //this.loadPreviousPayouts();
      //this.loadMembers();
    }, 1000);
  }
  clearFilter(): void {
    this.userId = -1;
    var todayDate = new Date().toISOString().slice(0, 10);
    this.d = new Date(todayDate);
    this.endingDate = this.d.toISOString().slice(0, 10);
    this.d.setDate(1);
    this.startingDate = this.d.toISOString().slice(0, 10);
    this.filterChanged();
  }
  invoices: any = [];
  pendingInvoices: any = [];
  piecosInvoices: any = [];
  pendingPiecosInvoices: any = [];
  contract: any = {};
  memberId = -1;
  selectedPiecosPayout: any;
  piecosStatement: any;
  month: any;
  totalPiecosAmount = 0;
  payoutItems: any;
  selectedPayout: any;
  pendingTotal: any;
  penaltyDetails: any;
  userId = -1;
  // load Pending Invoice / load all the invoices / load PieCos Invoice
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
      '&status=processed,rejected';
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
      '&status=processed,rejected';
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

  // load member Payout
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
          if (this.payoutItems[i].maturedAmountPassed == undefined)
            this.payoutItems[i].maturedAmountPassed =
              this.payoutItems[i].maturedAmount;
          this.pendingTotal =
            this.pendingTotal + this.payoutItems[i].maturedAmountPassed;
        }
      }
    });
    this.penaltyDetails = this.selectedPayout.penaltyDetails.split('=');
    switch (this.penaltyDetails.length) {
      case 3:
        this.correctionDueToPenalty = 100;
        break;
      case 6:
        this.correctionDueToPenalty = 80;
        break;
      default:
        this.correctionDueToPenalty = 50;
        break;
    }
    for (var i = 0; i < this.penaltyDetails.length; i++) {
      this.penaltyDetails[i] = this.penaltyDetails[i].split(',');
    }
  }

  // Load Piecos Pay
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
          if (
            !this.piecosStatement[i].amountPassed &&
            this.selectedPiecosPayout.status == 'processing'
          )
            this.piecosStatement[i].amountPassed =
              (this.piecosStatement[i].credit - this.piecosStatement[i].debit) *
              this.piecosStatement[i].worthOf1Pieco;
        }
        this.calculateTotalPiecosAmount();
      });
  }

  // Calculate the total Piecos Amount.
  calculateTotalPiecosAmount(): void {
    this.totalPiecosAmount = 0;
    for (var i = 0; i < this.piecosStatement.length; i++) {
      this.totalPiecosAmount =
        this.totalPiecosAmount + this.piecosStatement[i].amountPassed;
    }
    this.selectedPiecosPayout.netAmountPassed = Math.round(
      this.totalPiecosAmount - this.totalPiecosAmount * 0.1
    );
  }

  showPayoutBreakup(): void {
    this.payoutItem.show();
  }

  getFinalTotal(): any {
    return Math.round(
      this.pendingTotal ? this.pendingTotal - this.pendingTotal * 0.1 : 0
    );
  }

  goBack(): void {
    this.selectedPayout = false;
    this.selectedPiecosPayout = false;
  }

  confirmUpdateStatusPiecos(status: any): void {
    console.log(this.selectedPiecosPayout);
    Swal.fire({
      title: 'Confirmation',
      text:
        'You are about to release Rs.' +
        this.selectedPiecosPayout.netAmountPassed +
        '/- to ' +
        this.selectedPiecosPayout.userName +
        '.Are you sure you want to ' +
        status +
        ' the selected payout request ? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      if (result.value) {
        this.updatePayoutStatusPiecos(status);
      }
    });
  }

  updatePayoutStatusPiecos(status: any): void {
    status = status.replace('approve', 'processed');
    status = status.replace('reject', 'rejected');
    this.selectedPiecosPayout.status = status;
    if (status == 'rejected') {
      this.selectedPiecosPayout.netAmountPassed = 0;
      for (var i = 0; i < this.piecosStatement.length; i++) {
        this.piecosStatement[i].amountPassed = 0;
      }
    }
    var url = 'mainservice/finance/piecospayout/updatePiecosPayout';
    this.selectedPiecosPayout.approvedOn = this.commonService.getFormatedDate(
      new Date(),
      'yyyy-MM-dd hh:mm:ss'
    );
    this.commonService
      .post(url, this.selectedPiecosPayout)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          url = 'mainservice/finance/piecospayout/updatePiecosStatements';
          this.commonService
            .post(url, this.piecosStatement)
            .subscribe((data: any) => {
              this.commonService.hideProcessingIcon();
              if (data['result'] === 200) {
                this.commonService.showInfoMessage(
                  'Update',
                  'The selected payout has been marked as ' +
                    this.selectedPiecosPayout.status
                );
                var message = 'Your payout request has been '+status+'. ';
                this.commonService.sendNotification(
                  this.selectedPiecosPayout.userId,
                  message,
                  '/finance/mypayouts',
                  'COMMUNITY MEMBER',
                  1,
                  1
                );
                this.selectedPiecosPayout = undefined;
                this.loadPreviousPayouts();
              }
            });
        }
      });
  }

  confirmUpdateStatus(status: any): void {
    Swal.fire({
      title: 'Confirmation',
      text:
        'You are about to release Rs.' +
        this.selectedPayout.totalPassed +
        '/- to ' +
        this.selectedPayout.user.name +
        '.Are you sure you want to ' +
        status +
        ' the selected payout request ? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      if (result.value) {
        this.updatePayoutStatus(status);
      }
    });
  }

  updatePayoutStatus(status: any): void {
    status = status.replace('approve', 'processed');
    status = status.replace('reject', 'rejected');
    if (status == 'rejected') {
      this.selectedPayout.totalPassed = 0;
      for (var i = 0; i < this.payoutItems.length; i++) {
        this.payoutItems[i].maturedAmountPassed = 0;
      }
    }
    this.selectedPayout.status = status;
    this.calculatePendingTotal();
    this.selectedPayout.totalPassed = Math.round(
      this.selectedPayout.totalPassed
    );
    this.selectedPayout.approvedOn = this.commonService.getFormatedDate(
      new Date(),
      'yyyy-MM-dd hh:mm:ss'
    );
    var url = 'mainservice/finance/recruitment/updatePayout';
    this.commonService.post(url, this.selectedPayout).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        url = 'mainservice/finance/recruitment/updatePayoutItems';
        this.commonService
          .post(url, this.payoutItems)
          .subscribe((data: any) => {
            this.commonService.hideProcessingIcon();
            if (data['result'] === 200) {
              var message = 'Your payout request has been '+status+'. ';
              this.commonService.sendNotification(
                this.selectedPayout.userId,
                message,
                '/fw/pieBank',
                'COMMUNITY MEMBER',
                1,
                1
              );
              this.selectedPayout = undefined;
              this.loadPreviousPayouts();
              this.commonService.showInfoMessage(
                'Selected Payout',
                'The selected payout has been marked as ' +
                  this.selectedPayout.status
              );
            }
          });
      }
    });
  }

  calculatePendingTotal(): void {
    this.pendingTotal = 0;
    for (var i = 0; i < this.payoutItems.length; i++) {
      this.pendingTotal =
        this.pendingTotal + this.payoutItems[i].maturedAmountPassed;
    }
    this.selectedPayout.totalPassed =
      this.pendingTotal - this.pendingTotal * 0.1;
    //this.selectedPayout.totalPassed = (this.pendingTotal*this.selectedPayout.eligiblePayoutPerc/100)-(this.pendingTotal*this.selectedPayout.eligiblePayoutPerc/100)*.1;
  }

  correctionDueToPenalty = 0;
  piecosCreditedWorth = 0;
  getWorthOfPiecosAwardedForDisc(): any {
    this.commonService
      .get(
        'mainservice/finance/piecospayout/piecosWorthGivenToDiscovery?userId=' +
          this.selectedPayout.user.id +
          '&discoveryId=' +
          this.item.discovery.id
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.piecosCreditedWorth = data['dataObject'];
        }
      });
  }
  loadLast6MonthsNorthstar(): void {
    //alert("( "+this.selectedPayout.maturePayoutAfterPenalty+"-"+this.selectedPayout.maturePayout+") x 100/"+this.selectedPayout.maturePayout);
    //this.correctionDueToPenalty = (this.selectedPayout.maturePayoutAfterPenalty - this.selectedPayout.maturePayout) * 100 / this.selectedPayout.maturePayout;
    //    if (!this.commonService.user.id) return;
    //    var tempDateDays = this.commonService.getDateXDaysAgo(35, new Date());
    //    var tempDates = this.commonService.getStartingEndingDatesOfMonthWithDate(
    //      tempDateDays ? tempDateDays : new Date()
    //    );
    //    let startDate = tempDates[0];
    //    let endDate = tempDates[1];
    //    this.commonService.showProcessingIcon();
    //    this.commonService
    //      .get(
    //        'mainservice/recruitment/shortlisting/penaltyDetails/2?userId=' +
    //          this.commonService.user.id +
    //          '&createdOnFrom=' +
    //          this.commonService.getFormatedDate(startDate, 'yyyy-MM-dd') +
    //          ' 00:00:00&createdOnTill=' +
    //          this.commonService.getFormatedDate(endDate, 'yyyy-MM-dd') +
    //          ' 00:00:00&pageNum=1&pageSize=100&weeksPassed=5'
    //      )
    //      .subscribe((data: any) => {
    //        this.commonService.hideProcessingIcon();
    //        if (data['result'] === 200) {
    //          this.correctionDueToPenalty = data['dataObject'];
    //        }
    //      });
  }

  onSearch(item: any) {
    this.member = item.term;
    this.loadMembers();
  }

  // when client is already loaded locally then this method made it local search
  localSearch(term: string, item: any) {
    return (
      item.user.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1
    );
  }
  valStatus: any = ['pending', 'ok', 'not-ok'];
  updateInvoice(invoice: any): void {
    var url = 'mainservice/finance/recruitment/updatePayout';
    this.commonService.post(url, invoice).subscribe((data: any) => {
      this.commonService.showInfoMessage('Update', 'Updated invoice');
      this.commonService.sendNotification(
        8,
        this.commonService.user.name +
          ' has validated the payout request from ' +
          invoice.user.name +
          '. Please take necessary action.',
        '/finance/memberPayouts',
        'COMMUNITY MEMBER',
        1,
        1
      );
    });
  }
  updatePiecosInvoice(invoice: any): void {
    var url = 'mainservice/finance/piecospayout/updatePiecosPayout';
    this.commonService.post(url, invoice).subscribe((data: any) => {
      this.commonService.showInfoMessage('Update', 'Updated invoice');
      this.commonService.sendNotification(
        8,
        this.commonService.user.name +
          ' has validated the payout request from ' +
          invoice.userName +
          '. Please take necessary action.',
        '/finance/memberPayouts',
        'COMMUNITY MEMBER',
        1,
        1
      );
    });
  }
}
