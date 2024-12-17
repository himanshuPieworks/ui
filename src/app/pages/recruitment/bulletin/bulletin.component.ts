import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulletin',
  templateUrl: './bulletin.component.html',
  styleUrls: ['./bulletin.component.scss'],
})
export class BulletinComponent {
  breadCrumbItems!: Array<{}>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    this.breadCrumbItems = [
      { label: 'Manage',link:'/recr/manage', active: false },
      { label: 'Bulletin', active: true, link: '/recr/bulletin' }
    ];
    this.communityId = localStorage.getItem('communityId');
    this.loadFeed();
  }

  description: any;
  communityId: any;
  feeds: any = [];
  selectedFeed: any;
  includeInFeed(): void {
    if (!this.description || this.description.trim().length == 0) {
      this.commonService.showSuccessMessage(
        'Message',
        'Please enter the details .'
      );
      return;
    }
    var feed = {
      icon: '',
      title: 'Bulletin',
      description: this.description,
      link: '',
      communityId: this.communityId,
      type: 'bulletin',
      typeId: -1,
      userId: -1,
    };
    this.commonService
      .post('mainservice/framework/includeInFeeds', feed)
      .subscribe((data: any) => {
        if (data['result'] == 200)
          this.commonService.showSuccessMessage(
            'Message',
            'Mandate included in feed.'
          );
        else
          this.commonService.showSuccessMessage(
            'Message',
            "Error  : Couldn't mark mandate to focus on for the current week. Please try again later."
          );
        this.commonService.hideProcessingIcon();
        this.loadFeed();
        this.description = '';
      });
  }
  loadFeed(): void {
    this.commonService
      .get(
        'mainservice/framework/feeds?communityId=' +
          this.communityId +
          '&userId=-1&type=bulletin'
      )
      .subscribe((data: any) => {
        this.feeds = data['dataArray'];
      });
  }
  removeFromFeed(): void {
    var feed = this.selectedFeed;
    this.commonService
      .post('mainservice/framework/removeFromFeeds', feed)
      .subscribe((data: any) => {
        if (data['result'] == 200)
          this.commonService.showSuccessMessage(
            'Message',
            'Bulletin point removed.'
          );
        else
          this.commonService.showSuccessMessage(
            'Message',
            "Error  : Couldn't remove bulletin point. Please try again later."
          );
        this.commonService.hideProcessingIcon();
        this.loadFeed();
        this.selectedFeed = undefined;
      });
  }
  confirmDeleteFeed(): void {
    Swal.fire({
      title: 'Confirmation required',
      text:
        "Are you sure you  want to delete" ,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      if (result.value) {
        this.removeFromFeed();
      }
    });
   
  }
}
