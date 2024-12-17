import { Component, OnInit, ViewChild } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {
  constructor(public commonService: PieworksCommonService) {}

  @ViewChild('addRoles') addRoles: any;
  @ViewChild('membersModal') membersModal: any;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Roles', link: '/recr/roles', active: true },
    ];
    this.loadRoles();
  }

  // bread crum items
  breadCrumbItems!: Array<{}>;
  roles: any = [];

  loadRoles(): void {
    this.commonService.showProcessingIcon();
    let url = 'mainservice/framework/roles/show';

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.roles = data['dataObject'];
        // console.log(this.roles);
      }
    });
  }

  roleMembers: any;
  selectedRole: any;
  pageNum: any = 1;
  pageSize: any = 15;
  loadRoleMembers(): void {
    this.commonService.showProcessingIcon();
    let url =
      'mainservice/framework2/forward?api=frameworkservice/framework2/community/membersByRole?communityId=' +
      localStorage.getItem('communityId') +
      ',role=' +
      this.selectedRole.name +
      ',pageNum=' +
      this.pageNum +
      ',pageSize=' +
      this.pageSize;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.roleMembers = data['dataArray'];
        // console.log(this.roleMembers)
      }
    });
  }

  payload: any = {
    name: '',
    description: '',
    noOfMembers: '0',
  };

  saveRoles(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('/mainservice/framework/roles/save', this.payload)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.payload.name = '';
          this.payload.description = '';
          this.payload.shortName = '';
          this.loadRoles();
          this.addRoles.hide();
        }
      });
  }
  icon: any = 'ri-gamepad-fill';
  // confirmation for deleting the club
  removeRole(role: any): void {
    Swal.fire({
      title: 'Confirmation required',
      text: 'Are you sure you want to delete Role ' + role.name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.deleteRole(role);
      }
    });
  }

  deleteRole(value: any): void {
    this.commonService.showProcessingIcon();

    this.commonService
      .post('mainservice/framework/roles/removeRole/' + value.id, value)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.loadRoles();
        }
      });
  }
}
