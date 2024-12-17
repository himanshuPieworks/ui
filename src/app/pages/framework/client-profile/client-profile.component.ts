import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss'],
})
export class ClientProfileComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  userId: any;

  role: any;
  isOwnAccount = false;
  @ViewChild('contractModal') contractModal: any;
  @ViewChild('report2') report2:any;
  

  contractUrl:any;
 

  ngOnInit(): void {
    this.userId = this.commonService.user.id;
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

    setTimeout(()=> {this.getProfileTopBarData();
      this. clientContract();
    },500)
  }

  profileTopBar:any;

  getProfileTopBarData() {
    let clientIds = this.commonService.clientIds
      .toString()
      .split(',')
      .join('-');
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/client/profileTopBar?clientIds=' +
      clientIds;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.profileTopBar = data['dataObject'];
       
      }
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

  @ViewChild('tab3' /* #name or Type*/, { static: false }) tab3: any;
  filterChanged(): void {
    this.tab3.loadData(this.selectedQuarter, this.selectedYear);
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

  clientContract(): void {
    var clientId = this.commonService.clientIds.toString();
    this.commonService
      .get(
        'mainservice/finance/recruitment/contract?clientId=' +
          clientId +
          '&communityId=-1'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
       
        if (data['result'] === 200) {
          let contract  = data['dataArray'];
          console.log("Contract: " , contract[0].contractDoc)
          this.contractUrl = contract[0].contractDoc;
        }
      });
  }
 
}
