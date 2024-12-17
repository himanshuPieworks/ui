import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { array } from '@amcharts/amcharts5';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-prospect-detail',
  templateUrl: './prospect-detail.component.html',
  styleUrls: ['./prospect-detail.component.scss'],
})
export class ProspectDetailComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  isProspect: any;

  requirement: any = {};
  iAmClientAnchor = false;
  clientUrl: any = '';
  members: any = [];
  message = '';
  clientId: any;
  edit: any = {};
  competitor: any = [];
  competitorTemp: any;
  editCompetitor = false;
  status: any;
  employeeStrength: any = [
    '1-10',
    '11-50',
    '51-100',
    '101-500',
    '501-1000',
    '1001- 5000',
    'Above 5000',
  ];
  fundingStatus: any = [
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D/E/F',
    'Bigger',
    'Smaller',
    'Bootstrapped',
    'Enterprise',
    'GCC',
    'MNC',
    'Government backed',
    'Non Profit Organization'
  ];
  
  clientStatus: any = [
    'To connect',
    'Validated',
    'Build Trust',
    'Present Value Proposition',
    'Contract Shared',
    'Negotiations',
    'Client',
    'Hold',
    'Drop',
  ];

  prospectContactType: any = [
    'Hiring Manager',
    'Corporate Recruiter',
    'HR',
    'Founder/Founding Team',
  ];

  isClient:boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService,
    private httpClient: HttpClient
  ) {

    const currentUrl = this.route.snapshot.url.join('/');
    this.isClient = currentUrl.includes('client');

    console.log(this.isClient)

    this.clientId = this.route.snapshot.paramMap.get('id');
   
    if(this.isClient)
    {
      
      this.breadCrumbItems = [
        { label: 'Home', active: false, link: '/' },
        { label: 'Client', active: true, link: '/recr/client' },
      ]; 

    }
    else
    {
      this.breadCrumbItems = [
        { label: 'Home', active: false, link: '/' },
        { label: 'Prospect', active: true, link: '/recr/prospects' },
      ]; //this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Modals', active: true }];

    }
    this.loadClient();
    this.loadAvailableSectors();
  }

  ngOnInit(): void {
    //console.log(this.loadRemarks())
  }

  //this is for loading the client as per requested id
  contactDetails: any = [];
  prospect: any;
  loadClient(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/client/id/' + this.clientId)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.prospect = data['dataObject'];
          
          this.contactDetails = this.prospect.communityClientContacts;
          console.log(this.contactDetails)
          console.log(this.prospect)
          this.loadFounders();
          this.loadRemarks();
        }
      });
  }

  sendLoginIdPasswordToClient()
  {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/auth/generateClientAccount?clientName=' + this.prospect.name, this.selectedClientContact)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.message = data['message'];

          this.commonService.showSuccessMessage("Id/Password !",this.message);

          this.loadClient();
          
        } else {
          this.message = data['message'];

          this.commonService.showErrorMessage("Error :( ",this.message);
          
        }
      });
  }

  //these variable is used in loading available sector
  availableSectors: any = [];
  newSector: any = '';
  loadAvailableSectors(): void {
    this.availableSectors = [];
    var url =
      'mainservice/recruitment2/open/availableSectors?searchText=' + this.newSector;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200 && data['dataArray'] != null) {
        this.availableSectors = data['dataArray'];
        // console.log(this.availableSectors)
      }
    });
  }

  //it is setting the remarks length
  getWriteUpRows(text: any): any {
    if (!text) return 10;
    //return 5;
    return text.length / 80;
  }

  confirmAndProceed(title: any, message: any, parentObj: any, cb: any): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        if (cb) parentObj[cb]();
      }
    });
  }

  // founder list from db
  founders: any = [];
  loadFounders(): void {
    this.founders = [];
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/founders?clientId=' + this.clientId)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.founders = data['dataArray'];
          // console.log(this.founders);
        }
      });
  }

  removeFounder(founder: any): void {
    Swal.fire({
      title: 'Confirmation required',
      text: 'Are you sure you want to delete founder ' + founder.name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.removeFounderConfirmed(founder);
      }
    });
  }
  removeFounderConfirmed(founder: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/founders/delete/' + founder.id, undefined)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.message = data['message'];
          this.loadFounders();
        } else {
          this.message = data['message'];
          this.loadFounders();
        }
      });
  }

  updateClient(): void {
    if (this.prospect.prospect && this.prospect.prospect.status == 'Client') {
      this.prospect.addedAsClient = 'yes';
    }
    this.commonService
      .post('mainservice/framework/updateClient', this.prospect)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.message = data['message'];
        this.edit = {};
        if (data['result'] === 200) {
          this.commonService.showSuccessMessage(
            'Update',
            'Updated client successfully'
          );
          this.loadClient();
        } else
          this.commonService.showErrorMessage(
            'Update',
            'Couldnt update client. Please try again later.'
          );
      });
  }

  //Referral data is use with remarks
  remarks: any = [];
  remarkTemp: any;
  editRemark: any = false;
  titleTemp: any;
  addRemark(): void {
    if (!this.remarkTemp || this.remarkTemp.length === 0) return;
    if (!this.titleTemp || this.titleTemp.length === 0) return;
    var temp = this.remarkTemp.split(/\r?\n/);
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].trim().length == 0) continue;
      var temp2: any = [];
      if (temp[i].length > 300) {
        temp2 = temp[i].match(/.{1,300}/g);
      } else {
        temp2.push(temp[i]);
      }
      for (var j = 0; j < temp2.length; j++) {
        if (temp2[j].trim().length == 0) continue;
        var remarkObj = {
          remark: this.titleTemp + '@' + temp2[j],
          category: 'client-links',
          categoryId: this.clientId,
          createdBy: this.commonService.user.id,
        };
        this.remarks.push(remarkObj);
        this.saveRemark(remarkObj);
      }
    }
    this.remarkTemp = '';
    this.titleTemp = '';
  }
  removeRemark(obj: any): void {
    for (var i = 0; i < this.remarks.length; i++) {
      if (this.remarks[i] === obj) {
        this.remarks.splice(i, 1);
      }
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/generic/removeRemark', obj)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.loadRemarks();
          this.editRemark = false;
          this.commonService.showSuccessMessage(
            'Remarks Updated',
            'Update successful.'
          );
          return;
        } else {
          this.loadRemarks();
        }
      });
  }
  saveRemark(remarkObj: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/generic/remark', remarkObj)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.loadRemarks();
          this.editRemark = false;
          this.commonService.showSuccessMessage(
            'Remarks Updated',
            'Update successful.'
          );
          return;
        } else {
          this.loadRemarks();
        }
      });
  }
  loadRemarks() {
    this.remarks = [];
    var url =
      'mainservice/framework/generic/remark/' +
      this.clientId +
      '?category=client-links';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.remarks = data['dataArray'];
        // console.log(this.remarks);
      }
    });
  }
  //till here it is used to set referral data

  founderDescription: any;
  founderFileToUpload: any;
  imgPreviewFounder: any;
  founderName: any;
  founderId: any;
  searchText: any;
  imgPreview: any;

  //adding founder data it is used
  addFounderDetails() {
    if (!this.founderName || !this.founderDescription) {
      this.message = 'Please enter the title and description';
      return;
    }
    const formData: FormData = new FormData();
    if (this.founderFileToUpload && this.founderFileToUpload !== null) {
      var fileName = this.founderFileToUpload.name;
      fileName = this.commonService.removeSpecialChar(fileName, '-.', '-');
      formData.append('image', this.founderFileToUpload, fileName);
    }
    //        formData.append('icon', this.client["icon"]);
    if (this.clientId && this.clientId > 0) {
      formData.append('clientId', this.clientId);
    }
    formData.append('description', this.founderDescription);
    formData.append('name', this.founderName);
    if (this.founderId) formData.append('id', this.founderId);
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: localStorage.getItem('accesstoken') + '',
    });
    let options = { headers: headers };
    //this.message = "Saving ...";
    this.commonService.showProcessingIcon();
    this.commonService
      .post2('mainservice/framework/founderInfo', formData, options)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.searchText = '';
        this.imgPreview = undefined;
        this.edit.founder = !this.edit.founder;
        if (data['result'] == 200) {
          this.message = 'Data saved.';
          this.founderFileToUpload = undefined;
          this.imgPreviewFounder = undefined;
          this.founderDescription = undefined;
          this.founderName = undefined;
          this.founderId = undefined;
          //this.resetSelection();
          this.loadFounders();
        } else {
          this.message = data['message'];
        }
      });
  }
  //on selecting profile pic of founder this method is called for upload
  file: any;
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
    this.founderFileToUpload = event.target.files[0];
  }

  //adding and updating all the client data this method is used

  clientContact: any = {};
  editCompanyContactDetails = false;
  addClientContact(): void {
    if (
      !this.clientContact.name ||
      !this.clientContact.contactNo ||
      !this.clientContact.contactType ||
      !this.clientContact.linkedIn 
    ) {
      this.commonService.showErrorMessage(
        'Error',
        'Please enter all the mandatory fields.'
      );
      return;
    }
    this.clientContact.clientId = this.clientId;
    this.commonService.showProcessingIcon();
    var temp = [];
    temp.push(this.clientContact);
    this.commonService
      .post('mainservice/framework/clientContact', temp)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.loadClient();
        } else {
          this.message = data['message'];
        }
        this.clientContact = {};
        this.edit.prospectContact= false;
        this.editCompanyContactDetails = false;
      });
  }

  removeContact(obj:any):void{
    Swal.fire({
      title: 'Confirmation required',
      text: 'Are you sure you want to delete Contact ' + obj.name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.removeContactConfirmed(obj);
      }
    });
  }

  removeContactConfirmed(obj: any): void {
    console.log(obj)
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/removeClientContact', obj)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();

        if (data['result'] === 200) {
          this.loadClient();
        } else {
          this.message = data['message'];
        }
      });
  }
  selectedClientContact:any = [];
  editContact():void{
    this.commonService.showProcessingIcon();
    var temp = [];
    temp.push(this.selectedClientContact);
    this.commonService
      .post('mainservice/framework/clientContact', temp)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.loadClient();
        } else {
          this.message = data['message'];
        }
        this.clientContact = {};
        this.edit.prospectContact= false;
        this.edit.selectedClient = false;
        this.editCompanyContactDetails = false;
      });
  }

  //on clicking on company logo it is called
  clickedOnLogo(): void {
      if (this.isClient && !this.commonService.rbac["edit-client-logo"])
        return;
    if (!this.isClient && !this.commonService.rbac["edit-prospect-logo"])
        return;
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

  //upload company logo

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

    formData.append('id', this.prospect.id);

    let options = { headers: headers };

    this.commonService
      .post2('mainservice/framework/clientLogo', formData, options)
      .subscribe((data: any) => {
        this.loadClient();
        this.commonService.hideProcessingIcon();
        this.commonService.showInfoMessage('data', 'Uploaded');
      });
  }
}
