import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-community-dashboard',
  templateUrl: './community-dashboard.component.html',
  styleUrls: ['./community-dashboard.component.scss'],
})
export class CommunityDashboardComponent implements OnInit {
  // bread crumb items
  @ViewChild('lgModal') lgModal: any;
  @ViewChild('guidePopUp') guidePopUp: any;
  @ViewChild('seekersPopUp') seekersPopUp: any;
  @ViewChild('showCompleteKyc') showCompleteKyc: any;
  name: any;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  parentObj = this;
  constructor(
    private modalService: BsModalService,
    public commonService: PieworksCommonService,
    private router: Router
  ) {}

  clientAnchorView: any;

  ngOnInit(): void {
    if (this.commonService.user.userrole != 'COMMUNITY MEMBER') return;

    if (!this.commonService.isMobileDevice) {
      this.loadMonthlyStats();
      this.loadNorthStar();
    }
    this.clientAnchorTopBar();

    this.clientAnchorView = localStorage.getItem('dashView');
    this.loadMyMembership();
    this.showPostOfferWindow();

    setTimeout(()=> {
      if(!this.member.memberSince) return;

      var fromDate:any  = this.commonService.getDateXDaysAgo(30,new Date);
      var memberDate:any = this.commonService.getJsDateObject(this.member.memberSince);
      var daysLeft = 30 - this.commonService.getDaysBetween(memberDate,new Date);

      if(this.monthlyStats.length < 5 && this.member.memberSince && (this.commonService.compareDates(memberDate,fromDate) == 1))
      {
        this.commonService.showInfoMessage('Alert !!',"Please complete a minimum of 4 referral candidates across any of the opened mandates/positions in next " + Math.round(daysLeft/7) +" week(s) to stay active on the community")
      }
      
    },5000)
  }

  finishedOnBoardingSteps(): void {
    this.lgModal.hide();
  }
  user: any; //will be filled from onboarding steps component
  loadedProfileFromOnBoardingSteps(member: any): void {
    this.member = member;
    this.user = member.user;
    // alert(member.contractAcceptance)
    if (member.contractAcceptance == 'pending') {
      // && member.acceptanceByAceMaker==0)
      this.lgModal.show();
    } else {
      this.loadKyc(this.user.id);
    }
  }
  kyc: any;
  loadKyc(userId: any): void {
    this.kyc = undefined;
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/kyc?userId=' + userId)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.kyc = data['dataObject'];
          console.log("This is kyc data : ",this.kyc)
          if (this.kyc == null || this.kyc == undefined) {
            // setTimeout(() => {
            //   localStorage.setItem('kyc','pending');
            //   this.lgModal.show();
            // }, 1000);

            // this.commonService.showInfoMessage('Profile 80% Done 👍',"To Complete you profile 100% fill the KYC in profile section :) ")
          }
          else
          {
            localStorage.removeItem('kyc');
          }
        }
      });
  }
  kycDetails:string = '';
  checkKyc(){
    this.kycDetails = localStorage.getItem('kyc') || '';
    if(this.kycDetails == 'pending')
      this.showCompleteKyc.show()
  }
  startDate: any = this.commonService
    .getFormatedDate(
      this.commonService.getDateXDaysAgo(180, new Date()),
      this.commonService.mysqlFormat
    )
    .split(' ')[0];
  endDate: any = this.commonService
    .getFormatedDate(new Date(), this.commonService.mysqlFormat)
    .split(' ')[0];

  monthlyStats: any;
  loadMonthlyStats(): void {
    this.commonService.showProcessingIcon();
    var url =
      'mainservice/recruitment/shortlisting/shortlist/-1?pageNum=1&pageSize=1000&discovererIds=' +
      this.commonService.user.id +
      '&clientAnchorIds=-1&searchText=&status=-1&clientIds=-1&roles=-1&top50=false&minCtc=0&maxCtc=500&minExp=0&maxExp=50&tag=';
    +'&startDate=' + this.startDate + '&endDate=' + this.endDate;

    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.monthlyStats = data['dataArray'];
        this.countInterview();
      } else console.error('Error in getting data');
    });
  }

  numberOfS2C: any = 0;
  interested: any = 0;
  interviewWlp: any = 0;
  offerSent: any = 0;
  countInterview(): void {
    for (let i = 0; i < this.monthlyStats.length; i++) {
      if (
        this.monthlyStats[i].requirement.status.id != 2 &&
        this.monthlyStats[i].requirement.status.id != 3 &&
        this.monthlyStats[i].requirement.status.id != 8
      ) {
        continue;
      }
      if (this.monthlyStats[i].status.id == 2) {
        this.interested++;
      } else if (this.monthlyStats[i].status.id == 6) {
        this.numberOfS2C++;
      } else if (this.monthlyStats[i].status.id == 8) {
        this.interviewWlp++;
      } else if (this.monthlyStats[i].status.id == 10) {
        this.offerSent++;
      }
    }
  }

  northStar: any;
  i: any = '';
  bt: any = '';
  loadNorthStar(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/discovery/northStarStatus?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.commonService.user.id;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.northStar = data['dataArray'];

        this.i = this.northStar[0] + '/' + this.northStar[1];
        if (this.northStar.length > 2)
          this.bt = this.northStar[2] + '/' + this.northStar[3];
      } else console.error('Error in getting data');
    });
  }

  //   I = myWeightedcount/myTarget
  // BT = mineAndTeamsWeightedCount/teamsTarget

  //top bar of Account Manager view
  clientAnchorData: any;
  clientAnchorTopBar(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/discovery/clientAnchorViewTopBar?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.commonService.user.id;

    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      this.clientAnchorData = data['dataObject'];
      console.log(this.clientAnchorData);
    });
  }
  navigateToMandatesCa(): void {
    if (this.commonService.user.confirmedUser == 1) {
      localStorage.setItem(
        'reqFilter',
        '::::1::200::2,3,8,9,10::' + this.commonService.user.id + '::'
      );
      this.commonService.navigateTo('recr/earn', {});
    }
  }
  navigateToThisMonthsOfferCa(): void {
    if (this.commonService.user.confirmedUser == 1) {
      let discIds = '';
      for (
        let i = 0;
        i < this.clientAnchorData.thisMonthOffersDiscoveries.length;
        i++
      ) {
        if (discIds.length == 0)
          discIds = this.clientAnchorData.thisMonthOffersDiscoveries[i].id;
        else
          discIds =
            discIds +
            ',' +
            this.clientAnchorData.thisMonthOffersDiscoveries[i].id;
      }
      this.commonService.navigateTo('recr/discoveries', {
        discoveryIds: discIds,
      });
    }
  }
  navigateToValPendingCa(): void {
    if (this.commonService.user.confirmedUser == 1) {
      let discIds = '';
      for (
        let i = 0;
        i < this.clientAnchorData.validationPendingDiscoveries.length;
        i++
      ) {
        if (discIds.length == 0)
          discIds = this.clientAnchorData.validationPendingDiscoveries[i].id;
        else
          discIds =
            discIds +
            ',' +
            this.clientAnchorData.validationPendingDiscoveries[i].id;
      }
      this.commonService.navigateTo('recr/discoveries', {
        discoveryIds: discIds,
      });
    }
  }
  navigateToFeedbackPendingCa(): void {
    if (this.commonService.user.confirmedUser == 1) {
      let discIds = '';
      for (
        let i = 0;
        i < this.clientAnchorData.feedbackPendingDiscoveries.length;
        i++
      ) {
        if (discIds.length == 0)
          discIds = this.clientAnchorData.feedbackPendingDiscoveries[i].id;
        else
          discIds =
            discIds +
            ',' +
            this.clientAnchorData.feedbackPendingDiscoveries[i].id;
      }
      this.commonService.navigateTo('recr/discoveries', {
        discoveryIds: discIds,
      });
    }
  }
  navigateToDiscoveries(action: any): void {
    let userIds = this.member.buddies + ',' + this.commonService.user.id;
    if (this.member.buddyType == 'CO-BUDDY')
      userIds = this.commonService.user.id;
    let startDate = this.commonService.getCurrentMonthStartDate();
    let endDate = this.commonService
      .getFormatedDate(new Date(), this.commonService.mysqlFormat)
      .split(' ')[0];
    let discIds = '';
    if (this.commonService.user.confirmedUser == 1) {
      switch (action) {
        case 'northStar':
          localStorage.setItem(
            'discFilter',
            '-1::' +
              userIds +
              '::::21,6,19,22,5,8,7,9,11,18,23,10,13,15,24,12,14,16,17,20::-1::-1::false::0::500::0::50::-1::' +
              startDate +
              '::' +
              endDate +
              '::false'
          );
          this.commonService.navigateTo('recr/discoveries', {});
          break;
        case 'interviewWip':
          discIds = '';
          for (let i = 0; i < this.monthlyStats.length; i++) {
            if (
              this.monthlyStats[i].requirement.status.id != 2 &&
              this.monthlyStats[i].requirement.status.id != 3 &&
              this.monthlyStats[i].requirement.status.id != 8
            ) {
              continue;
            }
            if (this.monthlyStats[i].status.id == 8) {
              if (discIds.length == 0) discIds = this.monthlyStats[i].id;
              else discIds = discIds + ',' + this.monthlyStats[i].id;
            }
          }
          if (discIds.length != 0)
            this.commonService.navigateTo('recr/discoveries', {
              discoveryIds: discIds,
            });
          break;
        case 's2c':
          discIds = '';
          for (let i = 0; i < this.monthlyStats.length; i++) {
            if (
              this.monthlyStats[i].requirement.status.id != 2 &&
              this.monthlyStats[i].requirement.status.id != 3 &&
              this.monthlyStats[i].requirement.status.id != 8
            ) {
              continue;
            }
            if (this.monthlyStats[i].status.id == 6) {
              if (discIds.length == 0) discIds = this.monthlyStats[i].id;
              else discIds = discIds + ',' + this.monthlyStats[i].id;
            }
          }
          if (discIds.length != 0)
            this.commonService.navigateTo('recr/discoveries', {
              discoveryIds: discIds,
            });
          break;
        case 'interested':
          discIds = '';
          for (let i = 0; i < this.monthlyStats.length; i++) {
            if (
              this.monthlyStats[i].requirement.status.id != 2 &&
              this.monthlyStats[i].requirement.status.id != 3 &&
              this.monthlyStats[i].requirement.status.id != 8
            ) {
              continue;
            }
            if (this.monthlyStats[i].status.id == 2) {
              if (discIds.length == 0) discIds = this.monthlyStats[i].id;
              else discIds = discIds + ',' + this.monthlyStats[i].id;
            }
          }
          if (discIds.length != 0)
            this.commonService.navigateTo('recr/discoveries', {
              discoveryIds: discIds,
            });
          break;
        case 'offerSent':
          discIds = '';
          for (let i = 0; i < this.monthlyStats.length; i++) {
            if (
              this.monthlyStats[i].requirement.status.id != 2 &&
              this.monthlyStats[i].requirement.status.id != 3 &&
              this.monthlyStats[i].requirement.status.id != 8
            ) {
              continue;
            }
            if (this.monthlyStats[i].status.id == 10) {
              if (discIds.length == 0) discIds = this.monthlyStats[i].id;
              else discIds = discIds + ',' + this.monthlyStats[i].id;
            }
          }
          if (discIds.length != 0)
            this.commonService.navigateTo('recr/discoveries', {
              discoveryIds: discIds,
            });
          break;
      }
    }
  }

  member: any;
  loadMyMembership(): void {
    if (this.member) return;
    this.commonService
      .get(
        'mainservice/framework/members/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=0,1,2,3,4,5,6,7,8,9,10&acceptanceByAceMakerValues=0,1,2,3,4,5,6,7,8,9,10&userId=' +
          this.commonService.user.id +
          '&roleInCommunity=0,1'
      )
      .subscribe((data: any) => {
        this.member = data['dataArray'][0];


        if(this.member.acceptanceByAceMaker == 11)
        {
          this.commonService.showErrorMessage('Alert !!','You have been withheld from discrete information on the platform, kindly connect with the Community Manager Mr. Anush Karthikeyan at anush@pieworks.in  and understand how you can rejoin')
        }
    //  alert(this.member.contractAcceptance)
        if (this.member.contractAcceptance == 'pending') {
          // && member.acceptanceByAceMaker==0)
          this.lgModal.show();
        } else {
          this.loadKyc(this.member.user.id);
        }
      });
  }

  hasPendingPostOfferTasks = false;
  showPostOfferWindow(): void {
    this.hasPendingPostOfferTasks = false;
    this.commonService
      .get(
        'mainservice/recruitment3/forward?api=shortlisting/untrackedPostOfferDiscoveries?clientAnchorId=' +
          this.commonService.user.id
      )
      .subscribe((data: any) => {
        var discoveryIds;
        if (data['result'] == 200) {
          discoveryIds = data['dataArray'];
        }
        if (discoveryIds && discoveryIds.length > 0) {
          this.hasPendingPostOfferTasks = true;
          //this.commonService.showConfirmWindow("Pending task alert !!","Post offer tracking is pending for some of the discoveries. Would you like to take it up now ?",()=>{
          //this.router.navigate(["community/2/domain/recruitment/requirements/-1/allShortlisting/"],{queryParams:{discoveryIds: discoveryIds.toString()}});
          if (
            localStorage.getItem('poSkipingDate') !=
            this.commonService.getFormatedDate(new Date(), 'dd-MM-yyyy')
          )
            this.router.navigate(['recr/open/post-offer'], {
              queryParams: { discoveryIds: discoveryIds.toString() },
            });
          //},undefined);
        }
      });
  }
}
