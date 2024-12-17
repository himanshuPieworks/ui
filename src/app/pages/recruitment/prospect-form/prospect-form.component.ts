import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-prospect-form',
  templateUrl: './prospect-form.component.html',
  styleUrls: ['./prospect-form.component.scss'],
})
export class ProspectFormComponent {
  userId: any;
  emailId: any;
  name: any;
  prospectName: any;
  message: any = '';
  processingIcon = true;
  breadCrumbItems: any = [];
  submitted = false;
  currentStep = 'Basic details';
  prospectId: any;
  prospectsLabel: any = 'Prospects';
  userData: any;
  payload: any;

  //handling parent model from child model.
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  @Input('parentObj') parentObj: any;

  showExtra: boolean = false;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', active: false, link: '/' },
      { label: 'Workspace', active: true, link: '/recr/wp' },
    ];

    if (this.showExtra) {
      this.payload = {
        userId: -1, //-1 if a non member is filling
        userEmailId: '',
        userName: '',
        prospectName: '',
        companyName: '',
        prospectEmailId: '',
        prospectPhoneNo: '',
        communicationEmailSent: '', // pass yes/no
        validated: 'no',
        status: 'To connect', //
      };
    } else {
      this.payload = {
        userId: this.userId, //-1 if a non member is filling
        userEmailId: this.emailId,
        userName: this.name,
        prospectName: '',
        companyName: '',
        prospectEmailId: '',
        prospectPhoneNo: '',
        communicationEmailSent: '', // pass yes/no
        validated: 'no',
        status: 'To connect', //
      };
    }
  }

  constructor(
    public commonService: PieworksCommonService,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient
  ) {
    if (this.userId == '') {
      this.userId = -1;
    }
    // if(this.payload.communicationEmailSent == true)
    // {
    //   this.payload.communicationEmailSent = "yes";
    // }
    this.userData = JSON.parse(localStorage.getItem('user') + '');

    this.userId = this.commonService.user.id;
    this.emailId = this.commonService.user.username;
    this.name = this.commonService.user.name;

    const currentUrl = this.route.snapshot.url.join('/');
    if (currentUrl == 'open/prospects') {
      this.showExtra = true;
      console.log(this.showExtra);
    }
  }

  prospectContactType: any = [
    'select',
    'Hiring Manager',
    'Corporate Recruiter',
    'HR',
    'Founder/Founding Team',
  ];

  clientContact: any = {};
  addClientContact(): void {
    this.clientContact.clientId = this.prospectsData.id;
    this.clientContact.name = this.payload.prospectName;
    this.clientContact.contactNo = this.payload.prospectPhoneNo;
    this.clientContact.emailId = this.payload.prospectEmailId;
    this.clientContact.contactType = this.payload.contactType;
    this.clientContact.linkedIn = this.payload.prospectLinkedIn;
    this.clientContact.address = null;
    this.commonService.showProcessingIcon();
    var temp: any = [];
    temp.push(this.clientContact);
    // alert(temp)
    this.commonService
      .post('mainservice/framework/clientContact', temp)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          // this.loadClient();
        } else {
          this.message = data['message'];
        }
        // this.clientContact = {};
        // this.edit.prospectContact= false;
        // this.editCompanyContactDetails = false;
      });
  }

  isChecked: boolean = false;
  checkBoxValue: any;

  checkValue(event: any): void {
    if (event.target.checked) {
      this.payload.communicationEmailSent = 'yes';
    } else {
      this.payload.communicationEmailSent = 'no';
    }
  }

  prospectsData: any;

  saveProspectData(): void {
    //if the communication email is sent then the data is saved
    //or check box is selected

    if (this.payload.userId == null) {
      this.payload.userId = -1;
    }

    if (this.payload.communicationEmailSent == 'yes') {
      this.payload.companyName = this.payload.companyName.trim();
      this.commonService
        .post(
          'mainservice/framework2/open/prospect?companyName=' +
            this.payload.companyName,
          this.payload
        )
        .subscribe((data: any) => {
          this.commonService.hideProcessingIcon();
          this.commonService.showSuccessMessage(
            'Prospect Uploaded',
            'thank you for adding value to pieworks, our BD team is going to take this ahead and update you on the status in next 2 weeks.'
          );
          this.closeModal.emit();

          if (data['result'] === 200) {
            this.prospectsData = data['dataObject'];

            this.addClientContact();
            this.payload.prospectName = '';
            this.payload.prospectPhoneNo = '';
            this.payload.prospectEmailId = '';
            this.payload.companyName = '';
            // this.commonService.sendMail("Team","New prospect added",message1,undefined,"anush@pieworks.in,undefined,undefined,link1,undefined,link1Name,undefined);
          }
        });
    }
    //if check box not checked then data will be not saved.
    else {
      this.payload.prospectName = '';
      this.payload.prospectPhoneNo = '';
      this.payload.prospectEmailId = '';
      this.payload.companyName = '';
      this.commonService.showErrorMessage(
        'Mail Not Sent',
        'Please Send the Mail First'
      );
    }
  }
}
