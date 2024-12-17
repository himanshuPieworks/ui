import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prospects',
  templateUrl: './prospects.component.html',
  styleUrls: ['./prospects.component.scss'],
})
export class ProspectsComponent implements OnInit {
  user: any;
  isProspect: any;
  //community id is for getting data form community data
  communityId: any;

  markAsClient: any = ['yes', 'no'];
  // bread crum items
  breadCrumbItems!: Array<{}>;
  mandates: any = [];
  label: any;
  prospects: any = [];
  tempReferal: any = {};
  //when we have to show the data in client we will convert this variable in search query
  //data for client can be viewed in client module
  showProspectsOnly: any = 'yes';
  clickedOnReferalRemoval(): void {
    if (
      this.selectedProspectForMakingClient &&
      this.selectedProspectForMakingClient.referedBy
    ) {
      this.tempReferal = this.selectedProspectForMakingClient.referedBy;
      this.selectedProspectForMakingClient.referedBy = undefined;
    } else {
      this.selectedProspectForMakingClient.referedBy = this.tempReferal;
      this.tempReferal = {};
    }
  }
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
  isClient: boolean;

  @ViewChild('addModal') addModal: any;
  @ViewChild('addClient') addClient: any;
  @ViewChild('addStatus') addStatus: any;
  @ViewChild('filterWindow') filterWindow: any;

  action: any = '';
  constructor(
    public commonService: PieworksCommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.action = this.commonService.getParameterFromUrl('action');
    const currentUrl = this.route.snapshot.url.join('/');
    this.isClient = currentUrl.includes('client');

    if (this.isClient) {
      this.showProspectsOnly = 'no';

      this.breadCrumbItems = [
        { label: 'Home', active: false, link: '/' },
        { label: 'Client', active: true, link: '/recr/client' },
      ];
    } else {
      this.breadCrumbItems = [
        { label: 'Home', active: false, link: '/' },
        { label: 'Prospect', active: true, link: '/recr/prospects' },
      ]; //this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Modals', active: true }];
    }

    document.getElementById('elmLoader')?.classList.add('d-none');

    this.user = this.commonService.user;
    this.communityId = localStorage.getItem('communityId') + '';
    setTimeout(() => {
      this.loadClients(true);
      this.loadProspectsForMakingClient();
    }, 2000);

    window.onscroll = (ev) => {
      this.scrollListener(ev);
    };
    if (this.action == 'add') {
      setTimeout(() => {
        this.addModal.show();
      }, 500);
    }
  }

  ngOnInit(): void {
    if (this.isClient) {
      this.label = 'Client';
    } else {
      this.label = 'Prospect';
    }
    setTimeout(() => {
      if (this.commonService.rbac['update-prospect-status']) {
        this.menuOptions.push('Update Status');
      }
    }, 2000);
  }

  // copy link is working for the user outside the community who wants to
  //upload prospects.
  copyLink(): void {
    var url = this.commonService.uiPrefix + 'recr/open/prospects';
    this.commonService.copyMessage(url);
    this.commonService.showInfoMessage('Info', 'Link copied to clipboard');
  }

  //handleMenu for popups

  nothing(): void {}
  menuOptions: any = [];
  selectedReq: any;
  menuAction: any = '';

  handleMenu(option: any): void {
    this.menuAction = option;
    switch (option) {
      case 'Create Prospect':
        //this.createMandate.rspp = this.selectedReq;
        this.addModal.show();
        break;
      case 'Create Client':
        this.addClient.show();
        break;
      case 'Update Status':
        this.addStatus.show();
        break;
    }
  }

  //next data on scrolling

  paginationMessage = '';
  pageNum = 1;
  pageSize = 12;
  status: any;
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
    this.loadClients(false);
  }

  //few variables for scrollListener ...
  block = false;
  creationMonth = '';
  scrollPosition = 0;
  scrollY = 0;
  membersArray: any = [];
  clientAnchors: any = [];

  //taking the mouse location and loading data on it
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
        this.next();
      }
    }
    this.scrollY = window.scrollY;
  }

  //for destroying the mouse event scrollListener
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
    window.onscroll = (ev) => {};
  }

  clientHandle: any;

  //loading prospects data / client data
  loadClients(filterChanged: any): void {
    var statusStrings = 'Prospect,' + this.clientStatus.toString();
    statusStrings = statusStrings.replace(',Hold', '').replace(',Drop', '');
    if (this.clientHandle) this.clientHandle.unsubscribe();
    this.commonService.showProcessingIcon();
    let url =
      'mainservice/framework/open/client?communityId=' +
      this.communityId +
      '&showInActiveClientsAlso=true&pageNum=' +
      this.pageNum +
      '&pageSize=15&creationMonth=&prospectsOnly=' +
      this.showProspectsOnly +
      '&validated=all&userId=' +
      this.commonService.user.id;
    if (!this.searchText) this.searchText = '';
    url = url + '&searchText=' + this.searchText;
    if (this.status) url = url + '&status=' + this.status;
    else url = url + '&status=' + statusStrings;
    this.clientHandle = this.commonService.get(url).subscribe((data: any) => {
      if (filterChanged) this.prospects = [];
      this.commonService.hideProcessingIcon();
      // this.prospects;
      if (data['result'] === 200) {
        var newBatch = data['dataArray'];
        this.prospects = this.prospects.concat(newBatch);
      }
      if (this.prospects.length === 0 && this.pageNum > 1) {
        this.pageNum = this.pageNum - 1;
      }
      // console.log(this.prospects)
    });
  }
  prospectsForMakingClient: any = [];
  selectedProspectForMakingClient: any;
  loadProspectsForMakingClient(): void {
    //if (this.clientHandle) this.clientHandle.unsubscribe();
    var statusStrings = 'Prospect,' + this.clientStatus.toString();
    statusStrings = statusStrings.replace(',Hold', '').replace(',Drop', '');
    this.commonService.showProcessingIcon();
    let url =
      'mainservice/framework/open/client?searchText=&communityId=' +
      this.communityId +
      '&showInActiveClientsAlso=true&pageNum=1&pageSize=1000&creationMonth=&prospectsOnly=yes&validated=yes&status=' +
      statusStrings;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      // this.prospects;
      if (data['result'] === 200) {
        this.prospectsForMakingClient = data['dataArray'];
      }
    });
  }

  //whenever we implements the filter we have to empty the prospects
  //put page number = 1;

  loadClientWithFilter() {}

  //few variables which is needed for filter
  clients: any = [];
  statusArray = [
    'Prospect',
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
  users: any = [];
  onlyWithFeeds = false;
  searchText: any;
  client: any;
  havingPendingPositions: any;
  havingClosedPositions: any;
  edit: any = {};

  //clear filter button
  clearFilters(): void {
    this.status = undefined;
    this.clientAnchors = [];
    this.searchText = '';
    this.client = '';
    this.pageNum = 1;
    this.havingPendingPositions = 'na';
    this.havingClosedPositions = 'na';
    this.loadClients(true);
    this.creationMonth = '';
  }

  filterChanged(): void {
    //prospects data is rest
    this.prospects = [];
    setTimeout(() => {
      //page number change to 1 only
      this.pageNum = 1;
      if (this.prospects.length == 0) {
        this.loadClients(true);
      } else {
        this.loadClients(true);
      }
    }, 1000);
  }

  doubleClickCounter = 0;

  clickedOnMandate(req: any): void {
    this.doubleClickCounter++;
    if (this.doubleClickCounter >= 2) this.doubleClicked(req);
    setTimeout(() => {
      this.doubleClickCounter = 0;
    }, 300);
  }

  doubleClicked(req: any): void {
    if (this.isClient) this.router.navigate(['recr/client/' + req.id]);
    else this.router.navigate(['recr/prospect/' + req.id]);
  }

  message: any;
  selectedProspect: any;

  updateClient(): void {
    if (this.selectedProspect.prospect.status == 'Client')
      this.selectedProspect.addedAsClient = 'yes';

    // console.log(this.selectedProspect);
   
    this.commonService
      .post('mainservice/framework/updateClient', this.selectedProspect)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.message = data['message'];
        this.edit = {};
        if (data['result'] === 200) {
          this.commonService.showSuccessMessage(
            'Update',
            'Updated client successfully'
          );
          this.addStatus.hide();
          this.filterChanged();
          if (this.selectedProspect.prospect.userName) {
            if (this.selectedProspect.prospect.status == 'Client') {
              this.commonService.sendNotification(
                this.selectedProspect.prospect.userId,
                'Congrats!! Your prospect ' +
                  this.selectedProspect.name +
                  ' has been converted to client.',
                '/recr/client/' + this.selectedProspect.id,
                'COMMUNITY MEMBER',
                1,
                0
              );
              this.commonService.sendMail(
                this.selectedProspect.prospect.userName,
                'Regarding conversion of your prospect to client',
                'Congrats!! Your prospect ' +
                  this.selectedProspect.client.name +
                  ' has been converted to client.',
                undefined,
                this.selectedProspect.prospect.userEmailId,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                'community@pieworks.life'
              );
            }
          }
        } else
          this.commonService.showErrorMessage(
            'Update',
            'Couldnt update client. Please try again later.'
          );
      });
  }

  addAsClient(): void {
    this.selectedProspectForMakingClient.prospect.status = 'Client';
    this.selectedProspectForMakingClient.addedAsClient = 'yes';

    this.commonService
      .post(
        'mainservice/framework/updateClient',
        this.selectedProspectForMakingClient
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.message = data['message'];
        this.edit = {};
        if (data['result'] === 200) {
          this.commonService.showSuccessMessage(
            'Update',
            'Updated client successfully'
          );
          this.addClient.hide();
          this.filterChanged();
        } else
          this.commonService.showErrorMessage(
            'Update',
            'Couldnt update client. Please try again later.'
          );
      });
  }
}
