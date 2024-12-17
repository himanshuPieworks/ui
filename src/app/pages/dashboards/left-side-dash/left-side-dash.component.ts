import { Component, Input, ViewChild } from '@angular/core';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-left-side-dash',
  templateUrl: './left-side-dash.component.html',
  styleUrls: ['./left-side-dash.component.scss'],
})
export class LeftSideDashComponent {
  constructor(public commonService: PieworksCommonService) {
    this.user = JSON.parse(localStorage.getItem('user') + '');
    this.getWealth();
    this.getLeaderBoard();
    this.getMontlyBadges();
  }
  user: any = {};
  wealth: any = {};
  getWealth(): void {
    this.commonService
      .get(
        'mainservice/framework/calculateMoneyForCommunity?communityId=' +
          localStorage.getItem('communityId') +
          '&domain=RECRUITMENT&userId=' +
          this.user.id
      )
      .subscribe((data: any) => {
        this.wealth.potential = 0;
        this.wealth.committed = 0;
        this.wealth.realized = 0;
        if (data['result'] == 200) {
          this.wealth.potential = data['dataObject'].arg1;
          this.wealth.committed = data['dataObject'].arg2;
          this.wealth.realized = data['dataObject'].arg3;
        }
      });
  }

  leaderBoard: any;
  getLeaderBoard(): void {
    var url =
      'mainservice/framework2/forward?api=frameworkservice/framework2/community/leaderBoard?communityId=' +
      localStorage.getItem('communityId');
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.leaderBoard = data['dataArray'];

      } else console.error('Error in getting data');
    });
  }

  monthlyBadges: any;
  getMontlyBadges(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/discovery/performanceIndex?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.commonService.user.id;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.monthlyBadges = data['dataObject'];
      } else console.error('Error in getting data');
    });
  }


  windowScroll() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        if((document.getElementById('back-to-top') as HTMLElement))
            (document.getElementById('back-to-top') as HTMLElement).style.display = "block";
      document.getElementById('page-topbar')?.classList.add('topbar-shadow')
    } else 
    {
        if((document.getElementById('back-to-top') as HTMLElement))
            (document.getElementById('back-to-top') as HTMLElement).style.display = "none";
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow')
    }
  }
}
