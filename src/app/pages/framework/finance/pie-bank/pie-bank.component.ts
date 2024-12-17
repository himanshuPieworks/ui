import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pie-bank',
  templateUrl: './pie-bank.component.html',
  styleUrls: ['./pie-bank.component.scss'],
})
export class PieBankComponent implements OnInit {
  @Input() userIdFormFinance: any;
  @ViewChild('payout') payout:any;

  breadCrumbItems!: Array<{}>;
  userId: any;
  constructor(
    public commonService: PieworksCommonService,
    public router: Router
  ) {
    //   alert("this is user id"+ this.userId)

    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'PieBank', active: true },
    ];
  }
  ngOnInit(): void {
    this.loadPiebank();
  }

  loadPiebank() {
    setTimeout(() => {
      // alert("this is user id form finance "+ this.userIdFormFinance)
      if (this.userIdFormFinance) this.userId = this.userIdFormFinance;
      else this.userId = this.commonService.user.id;

      this.loadMyCommunities();
      this.loadMyProfile();
      this.loadCommunityMembers();
      // this.userId = this.commonService.user.id;
      this.loadKyc(this.userId);
      this.payoutTabSelected();
    }, 1000);
  }

  payoutTabSelected(){
    this.payout.userIdFromParent = this.userId;
    this.payout.loadPayoutAll();
    
  }

  // This is the method you want to trigger from the parent
  triggerMethodFromParent() {
    this.loadPiebank();
    // Your logic here...
  }
  completedKyc: any = false;
  unbilledItems: any;
  communities: any;
  member: any;
  loadKyc(userId: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/kyc?userId=' + userId)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          var kyc = data['dataObject'];
          if (kyc == null || kyc == undefined) {
            this.completedKyc = false;
          } else if (!kyc.cancelledCheque || !kyc.panCard) {
            this.completedKyc = false;
          } else this.completedKyc = true;
        }
      });
  }
  loadMyCommunities(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/framework/mycommunities?acceptanceByAceValues=1&acceptanceByAceMakerValues=1'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.communities = [];
        if (data['result'] === 200) {
          this.communities = data['dataArray'];
        } else {
          this.communities = [];
        }
      });
  }
  loadCommunityMembers(): void {
    this.commonService.showProcessingIcon();
    var acceptanceByAceValues = '1';
    var acceptanceByAceMakerValues = '1';
    var roleInCommunity = '0,1';
    this.commonService
      .get(
        'mainservice/framework/members/' +
          this.selectedCommunityId +
          '?acceptanceByAceValues=' +
          acceptanceByAceValues +
          '&acceptanceByAceMakerValues=' +
          acceptanceByAceMakerValues +
          '&userId=-1&roleInCommunity=' +
          roleInCommunity
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.member = undefined;
        if (data['result'] === 200) {
          var members = data['dataArray'];
          for (var i = 0; i < members.length; i++) {
            if (members[i].user.id == this.commonService.user.id) {
              this.member = members[i];
            }
          }
        }
        if (this.member) {
          this.loadLast6MonthsNorthstar();
        }
      });
  }
  /*
  TODO, variable selectedCommunityId to be set dynamically when we support multiple communities.
  payout to be taken care community wise as the target and all varies from community to community.
  */
  selectedCommunityId = 2;
  loadDiscoveriesForPayout(): void {
    var startingDate = this.commonService.getFormatedDate(
      this.commonService.getDateXDaysAgo(365, new Date()),
      'yyyy-MM-dd'
    );
    var endingDate = this.commonService.getFormatedDate(
      new Date(),
      'yyyy-MM-dd'
    );
    this.commonService
      .get(
        'mainservice/finance/recruitment/discoveriesForMemberPayout?correctionDueToPenalty=' +
          this.correctionDueToPenalty +
          '&communityId=' +
          this.selectedCommunityId +
          '&userId=' +
          this.userId +
          '&startingDate=' +
          startingDate +
          '&endingDate=' +
          endingDate +
          ' 23:59:59'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.unbilledItems = [];
        if (data['result'] === 200) {
          this.unbilledItems = data['dataArray'];
          this.calculateTotal();
        }
      });
  }

  totalPayout: any = 0;
  maturedPayout: any = 0;
  escrowAmt: any = 0;
  maturePayoutAfterPenalty: any;
  netTotal: any;
  calculateTotal(): void {
    this.totalPayout = 0;
    this.escrowAmt = 0;
    this.maturedPayout = 0;
    this.maturePayoutAfterPenalty = 0;
    this.netTotal = 0;
    for (var i = 0; i < this.unbilledItems.length; i++) {
      var disc = this.unbilledItems[i];
      this.totalPayout = this.totalPayout + this.unbilledItems[i].total;
      this.escrowAmt = this.escrowAmt + disc.escrowAmount;
      this.maturedPayout = this.maturedPayout + disc.maturedAmount;
      //this.maturePayoutAfterPenalty = (this.maturedPayout * this.correctionDueToPenalty/100) - (disc.discovery.commitChocolates+disc.discovery.chocolatesEligible)*500;
      //this.netTotal = this.maturePayoutAfterPenalty - this.maturePayoutAfterPenalty*10/100;
      this.netTotal = this.maturedPayout - (this.maturedPayout * 10) / 100;
      this.netTotal = Math.round(this.netTotal);
    }
  }
  toggleClassOnRowClick(row: any): void {
    if (!row.classOnRowClick) {
      row.classOnRowClick = 'tr-on-select';
      return;
    }
    if (row.classOnRowClick && row.classOnRowClick.length === 0)
      row.classOnRowClick = 'tr-on-select';
    else row.classOnRowClick = '';
  }
  // both of this is used for payout Breakup
  @ViewChild('payoutBreakup') payoutBreakup: any;
  selectedReq: any;

  statement: any = [];
  piecos: any = 0;
  myprofile: any;
  loadMyProfile(): void {
    var url = 'mainservice/auth/myprofile';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.piecos = data['dataObject'].piecos;
        this.myprofile = data['dataObject'];
        this.getPiecosWorthReadyToPayout();
      }
    });
  }
  confirmCashoutReadyAmount(): void {
    if (!this.completedKyc) {
      this.commonService.showErrorMessage(
        'Error',
        'Please update KYC details at the profile page to proceed with the cashout.'
      );
      return;
    }
    var message =
      'You have chosen to cashout. Please give us 7 working days to process your request.';
    message =
      message +
      " Please note in case if the candidate doesn't complete the guarantee period, any advance amount paid will be adjusted towards the next payout.";
    message = message + ' Are you sure you want to continue ?';
    Swal.fire({
      title: 'Confirmation required',
      html: `<small style="font-size:12px">` + message + `</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      if (result.value) {
        this.cashoutReadyAmount();
      }
    });
  }
  cashoutReadyAmount(): void {
    this.commonService.showProcessingIcon();
    //penalty and tds is calculated at the reruitmentservice handler rest api.
    var pd = '';
    for (var i = 0; i < this.penaltyDetails.length; i++) {
      if (i == 0) pd = this.penaltyDetails[i] + '';
      else pd = pd + '=' + this.penaltyDetails[i] + '';
    }
    var url =
      'mainservice/finance/recruitment/payoutSlip/generate?total=' +
      this.netTotal +
      '&userId=' +
      this.userId;
    url =
      url +
      '&eligiblePayoutPerc=' +
      this.correctionDueToPenalty +
      '&maturedPayout=' +
      this.maturedPayout +
      '&maturePayoutAfterPenalty=' +
      this.maturedPayout;
    url = url + '&penaltyDetails=' + pd + '&escrowAmt=' + this.escrowAmt;

    var tempItems = [];
    for (var i = 0; i < this.unbilledItems.length; i++) {
      var disc = this.unbilledItems[i];
      var amountToPayout = disc.maturedAmount;
      if (amountToPayout > 0) tempItems.push(disc);
    }
    this.commonService.post(url, tempItems).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.commonService.showInfoMessage(
          'Info',
          'Your cashout request has been submitted successfully.'
        );
        this.loadDiscoveriesForPayout();
        var message =
          this.myprofile.name +
          ' has raised a payout request. Please do the needful.';
        this.commonService.sendNotification(
          8,
          message,
          '/fw/member-payouts',
          'COMMUNITY MEMBER',
          1,
          1
        );
        message =
          this.myprofile.name +
          ' has raised a payout request. Please validate the same.';
        this.commonService.sendNotification(
          3,
          message,
          '/fw/member-payouts',
          'COMMUNITY MEMBER',
          1,
          1
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }
  viewStatement(): void {
    this.router.navigate(['fw/piecos-statement']);
  }
  section: any = 1;
  confirmCashoutPiecos(): void {
    var message =
      'You have chose to cashout the piecos. Please give us 7 working days to process your request.';
    message = message + 'Are you sure you want to continue ?';
    Swal.fire({
      title: 'Confirmation required',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      if (result.value) {
        this.cashoutPiecos();
      }
    });
  }
  cashoutPiecos(): void {
    var url = '/mainservice/finance/piecospayout/generate';
    var payout = {
      userId: this.userId,
      validationStatus: 'pending',
    };
    this.commonService.post(url, payout).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.commonService.showInfoMessage(
          'Info',
          'Your cashout request has been submitted successfully.'
        );
        var message =
          this.myprofile.name +
          ' has raised a piecos payout request. Please do the needful.';
        this.commonService.sendNotification(
          8,
          message,
          '/finance/memberPayouts',
          'COMMUNITY MEMBER',
          1,
          1
        );
        this.commonService.sendNotification(
          3762,
          message,
          '/fw/member-payouts',
          'COMMUNITY MEMBER',
          1,
          1
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.loadDiscoveriesForPayout();
      }
    });
  }
  piecosWorthCashout: any = 0;
  getPiecosWorthReadyToPayout(): void {
    if (!this.commonService.user.id) return;
    var tempDateDays = this.commonService.getDateXDaysAgo(35, new Date());
    var tempDates = this.commonService.getStartingEndingDatesOfMonthWithDate(
      tempDateDays ? tempDateDays : new Date()
    );
    let startDate = tempDates[0];
    let endDate = tempDates[1];
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        '/mainservice/finance/piecospayout/getPiecosWorthReadyToPayout?userId=' +
          this.userId
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.piecosWorthCashout = data['dataObject'];
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
          this.loadDiscoveriesForPayout();
        }
      });
  }
  getColor(details: any): any {
    if (this.member?.grade?.id == 3)
      //TODO member to be taken from the row itself as grade might be different for other months
      return details[1] >= details[2] ? 'grey' : 'red';
    else
      return details[1] >= details[2] ||
        (details[7] > 0 && details[1] + details[7] >= details[4])
        ? 'grey'
        : 'red';
  }
}
