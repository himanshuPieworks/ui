import { Component, ViewChild } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-talent-overview',
  templateUrl: './talent-overview.component.html',
  styleUrls: ['./talent-overview.component.scss'],
})
export class TalentOverviewComponent {
  constructor(public commonService: PieworksCommonService) {
    this.loadTalentOverview();
    this.loadPostOfferOverview();
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
  loadTalentOverview(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/discovery/clientAnchorTalentOverview?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.commonService.user.id;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] == 200) {
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

  loadPostOfferOverview(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/discovery/postOfferDiscoveries?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.commonService.user.id;

    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.postOfferOverview = data['dataArray'];

        let length = this.postOfferOverview.length / 3;
        if (this.postOfferOverview % 3 != 0) length = length + 1;
        this.postIndex = [];
        for (let i = 0; i < length; i++) {
          this.postIndex.push(i);
        }

        this.changedCarouselPostOffer(0);
      } else console.error('Error in getting data');
    });
  }

  @ViewChild('talentReport') talentReport:any;
  selectedTalent:any;
  talentPopUpDetails:any;
  talentPopUp():void
  {
    var url ='mainservice/framework2/forward?api=recruitmentservice/discovery/clientAnchorTalentOverviewDetails?discId='+this.selectedTalent.id;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.talentPopUpDetails = data['dataObject'];
        console.log(this.talentPopUpDetails);
      } else console.error('Error in getting data');
    })

  }
  // clientAnchorFeedback



}
