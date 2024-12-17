import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-talent-profile',
  templateUrl: './talent-profile.component.html',
  styleUrls: ['./talent-profile.component.scss'],
})
export class TalentProfileComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  userId: any;

  role: any;
  isOwnAccount = false;
  @ViewChild('contractModal') contractModal: any;
  @ViewChild('lgModal') lgModal: any;
  @Input('parentObj') parentObj: any;
  @ViewChild('futureFormPopup') futureFormPopup: any;
  @ViewChild('futureForm') futureForm: any;


  ngOnInit(): void {
    

    this.loadClub();

    this.userId = this.commonService.user.id;
    this.getSubscriptionStatus();
  }
  action: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService,
    private httpClient: HttpClient
  ) {
    this.role = localStorage.getItem('role');
    this.action = this.commonService.getParameterFromUrl('action');
    this.userId = this.route.snapshot.paramMap.get('id');
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Profile', link: '/', active: false },
    ];

    this.commonService.loadMyProfile(this, (user: any, parentObj: any) => {
      parentObj.user = user;
    });
  }
  selectedQuarter = 1;
  selectedYear = new Date().getFullYear();
  quarterArray = [
    { id: 1, name: 'Q1' },
    { id: 2, name: 'Q2' },
    { id: 3, name: 'Q3' },
    { id: 4, name: 'Q4' },
  ];
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

  loadFuture(): void {
    var url =
      'mainservice/recruitment/future/getByUserId/' +
      this.commonService.user.id;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        let candidate = data['dataObject'];

        if (!candidate) this.futureFormPopup.show();

        if (candidate.leadershipProgram) candidate.leadershipProgram = 'true';
        else candidate.leadershipProgram = 'false';

        this.futureForm.candidate = candidate;

        // setting up the clubs from future.
        this.selectedClubs = '';
        var temp: any = [];
        if (this.futureForm.candidate.clubs)
          temp = this.futureForm.candidate.clubs.split(',');
        this.selectedClubsArray = [];
        for (var i = 0; i < this.clubs.length; i++) {
          for (var j = 0; j < temp.length; j++) {
            if (this.clubs[i].name == temp[j]) {
              this.clubs[i].selected = true;
              this.updateSelectedClubs(this.clubs[i], false);
              break;
            }
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
  editCurrentCompany = false;
  editUserName = false;
  user: any;
  saveUser(): void {
    this.editSocial = false;
    this.editUserName = false;
    this.editContactDetails = false;

    var url = 'mainservice/auth/user';

    this.commonService.post(url, this.user).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.commonService.showSuccessMessage('Saved', 'User is saved');
      }
    });
  }

  checked = false;

  updateFutureForm(): void {
    this.futureForm.candidate.clubs = this.selectedClubs;

    this.commonService
      .post(
        'mainservice/recruitment/future/openresource/save',
        this.futureForm.candidate
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.loadFuture();
          this.editClub = false;
          this.commonService.showInfoMessage('Updated','Your change is done :)')
          //this.commonService.showErrorMessage("Info",this.message);
        } else {
          this.commonService.showErrorMessage('Error', data['message']);
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

        this.loadFuture();
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

  //on selecting profile pic of founder this method is called for upload
  file: any;
  userProfile: any;

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
        this.commonService.hideProcessingIcon();
        this.commonService.showInfoMessage('data', 'Uploaded');
        this.commonService.loadMyProfile(this, (user: any, parentObj: any) => {
          parentObj.user = user;
        });
      });
  }

  convertToTitleCase(inputString: string): string {
    const words = inputString.split(' ');
    const titleCaseString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return titleCaseString;
  }

  showCvInput(){
    var element = document.getElementById('cv');

    element?.click();
  }

  cv: any;
  tempMessage = '';
  onFileSelecet(event: any) {
    var errormessage = '';
    this.cv = null;
    if (event.target.files.length == 0) {
      return;
    }
    var file = event.target.files[0];
    if (file.size > 10485760 * 1) {
      //10 x 1 MB limit
      errormessage = 'File size too big. Please choose a file less than 10 MB.';
      this.commonService.showErrorMessage('Info', errormessage);
      var temp: any = document.getElementById('cv');
      temp['value'] = null;
      return;
    }
    this.cv = file;
    this.uploadCv();
  }
  
  uploadCv(): void {
    const formData: FormData = new FormData();
    formData.append('futureId', this.futureForm.candidate.id);
    if (this.cv) {
      formData.append('cv', this.cv, this.cv.name);
      this.commonService.showProcessingIcon();
      let headers = new HttpHeaders({
        Accept: 'application/json',
        Authorization: '', //localStorage.getItem("accesstoken").toString()
      });
      let options = { headers: headers };
      this.commonService.showProcessingIcon();
      this.commonService
        .post2(
          'mainservice/recruitment/future/openresource/cv',
          formData,
          options
        )
        .subscribe((data: any) => {
          this.commonService.hideProcessingIcon();
          if (data['result'] === 200) {
            this.message = this.tempMessage;
            this.commonService.goTop();
            this.commonService.showSuccessMessage(
              'Info',
              'File uploaded success.'
            );
            this.loadFuture();
          } else {
            this.commonService.showErrorMessage(
              'Info',
              'File upload failed. Please try again later.'
            );
          }
        });
    } else {
      this.message = this.tempMessage;
      this.commonService.goTop();
    }
  }
}
