import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { calculatePaddingBoxPath } from 'html2canvas/dist/types/render/bound-curves';

@Component({
  selector: 'app-focus-mandates',
  templateUrl: './focus-mandates.component.html',
  styleUrls: ['./focus-mandates.component.scss'],
})
export class FocusMandatesComponent {
  constructor(
    private router: Router,
    public commonService: PieworksCommonService,
    private route: ActivatedRoute
  ) {
    this.user = JSON.parse(localStorage.getItem('user') + '');
    this.communityId = localStorage.getItem('communityId');
    this.loadFeed();
  }
  communityId: any = 2;
  communities: any = [];
  hasBulletin: any = false;
  feeds: any = [];
  user: any = {};
  loadFeed(): void {
    var userIds = this.commonService.user.id + ',-1';
    this.hasBulletin = false;
    this.commonService
      .get(
        'mainservice/framework/feeds?communityId=' +
          this.communityId +
          '&userId=-1'
      )
      .subscribe((data: any) => {
        this.feeds = [];

        var arr = [];
        for (var i = 0; i < data['dataArray'].length; i++) {
          if (data['dataArray'][i].type == 'requirement') {
            this.feeds.push(data['dataArray'][i]);
            //console.log(this.feeds);
          }
          if (data['dataArray'][i].type == 'bulletin') {
            this.hasBulletin = true;
            arr.push(
              '<div class="companies-item" style="white-space: pre-line;"><div style="align-text: left">' +
                data['dataArray'][i].description +
                ' </div> </div>'
            );
          }
        }

        setTimeout(() => {
          for (var i = 0; i < this.feeds.length; i++) {
            var temp = this.feeds[i].description.split('#');
            this.feeds[i].position = temp[0];
            this.feeds[i].role = temp[1].replace(",","");
            this.feeds[i].location = temp[2];
            this.feeds[i].companyName = temp[3];
            
          }
        }, 300);
      });
  }

  selectedMandate: any;
  mandateDetails(): void {
    this.router.navigate(['recr/wp/' + this.selectedMandate.typeId]);
  }

  truncateString(inputString: string, maxLength: number): string {
      if(!inputString)
        return inputString;
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.substring(0, maxLength) + '...';
    }
  }
}
