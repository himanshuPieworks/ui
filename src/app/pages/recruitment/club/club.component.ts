import { Component, OnInit, ViewChild } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
})
export class ClubComponent implements OnInit {
  constructor(
    public commonService: PieworksCommonService,
    private clipboard: Clipboard
  ) {}

  @ViewChild('addClubs') addClubs: any;
  @ViewChild('membersModal') membersModal: any;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Clubs', link: '/recr/clubs', active: true },
    ];
    this.loadClub();
  }

  // bread crum items
  breadCrumbItems!: Array<{}>;
  clubs: any = [];

  loadClub(): void {
    this.commonService.showProcessingIcon();
    let url = 'mainservice/framework/clubs/show';

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.clubs = data['dataObject'];
        console.log(this.clubs);
      }
    });
  }

  // for members in
  pageNum: any = 1;
  pageSize: any = 100;
  selectedClub: any;
  clubMember: any;
  loadMember(): void {
    this.commonService.showProcessingIcon();
    let url =
      'mainservice/framework2/forward?api=frameworkservice/framework2/community/membersByClub?communityId=' +
      localStorage.getItem('communityId') +
      ',club=' +
      this.selectedClub.name +
      ',pageNum=' +
      this.pageNum +
      ',pageSize=' +
      this.pageSize;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.clubMember = data['dataArray'];
        console.log(this.clubMember);
      }
    });
  }

  clubMemberEmail:any;
  copyClubMember(): any {
    this.commonService.showProcessingIcon();
    let url =
      'mainservice/framework2/forward?api=frameworkservice/framework2/community/membersByClub?communityId=' +
      localStorage.getItem('communityId') +
      ',club=' +
      this.selectedClub.name +
      ',pageNum=' +
      this.pageNum +
      ',pageSize=' +
      this.pageSize;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.clubMemberEmail = data['dataArray'];
        
        const usernames: string = this.clubMemberEmail.map((member:any) => member.user.username).join(', ');

        this.clipboard.copy(usernames);
        
        this.commonService.showSuccessMessage("Member's", 'Email Copied !');
        this.membersModal.hide();
      }
    });
  }

  payload: any = {
    name: '',
    description: '',
    noOfMembers: '0',
  };

  saveClubs(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('/mainservice/framework/clubs/save', this.payload)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.payload.name = '';
          this.payload.description = '';
          this.loadClub();
          this.addClubs.hide();
        }
      });
  }
  icon: any = 'ri-gamepad-fill';
  // confirmation for deleting the club
  removeClub(club: any): void {
    Swal.fire({
      title: 'Confirmation required',
      text: 'Are you sure you want to delete Club ' + club.name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.deleteClub(club);
      }
    });
  }

  deleteClub(value: any): void {
    this.commonService.showProcessingIcon();

    this.commonService
      .post('mainservice/framework/clubs/removeClub/' + value.id, value)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.loadClub();
        }
      });
  }
}
