import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PieworksCommonService} from '../../../common/pieworkscommon.service';
import {Options} from '@angular-slider/ngx-slider';
import {Location} from '@angular/common';
import Swal from 'sweetalert2';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
    selector: 'app-buddy-view',
    templateUrl: './buddy-view.component.html',
    styleUrls: ['./buddy-view.component.scss']
})
export class BuddyViewComponent {
    user: any;
    breadCrumbItems = [
        {label: 'Home', active: false, link: '/'},
        {label: 'Manage', link: '/recr/manage', active: false},
        {label: 'Community', active: false},
    ]; //this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Modals', active: true }];
    members: any = [];
    constructor(
        private _location: Location,
        private router: Router,
        private route: ActivatedRoute,
        public commonService: PieworksCommonService,
        private clipboard: Clipboard
    ) {
        this.loadBuddies();
    }
    memberType: any = ""; totalEntries: any = 0;
    getOnlineStatusIcon(status: any): any {
        switch (status) {
            case 'WORK_ON_MODE':
                return ' ri-checkbox-blank-circle-fill pieworks-green';
            case 'IN_A_MEETING':
                return ' ri-checkbox-blank-circle-fill pieworks-red';
            case 'WORK_OFF_MODE':
                return ' ri-checkbox-blank-circle-line';
            default:
                return 'icofont-exit';
        }
    }

    loadBuddies(): void 
    {
        var url =
             'mainservice/framework2/forward?api=recruitmentservice/discovery/cobuddies?communityId='+localStorage.getItem("communityId")+',userId='+this.commonService.user.id;
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data: any) => {
            this.commonService.hideProcessingIcon();
            if (data['result'] === 200) {
                this.members = data['dataArray'];
                this.loadClub();
                }
            }
        );
    }
    clubs: any;
  loadClub(): void {
    this.commonService.showProcessingIcon();
    let url = 'mainservice/framework/clubs/show';

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.clubs = data['dataObject'];
        // this for loop is for club icon in new array
          for (var i = 0; i < this.members?.length; i++) {
            this.members[i].selectedClubArray = [];
            if (this.members[i].clubs && this.members[i].clubs.length > 0) {
              let temp = this.members[i].clubs.split(',');
              for (var j = 0; j < temp.length; j++) {
                for (var k = 0; k < this.clubs.length; k++) {
                  if (temp[j] == this.clubs[k].name) {
                    this.members[i].selectedClubArray.push(this.clubs[k]); //this array is only for displaying. not for saving.
                  }
                }
              }
            }
          }
      }
    });
  }
}
