import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-client-side-bar',
  templateUrl: './client-side-bar.component.html',
  styleUrls: ['./client-side-bar.component.scss'],
})
export class ClientSideBarComponent {
 
  constructor(
    public commonService: PieworksCommonService,
    private router: Router
  ) {
    setTimeout(() => {
      this.clientActionable();
      this.clientOffered();
    }, 500);
  }

  clientActionable() {
    let clientIds = this.commonService.clientIds
      .toString()
      .split(',')
      .join('-');
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/client/actionables?clientIds=' +
      clientIds;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.talentOverview = data['dataArray'];
        let length = this.talentOverview.length / 3;
        if (this.talentOverview % 3 != 0) length = length + 1;
        this.indexes = [];
        for (let i = 0; i < length; i++) {
          this.indexes.push(i);
        }
        this.changedCarosel(0);
      }
    });
  }
  clientOffered() {
    let clientIds = this.commonService.clientIds
      .toString()
      .split(',')
      .join('-');
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/client/offeredCandidates?clientIds=' +
      clientIds;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.postOfferOverview = data['dataArray'];
        console.log(this.postOfferOverview);

        let length = this.postOfferOverview.length / 3;
        if (this.postOfferOverview % 3 != 0) length = length + 1;
        this.postIndex = [];
        for (let i = 0; i < length; i++) {
          this.postIndex.push(i);
        }

        this.changedCarouselPostOffer(0);
      }
    });
  }

  changedCarosel(event: any): void {
    //0 = > 0,2
    //1 => 3,5
    //2 => 6,8
    //3 => 9,11

    let startIndex = event == 0 ? 0 : event * 3;
    let endIndex = startIndex + 3;
    this.tempData = [];
    this.tempData = this.talentOverview.slice(startIndex, endIndex);

    for (var i = 0; i < this.tempData.length; i++) {
      this.fromDate = this.commonService.getJsDateObject(
        this.tempData[i].modifiedOn
      );
      this.tempData[i].fromDate = this.commonService.getDaysBetween(
        this.fromDate,
        new Date()
      );
    }
  }
  fromDate: any;
  talentOverview: any = [];
  indexes: any = [];
  tempData: any = [];
  toDate: any = new Date();

  postIndex: any = [];
  tempDataPost: any = [];
  nextDate: any;
  changedCarouselPostOffer(event: any): any {
    let startIndex = event == 0 ? 0 : event * 3;
    let endIndex = startIndex + 3;
    this.tempDataPost = [];
    this.tempDataPost = this.postOfferOverview.slice(startIndex, endIndex);

    for (var i = 0; i < this.tempDataPost.length; i++) {
      let temp = this.commonService.changeMysqlToNormalDate(
        this.tempDataPost[i].nextCheck
      );
      this.tempDataPost[i].nextDate = temp;
    }
  }

  postOfferOverview: any;

  @ViewChild('talentReport') talentReport: any;
  selectedTalent: any;
  talentPopUpDetails: any;
  talentPopUp(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/discovery/clientAnchorTalentOverviewDetails?discId=' +
      this.selectedTalent.id;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.talentPopUpDetails = data['dataObject'];
        console.log(this.talentPopUpDetails);
      } else console.error('Error in getting data');
    });
  }
  // clientAnchorFeedback

  navigateToTracker(status: any, statusIds: any): void {
    switch (status) {
      case 'new':
        this.router.navigate(['fw/client/tracker/' + '0' + '/' + statusIds]);
        break;
      case 'intrv':
        this.router.navigate(['fw/client/tracker/' + '0' + '/' + statusIds]);
        break;
      case 'offers':
        this.router.navigate(['fw/client/tracker/' + '0' + '/' + statusIds]);
        break;
    }
  }
}
