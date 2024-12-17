import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-verification',
  templateUrl: './client-verification.component.html',
  styleUrls: ['./client-verification.component.scss'],
})
export class ClientVerificationComponent {
  breadCrumbItems!: Array<{}>;
  @ViewChild('approveClient') approveClient: any;
  @ViewChild('selectClient') selectClient: any;

  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    this.breadCrumbItems = [
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Client Verification', active: true },
    ];

    setTimeout(() => {
      this.next();
    }, 1000);

    window.onscroll = (ev) => {
      this.scrollListener(ev);
    };
    // this.approval = '0';
    // this.getListOfClients();
  }

  prospectContactType: any = [
    'select',
    'Hiring Manager',
    'Corporate Recruiter',
    'HR',
    'Founder/Founding Team',
  ];
  contact: any = {};
  selectedClient: any = {};
  // show Modal to approve client
  approveClientIdentity() {
    if (this.selectedClient.client == null) {
      this.loadClients();
      this.selectClient.show();

      this.contact.emailId = this.selectedClient.user.username;
      this.contact.name = this.selectedClient.user.name;
      this.contact.contactType = this.selectedClient.user.designation;
      this.contact.contactNo = this.selectedClient.user.mobileno;
      this.contact.address = '';
    } else {
      let clientContact = this.selectedClient.client.communityClientContacts;
      let clientUser = this.selectedClient.user;
      let selectedClientId = this.selectedClient.client.id;
      this.contact.clientId = selectedClientId;

      for (let i = 0; i < clientContact.length; i++) {
        if (clientContact[i].emailId == clientUser.username) {
          this.contact.emailId = clientContact[i].emailId;
          this.contact.name = clientContact[i].name;
          this.contact.contactType = clientContact[i].contactType;
          this.contact.contactNo = clientContact[i].contactNo;
          this.contact.address = clientContact[i].address;
        }
      }
      this.approveClient.show();
    }
  }

  onAddingClient() {
    Swal.fire({
      title: 'Completed the task',
      text:
        'Are you sure you add this client ' +
        this.selectedClient.client.name +
        ' to ' +
        this.selectedClient.user.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        // function that call completed task
        this.approveClientIdentity();
      } else {
        this.selectedClient.client = null;
      }
    });
  }

  clientContact: any = {};
  saveClientContact(): void {
    this.commonService.showProcessingIcon();
    var temp: any = [];
    temp.push(this.contact);
    // alert(temp)
    this.commonService
      .post('mainservice/framework/clientContact', temp)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.saveClientAccountDetail(1);
        } else {
          this.selectedClient = {};
        }
      });
  }

  saveClientAccountDetail(status: any) {
    let url = 'mainservice/recruitment/client/saveClientAccountDetail';
    this.selectedClient.approved = status;
    this.commonService.post(url, this.selectedClient).subscribe((data: any) => {
      if (data['result'] == 200) {
        this.commonService.showSuccessMessage(
          'Saved',
          'Status Changed Successfully :)'
        );

        this.selectedClient = {};
        this.approveClient.hide();
        this.tabSelected();
      }
    });
  }

  rejectClientAccountDetail() {
    Swal.fire({
      title: 'Completed the task',
      text:
        'Are you sure you Reject this User ' + this.selectedClient.user.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        // function that call completed task
        this.saveClientAccountDetail(2);
      } else {
        this.selectedClient.client = null;
      }
    });
  }
  clientSearch: any = '';
  clientsList: any = [];
  clientHandle: any = [];
  loadClients(): void {
    this.commonService.showProcessingIcon();

    this.commonService
      .get(
        'mainservice/framework/client?searchText=' +
          this.clientSearch +
          '&communityId=-1'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.clientsList = [];
        if (data['result'] === 200) {
          this.clientsList = data['dataArray'];
        }
      });
  }

  // it returns the client on search text
  clientLocalSearch(term: string, item: any) {
    return item.name.toUpperCase().startsWith(term.toUpperCase());
  }

  // on client search
  onClientSearch(item: any) {
    this.clientSearch = item.term;
    this.loadClients();
  }

  // Pn selecting particular tab
  tabSelected() {
    this.pageNum = 0;
    this.paginationMessage = '';
    this.clients = [];
    this.next();
  }

  filterChanged() {
    this.getListOfClients();
  }
  approval: any = 0;
  clients: any = [];
  getListOfClients() {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/client/clientAccountDetail?pageNum=' +
      this.pageNum +
      ',pageSize=' +
      this.pageSize +
      ',searchText=' +
      this.searchText +
      ',approved=' +
      this.approval;
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] == 200) {
        this.paginationMessage = data['message'];

        var newBatch = data['dataArray'];

        this.clients = this.clients.concat(newBatch);
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
    window.onscroll = (ev) => {};
  }
  scrollListener(event: any): void {
    if (this.block) return;
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 1000
    ) {
      // you're at the bottom of the page
      if (this.scrollPosition != window.innerHeight + window.scrollY) {
        this.block = true;
        this.scrollPosition = window.innerHeight + window.scrollY;
        if (this.clients.length != 0) this.next();
      }
    }
    this.scrollY = window.scrollY;
  }
  pageNum: any = 0;
  pageSize: any = 10;
  paginationMessage = '';

  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      // console.log(parseInt(temp[1]));

      if (parseInt(temp[1]) <= this.pageNum) return;
    }

    this.pageNum = this.pageNum + 1;
    this.getListOfClients();
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
    this.getListOfClients();
  }
  first(): void {
    this.pageNum = 1;
    this.getListOfClients();
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
    this.getListOfClients();
  }
  scrollY: any = 0;
  block: any = false;
  scrollPosition: any = 0;

  searchText = '';
  talents: any = [];

  members: any;
  totalNumberOfTalent: any;
}
