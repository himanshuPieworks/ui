import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { PushNotificationService } from '../push-notification.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  userId: any;
  member: any = {};
  role: any;
  isOwnAccount = false;
  @ViewChild('contractModal') contractModal: any;
  @ViewChild('lgModal') lgModal: any;
  @Input('parentObj') parentObj: any;
  ngOnInit(): void {
    this.checkPendingContract();
    this.loadLatestContract();
    this.loadDocuments();
    this.loadPod();
    this.loadClub();
    this.loadRoles();
    this.userId = this.commonService.user.id;
    this.getSubscriptionStatus();
  }
  action: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService,
    private httpClient: HttpClient,
    private pushNotificationService: PushNotificationService,
  ) {
    this.role = localStorage.getItem('role');
    this.action = this.commonService.getParameterFromUrl('action');
    this.userId = this.route.snapshot.paramMap.get('id');
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Profile', link: '/', active: false },
    ];

    if (this.action == 'uploadKyc') {
      setTimeout(() => {
        this.lgModal.show();
      }, 500);
    }
  }
  selectedQuarter = 1;
  selectedYear = new Date().getFullYear();
  finishedOnBoardingSteps(): void {
    this.lgModal.hide();
  }
  quarterArray = [
    { id: 1, name: 'Q1' },
    { id: 2, name: 'Q2' },
    { id: 3, name: 'Q3' },
    { id: 4, name: 'Q4' },
  ];
  onSubscribe() {
    this.pushNotificationService.subscribeToNotifications()
      .subscribe({
        next: (response) => {
          console.log('Subscription successful:', response);
          this.commonService.showSuccessMessage("Push Notification","Subscribed to Push Notification :)");
        },
        error: (error) => {
          console.error('Subscription failed:', error);
        }
      });
  }

  testNotification()
  {
    this.commonService.sendNotification(
      "94195,7",
      "This is test push",
      "/recr/wp/229450",
      "COMMUNITY MEMBER",
      1,
      0,
      1
    );
  }
  yearArray = [this.selectedYear];
  selectedMandate: any;
  mandateDetails(): void {
    this.router.navigate([
      'recr/wp/' + this.selectedMandate.recruitmentRequirement.id,
    ]);
  }
  @ViewChild('tab3' /* #name or Type*/, { static: false }) tab3: any;
  filterChanged(): void {
    this.tab3.loadData(this.selectedQuarter, this.selectedYear);
  }

  loadMyMembership(): void {
    this.commonService
      .get(
        'mainservice/framework/members/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=0,1,2,3,4,5,6,7,8,9,10&acceptanceByAceMakerValues=0,1,2,3,4,5,6,7,8,9,10&userId=' +
          this.commonService.user.id +
          '&roleInCommunity=0,1'
      )
      .subscribe((data: any) => {
        var temp = data['dataArray'];

        this.member = temp[0];
        if (this.member.contractAcceptance === 'accepted') {
          this.newContractAvailable = true;
        }
        if (this.commonService.user.id == this.member.user.id) {
          this.isOwnAccount = true;
        }
        this.selectedClubs = '';
        var temp: any = [];
        if (this.member.clubs) temp = this.member.clubs.split(',');
        this.selectedClubsArray = [];
        for (
          var i = 0;
          i < this.clubs.length;
          i++ //marking already selected clubs from DB
        ) {
          for (var j = 0; j < temp.length; j++) {
            if (this.clubs[i].name == temp[j]) {
              this.clubs[i].selected = true;
              this.updateSelectedClubs(this.clubs[i], false);
              break;
            }
          }
        }

        this.selectedRoles = '';

        if (this.member.roles) temp = this.member.roles.split(',');

        for (
          var i = 0;
          i < this.roles.length;
          i++ //marking already selected roles from DB
        ) {
          for (var j = 0; j < temp.length; j++) {
            if (this.roles[i].name.toUpperCase() == temp[j].toUpperCase()) {
              this.roles[i].selected = true;
              this.roles[i].name = temp[j];
              this.updateSelectedRoles(this.roles[i], false);
              break;
            }
          }
        }
      });
  }

  unsubscribeDone: boolean = false;

  // getting mail notification status
  getSubscriptionStatus(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/open/getSubscribtion?emailId=' +
          this.commonService.user.username
      )
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          if (data['dataObject']) {
            this.unsubscribeDone = true;
          }
        }
      });
  }
  subscribeMail(): void {
    Swal.fire({
      title: 'Confirmation required',
      text: 'Are you sure you want email Notifications ',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      if (result.value) {
        this.commonService
          .get(
            'mainservice/open/subscribeMail?emailId=' +
              this.commonService.user.username
          )
          .subscribe((data: any) => {
            this.commonService.hideProcessingIcon();
            if (data['result'] === 200) {
              this.unsubscribeDone = false;
              this.commonService.sendNotification(
                this.commonService.user.id,
                'You Subscribed Mail Notification :)',
                '/fw/user',
                'COMMUNITY MEMBER',
                1,
                0
              );
            }
          });
      }
    });
  }

  unsubscribeMail(): void {
    Swal.fire({
      title: 'Confirmation required',
      text: "Are you sure you don't want email Notifications ",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      if (result.value) {
        this.commonService
          .post('mainservice/open/unSubscribeMail?emailId=', {
            reason: 'Not relevant',
            emailId: this.commonService.user.username,
          })
          .subscribe((data: any) => {
            this.commonService.hideProcessingIcon();
            if (data['result'] === 200) {
              this.unsubscribeDone = true;
              this.commonService.sendNotification(
                this.commonService.user.id,
                'You Unsubscribed Mail Notification :(',
                '/fw/user',
                'COMMUNITY MEMBER',
                1,
                0
              );
            }
          });
      }
    });
  }

  newContractAvailable = false;
  autoAcceptanceDate: any;
  editSocial = false;
  editContactDetails = false;
  editUserName = false;
  checkPendingContract(): void {
    if (!this.isOwnAccount) {
      //other's profile page it is
      return;
    }
    this.commonService
      .get(
        'mainservice/framework2/checkPendingContract?userId=' +
          this.commonService.user.id
      )
      .subscribe((data: any) => {
        if (data['result'] == 200) this.newContractAvailable = true;
      });
  }

  loadLatestContract(): void {
    var url = 'mainservice/framework2/latestContract?domain=recruitment';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        var date = this.commonService.getJsDateObject(
          data['dataObject'].createdOn
        );
        this.autoAcceptanceDate = this.commonService.getFormatedDate(
          this.commonService.getDateXDaysAgo(-3, date),
          'dd-MM-yyyy'
        );
      }
    });
  }

  saveUser(): void {
    this.editSocial = false;
    this.editUserName = false;
    this.editContactDetails = false;

    var url = 'mainservice/auth/user';

    this.commonService.post(url, this.member.user).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.commonService.showSuccessMessage('Saved', 'User is saved');
      }
    });
  }

  checked = false;
  contractUrl = '';
  loadDocuments(): void {
    this.commonService
      .get(
        'mainservice/framework2/open/independentContracts?domain=recruitment'
      )
      .subscribe((data: any) => {
        this.contractUrl = this.commonService.getPicUrl(
          data['dataArray'][0].url
        );
      });
  }

  submitContractAcceptance(): void {
    var errormessage = '';
    var args = {
      arg1: localStorage.getItem('communityId') + '',
      arg2: this.commonService.user.id,
    };
    this.commonService
      .post('mainservice/framework/open/acceptContract', args)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.commonService.showSuccessMessage(
            '',
            'Thank you. Your response has been recorded.'
          );

          this.contractModal.hide();

          if (this.member.contractAcceptance === 'accepted') {
            this.newContractAvailable = true;
          }
        } else {
          errormessage = 'Couldnt record your response. Please try again later';
          this.commonService.showErrorMessage('', errormessage);
        }
      });
  }
  /*
  loadCommunityMember(): void {
    this.commonService.showProcessingIcon();
    var url =
      'mainservice/framework/members/' +
      localStorage.getItem('communityId') +
      '?acceptanceByAceValues=-1&acceptanceByAceMakerValues=-1&userId=2222&roleInCommunity=' +
      localStorage.getItem('user.roleInCommunity');
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        
       
      }
    });
  }
*/
  pods: any;
  loadPod(): void {
    var url =
      'mainservice/recruitment/pod/myPods?communityId=' +
      localStorage.getItem('communityId') +
      '&userId=' +
      this.commonService.user.id;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.pods = data['dataArray'];
        for (let i = 0; i < this.pods.length; i++) {
          let discs = this.totalNumberOfCvUploaded(
            this.pods[i].recruitmentRequirement.id,
            (discs: any) => {
              this.docalculationsForPod(this.pods[i], discs);
            }
          );
        }
      }
    });
  }
  docalculationsForPod(pod: any, discs: any): any {
    if (discs.length == 0) {
      pod.economy = 0;
      pod.strikeRate = 0;
      pod.total = 0;
      return;
    }
    let intrvs = 0;
    let s2cs = 0;
    for (var i = 0; i < discs.length; i++) {
      if (discs[i].status.id == 6) s2cs++;
      else if (discs[i].status.id == 8) intrvs++;
    }
    pod.economy = Math.ceil((s2cs / discs.length) * 100);

    pod.strikeRate = Math.ceil((intrvs / discs.length) * 100);

    pod.total = discs.length;

    return pod;
  }

  removePod(arg: any) {
    Swal.fire({
      title: 'Confirmation required',
      text:
        "Are you sure you don't want to work on " +
        arg.recruitmentRequirement.role.name +
        ',' +
        arg.recruitmentRequirement.client.name +
        ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      if (result.value) {
        this.deletePod(arg);
      }
    });
  }
  deletePod(arg: any): void {
    var url = '/mainservice/recruitment/pod/deletePod';
    this.commonService.showProcessingIcon();
    this.commonService.post(url, arg).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.loadPod();
        this.commonService.showErrorMessage('Remove', 'Removed from this pod');
      }
    });
  }

  totalCvUploaded: any;
  totalNumberOfCvUploaded(reqId: any, cb: any): any {
    var url =
      'mainservice/recruitment/shortlisting/shortlist/' +
      reqId +
      '?pageNum=1&pageSize=100&discovererIds=-1&clientAnchorIds=-1&searchText=&status=1,2,3,4,6,7,19,5,8,11,9,10,15,13,12,17,18,20,16&clientIds=-1&roles=-1&top50=false&minCtc=0&maxCtc=500&minExp=0&maxExp=50&tag=';
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        if (cb) cb(data['dataArray']);
      }
    });
  }

  clubs: any = [];

  editClub: any = false;
  selectedClubs: any = '';
  loadClub(): void {
    this.commonService.showProcessingIcon();
    let url = 'mainservice/framework/clubs/show';

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.clubs = data['dataObject'];

        this.loadMyMembership();
      }
    });
  }
  selectedClubsArray: any = [];
  selectedClubDescArray: any = [];
  selectedClubIconArray: any = [];

  updateSelectedClubs(club: any, fromUi: boolean): void {
    setTimeout(() => {
      this.selectedClubsArray = [];

      if (club.selected) {
        if (!this.selectedClubs || this.selectedClubs.length == 0) {
          this.selectedClubs = club.name;
          this.selectedClubDescArray.push(club.description);
          this.selectedClubIconArray.push(club.icon);
        } else {
          this.selectedClubs = this.selectedClubs + ',' + club.name;
          this.selectedClubDescArray.push(club.description);
          this.selectedClubIconArray.push(club.icon);
        }
        if (this.selectedClubs)
          this.selectedClubsArray = this.selectedClubs.split(',');
      } else {
        if (this.selectedClubs)
          this.selectedClubsArray = this.selectedClubs.split(',');
        for (var i = 0; i < this.selectedClubsArray.length; i++) {
          if (this.selectedClubsArray[i] == club.name) {
            this.selectedClubsArray.splice(i, 1);
            //break;
          }
        }
        this.selectedClubs = '';
        for (var i = 0; i < this.selectedClubsArray.length; i++) {
          if (this.selectedClubs.length == 0) {
            this.selectedClubs = this.selectedClubsArray[i];
          } else {
            this.selectedClubs =
              this.selectedClubs + ',' + this.selectedClubsArray[i];
          }
        }
      }
      this.selectedClubsArray = this.removeDuplicates(this.selectedClubsArray);
      if (this.selectedClubsArray.length == 3 && fromUi) {
        this.commonService.showInfoMessage(
          'Info',
          'You have reached maximum allowed clubs ! '
        );
      }
    }, 200);
  }
  //
  removeDuplicates(arr: any) {
    return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
  }

  selectedRolesArray: any = [];
  selectedRoleDescArray: any = [];
  selectedRoleColorArray: any = [];
  selectedRoleShortArray: any = [];
  updateSelectedRoles(role: any, fromUi: boolean): void {
    setTimeout(() => {
      this.selectedRolesArray = [];
      if (role.selected) {
        if (!this.selectedRoles || this.selectedRoles.length == 0) {
          this.selectedRoles = role.name;
          this.selectedRoleDescArray.push(role.description);
          this.selectedRoleColorArray.push(role.colorValue);
          this.selectedRoleShortArray.push(role.shortName);
        } else {
          this.selectedRoles = this.selectedRoles + ',' + role.name;
          this.selectedRoleDescArray.push(role.description);
          this.selectedRoleColorArray.push(role.colorValue);
          this.selectedRoleShortArray.push(role.shortName);
        }
        if (this.selectedRoles)
          this.selectedRolesArray = this.selectedRoles.split(',');
      } else {
        if (this.selectedRoles)
          this.selectedRolesArray = this.selectedRoles.split(',');
        for (var i = 0; i < this.selectedRolesArray.length; i++) {
          if (
            this.selectedRolesArray[i].toUpperCase() == role.name.toUpperCase()
          ) {
            this.selectedRolesArray.splice(i, 1);
            //break;
          }
        }
        this.selectedRoles = '';
        for (var i = 0; i < this.selectedRolesArray.length; i++) {
          if (this.selectedRoles.length == 0) {
            this.selectedRoles = this.selectedRolesArray[i];
          } else {
            this.selectedRoles =
              this.selectedRoles + ',' + this.selectedRolesArray[i];
          }
        }
      }

      this.selectedRolesArray = this.removeDuplicates(this.selectedRolesArray);
      if (this.selectedRolesArray.length == 5 && fromUi) {
        this.commonService.showInfoMessage(
          'Info',
          'You have reached maximum allowed Roles ! '
        );
      }
    }, 200);
  }

  // saving the Role
  saveRoleMember(): void {
    this.member.roles = this.removeDuplicates(
      this.selectedRoles.split(',')
    ).toString();
    this.commonService
      .post('mainservice/framework/communitymember', this.member)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.selectedRolesArray = [];
        this.loadMyMembership();
        if (data['result'] == 200) {
          this.commonService.showSuccessMessage('Info', 'Updated Roles.');
          this.editRole = false;
        }
      });
  }

  // saving the club
  saveMember(): void {
    this.member.clubs = this.selectedClubs;
    this.commonService
      .post('mainservice/framework/communitymember', this.member)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.selectedClubsArray = [];
        this.loadMyMembership();
        if (data['result'] == 200) {
          this.commonService.showSuccessMessage('Info', 'Updated clubs.');
          this.editClub = false;
        }
      });
  }

  editRole: any = false;
  selectedRoles: any = '';
  roles: any;

  loadRoles(): void {
    this.commonService.showProcessingIcon();
    let url = 'mainservice/framework/roles/show';

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.roles = data['dataObject'];
      }
      this.loadMyMembership();
    });
  }

  //on selecting profile pic of founder this method is called for upload
  file: any;
  userProfile: any;
  onProfilePicSelect(event: any) {
    if (event.target.files.length == 0) {
      return;
    }
    this.file = event.target.files[0];
    if (this.file.size > 60720000) {
      //300*100 Kb limit
      this.message =
        'File size too big. Please choose a file less than 600 KB.';
      this.commonService.showErrorMessage('Error', this.message);
      return;
    }
    this.userProfile = event.target.files[0];
  }

  message: any;
  //on clicking on company logo it is called
  clickedOnLogo(): void {
    document.getElementById('logoHiddenButton')?.click();
  }
  //on select company logo this method is called
  logo: any;
  onLogoSelect(event: any) {
    if (event.target.files.length == 0) {
      return;
    }

    this.file = event.target.files[0];
    if (this.file.size > 60720000) {
      //300*100 Kb limit
      this.message =
        'File size too big. Please choose a file less than 600 KB.';
      this.commonService.showErrorMessage('Error', this.message);
      return;
    }
    this.logo = event.target.files[0];

    this.logoUpload();
  }

  //upload profile pic

  logoUpload(): void {
    this.commonService.showProcessingIcon();

    const formData: FormData = new FormData();

    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: localStorage.getItem('accesstoken') + '',
    });

    if (this.logo && this.logo !== null) {
      var fileName = this.logo.name;
      fileName = this.commonService.removeSpecialChar(fileName, '-.', '-');
      formData.append('image', this.logo, fileName);
    }

    formData.append('userId', this.commonService.user.id);

    let options = { headers: headers };

    this.commonService
      .post2('mainservice/auth/profilePic', formData, options)
      .subscribe((data: any) => {
        this.loadMyMembership();
        this.commonService.hideProcessingIcon();
        this.commonService.showInfoMessage('data', 'Uploaded');
      });
  }

  convertToTitleCase(inputString: string): string {
    const words = inputString.split(' ');
    const titleCaseString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return titleCaseString;
  }
}
