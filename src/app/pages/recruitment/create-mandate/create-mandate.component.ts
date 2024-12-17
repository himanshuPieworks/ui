import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-create-mandate',
  templateUrl: './create-mandate.component.html',
  styleUrls: ['./create-mandate.component.scss'],
})
export class CreateMandateComponent {
  user: any;
  breadCrumbItems: any = [];
  submitted = false;
  currentStep = 'Basic details';
  completedStep1: boolean = false;
  completedStep2 = false;
  completedStep3 = false;
  completedStep4 = false;
  @Input('parentObj') parentObj: any;
  @Input('rspp') rspp: any = {};
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', active: false, link: '/' },
      { label: 'Workspace', active: true, link: '/recr/wp' },
    ]; //this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Modals', active: true }];
    this.user = JSON.parse(localStorage.getItem('user') + '');
    this.loadClients();
    this.loadStatus();
    this.loadCommunityMembers();
    this.loadRspps();
  }
  constructor(
    public commonService: PieworksCommonService,
    private router: Router
  ) {}
  clientHandle: any;
  clients: any = [];
  client: any;
  rspps: any = [];
  clientSearchText: any = '';
  loadClients(): void {
    if (this.clientHandle) this.clientHandle.unsubscribe();
    this.commonService.showProcessingIcon();
    this.clientHandle = this.commonService
      .get(
        'mainservice/framework/client?searchText=' +
          this.clientSearchText +
          '&communityId=' +
          localStorage.getItem('communityId')
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.clients = [];
        if (data['result'] === 200) {
          this.clients = data['dataArray'];
        }
      });
  }
  addresses: any = [];
  addressTemp: any;
  addAddress(): void {
    if (!this.addressTemp || this.addressTemp.length === 0) return;
    var temp = this.addressTemp.split(/\r?\n/);
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
          remark: temp2[j],
          category: 'mandate-office-address',
          categoryId: this.rspp.id,
          createdBy: this.commonService.user.id,
        };
        this.addresses.push(remarkObj);
      }
    }
    this.addressTemp = '';
  }
  saveOfficeAddress(): void {
    this.commonService.showProcessingIcon();
    for (let i = 0; i < this.addresses.length; i++) {
      this.addresses[i].categoryId = this.rspp.id;
      this.commonService
        .post('mainservice/framework/generic/remark', this.addresses[i])
        .subscribe((data: any) => {
          this.commonService.hideProcessingIcon();
          if (data['result'] === 200) {
          } else {
          }
        });
    }
  }
  onClientSearch(item: any) {
    this.clientSearchText = item.term;
    this.loadClients();
  }

  // when client is already loaded locally then this method made it local search
  clientLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }
  rsppLocalSearch(term: string, item: any) {
    return (
      item.role.name.toString().toUpperCase().indexOf(term.toUpperCase()) >
        -1 ||
      (item.orgName &&
        item.orgName.toString().toUpperCase().indexOf(term.toUpperCase()) > -1)
    );
  }
  rsppSearchText = '';
  rsppHandle: any;
  loadRspps(): void {
    if (this.rsppHandle) this.rsppHandle.unsubscribe();
    if (!this.rsppSearchText || this.rsppSearchText.length < 1) {
      if (this.client && this.client.name)
        this.rsppSearchText = this.client.name;
    }
    var url =
      'mainservice/recruitment/requirements/2?clientAnchorIds=-1&pageNum=1&pageSize=12&statusId=2,3,7&creationMonth=&searchText=' +
      this.rsppSearchText +
      '&onlyWithFeeds=false&client=&minLpa=1&maxLpa=200&havingPendingPositions=na&havingClosedPositions=na&includeOfferedCandidates=true&isRspp=yes';
    this.commonService.showProcessingIcon();
    this.rsppHandle = this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      this.rspps = [];
      if (data['result'] === 200) {
        this.rspps = data['dataArray'];
        if (this.rspps.length == 0 && this.rsppSearchText.length > 1) {
          this.rsppSearchText = ' ';
          this.loadRspps();
        } else {
          this.rsppSearchText = '';
        }
      }
    });
  }
  filterRspp(event: any): void {
    this.rsppSearchText = event.term; //element.value;
    this.loadRspps();
  }
  loadStatus(): void {
    this.statusArray = [
      { id: 2, name: 'Warm' },
      { id: 3, name: 'Hot' },
    ];
    this.status = this.statusArray[1];
  }
  statusArray: any = [];
  status: any;
  retainerFee: any;
  percentageBilling: any;
  noOfVaccancy = 1;
  createMandate(): void {
    if (!this.client || !this.status || !this.rspp) {
      this.commonService.showErrorMessage(
        'Error',
        'Please enter all the required details.'
      );
      return;
    }
    if (
      (this.addresses.length == 0)||this.rspp.hiringManager == undefined || this.rspp.hiringManager.name == 'NA'
    ) {
      this.commonService.showErrorMessage(
        'Error',
        'Please enter all the required details.'
      );
      return;
    }
    this.rspp.client = this.client;
    this.rspp.status = this.status;
    this.rspp.isRspp = 'no';
    this.rspp.retainerFee = this.retainerFee;
    this.rspp.percentageBilling = this.percentageBilling;
    if (this.clientAnchor) {
      this.rspp.clientAnchorId = this.clientAnchor.id;
      this.rspp.clientAnchor = this.clientAnchor;
    }
    if (this.standbyClientAnchor) {
      this.rspp.standbyClientAnchorId = this.standbyClientAnchor.id;
      this.rspp.standbyClientAnchor = this.standbyClientAnchor;
    }
    this.rspp.noOfVaccancy = this.noOfVaccancy;
    this.rspp.noOfVaccancyPending = this.noOfVaccancy;
    this.rspp.activeFrom = this.commonService.getFormatedDate(
      new Date(),
      'yyyy-MM-dd'
    );
    this.commonService
      .post('mainservice/recruitment/requirement', this.rspp)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();

        if (data['result'] === 200) {
          this.rspp = data['dataObject'];
          this.commonService.showSuccessMessage(
            'Update',
            'Created mandate successfully.'
          );

          this.saveOfficeAddress();
          this.parentObj.addModal.hide();
          this.parentObj.clearFilters();
          try {
            var msg =
              'New Role  ' +
              this.rspp.role.name +
              ', ' +
              this.rspp.client.name +
              ' posted .';
            this.commonService.sendNotification(
              this.otherMembersId,
              msg,
              '/recr/wp/' + this.rspp.id,
              'COMMUNITY MEMBER',
              1,
              0
            );
            // if this we have to make an api that gets the mandate year and sector and then fetch the talent on that .
            if (
              this.commonService.getDaysBetween(
                this.commonService.getJsDateObject(this.rspp.client.createdOn),
                new Date()
              ) < 11
            ) {
              this.commonService.sendMail(
                this.rspp.client.prospect.userName,
                'Mandate addition alert !!',
                'A new mandate has been added to your referral client ' +
                  this.rspp.client.name +
                  '.',
                undefined,
                this.rspp.client.prospect.userEmailId,
                undefined,
                undefined,
                this.commonService.uiPrefix+'recr/open/rspp-view/' + this.rspp.id + '?showBudget=true',
                undefined,
                'Details',
                undefined,
                'community@pieworks.life'
              );
            }
          } catch (e: any) {
            console.log(e);
          }
          this.rspp = {};
        } else
          this.commonService.showErrorMessage(
            'Update',
            'Couldnt save mandate. Please try again later.'
          );
      });
  }
  otherMembersId: any = '';
  members: any = [];
  loadCommunityMembers(): void {
    this.commonService.showProcessingIcon();
    var acceptanceByAceValues = '1';
    var acceptanceByAceMakerValues = '1';
    this.commonService
      .get(
        'mainservice/framework/members/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=' +
          acceptanceByAceValues +
          '&acceptanceByAceMakerValues=' +
          acceptanceByAceMakerValues +
          '&userId=-1'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.members = data['dataArray'];
          if (!this.members || this.members.length == 0) {
            this.members = [];
            this.checkIfIamAceMaker();
            return;
          }
          this.checkIfIamAceMaker();
          for (var i = 0; i < this.members.length; i++) {
            if (this.members[i].user.id != this.commonService.user.id) {
              if (
                this.members[i].acceptanceByAce === 1 ||
                this.members[i].acceptanceByAceMaker === 1
              ) {
                if (this.otherMembersId == '')
                  this.otherMembersId =
                    this.otherMembersId + this.members[i].user.id;
                else
                  this.otherMembersId =
                    this.otherMembersId + ',' + this.members[i].user.id;
              }
            }
          }
        }
      });
  }
  amIAceMaker = false;
  clientAnchor: any;
  standbyClientAnchor: any;
  iamConfirmedMember = false;
  checkIfIamAceMaker(): void {
    if (this.commonService.user.id == '7') {
      //noor,rajeen
      this.amIAceMaker = true;
      return;
    }
    this.amIAceMaker = false;
    for (var i = 0; i < this.members.length; i++) {
      if (
        this.members[i].id.userId == this.commonService.user.id &&
        this.members[i].acceptanceByAceMaker == 1
      )
        this.iamConfirmedMember = true;
      if (
        this.members[i].isAceMaker &&
        this.members[i].id.userId == this.commonService.user.id
      ) {
        this.amIAceMaker = true;
        //break;
      }
      if (this.rspp) {
        if (this.members[i].user.id == this.rspp.clientAnchorId)
          this.rspp.clientAnchor = this.members[i].user; //this is required as the obj reference also must be same for the data to get binded at UI
        if (this.members[i].user.id == this.rspp.standbyClientAnchorId)
          this.rspp.standbyClientAnchor = this.members[i].user;
      }
    }
  }

  onRsppClientSelect(): void {
    this.loadRspps();
    setTimeout(() => {
      if (!this.rspp || !this.client) return;
      this.rspp.companyWriteup1 = '';
      this.rspp.companyWriteup2 = '';
      this.rspp.companyWriteup3 = '';
      var url =
        'mainservice/recruitment/requirements/2?clientAnchorIds=-1&pageNum=1&pageSize=1&statusId=1,2,3,4,5,6,7,8,9,10&creationMonth=&searchText=' +
        this.client.name +
        '&onlyWithFeeds=false&client=&minLpa=1&maxLpa=200&havingPendingPositions=na&havingClosedPositions=na&includeOfferedCandidates=true&isRspp=yes';
      this.commonService.showProcessingIcon();
      this.rsppHandle = this.commonService.get(url).subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          let oldMandate = data['dataArray'];
          if (
            oldMandate &&
            oldMandate.length > 0 &&
            oldMandate[0].companyWriteup1.length > 0
          ) {
            this.rspp.companyWriteup1 = oldMandate[0].companyWriteup1;
            this.rspp.companyWriteup2 = oldMandate[0].companyWriteup2;
            this.rspp.companyWriteup3 = oldMandate[0].companyWriteup3;
          }
          if (data['dataArray'].length == 0) {
            url =
              'mainservice/recruitment/requirements/2?clientAnchorIds=-1&pageNum=1&pageSize=1&statusId=1,2,3,4,5,6,7,8,9,10&creationMonth=&searchText=' +
              this.client.name +
              '&onlyWithFeeds=false&client=&minLpa=1&maxLpa=200&havingPendingPositions=na&havingClosedPositions=na&includeOfferedCandidates=true&isRspp=no';
            this.commonService.showProcessingIcon();
            this.rsppHandle = this.commonService
              .get(url)
              .subscribe((data: any) => {
                this.commonService.hideProcessingIcon();
                if (data['result'] === 200) {
                  let oldMandate = data['dataArray'];
                  if (
                    oldMandate &&
                    oldMandate.length > 0 &&
                    oldMandate[0].companyWriteup1.length > 0
                  ) {
                    this.rspp.companyWriteup1 = oldMandate[0].companyWriteup1;
                    this.rspp.companyWriteup2 = oldMandate[0].companyWriteup2;
                    this.rspp.companyWriteup3 = oldMandate[0].companyWriteup3;
                  }
                }
              });
          }
        }
      });
    }, 200);
  }
}
