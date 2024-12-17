import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { Options } from '@angular-slider/ngx-slider';
import { Location, TitleCasePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { template } from 'lodash';
@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent {
  user: any;
  breadCrumbItems = [
    { label: 'Home', active: false, link: '/' },
    { label: 'Manage', link: '/recr/manage', active: false },
    { label: 'Community', active: false },
  ]; //this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Modals', active: true }];

  @ViewChild('setWeeklyTargetModal') setWeeklyTargetModal: any;
  @ViewChild('setGradeModal') setGradeModal: any;
  @ViewChild('buddyModal') buddyModal: any;
  @ViewChild('acceptModal') acceptModal: any;
  @ViewChild('buddiesViewModal') buddiesViewModal: any;
  @ViewChild('peerViewModel') peerViewModel: any;
  @ViewChild('peerForm') peerForm: any;
  @ViewChild('kycModal') kycModal: any;

  flipClass = 'flip-container-disabled';
  loggedRole: any;
  urlPrefix = '';
  communityId: any;
  hideDescEdit = true;
  message = 'Hai this is test message';
  searchText: any;
  activateNpsForm = false;
  showInfo = false;
  showNpsInfo = false;
  showMembersWithPhone = false;
  showMembersWithLinkedIn = false;
  showMembersWithKyc = false;
  showObCallCompleted = 'all';
  constructor(
    private _location: Location,
    private router: Router,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService,
    private clipboard: Clipboard
  ) {
    this.communityId = localStorage.getItem('communityId') + '';
    this.urlPrefix = this.commonService.urlPrefix;
    this.loadClub();
    this.loadRoles();
    setTimeout(() => {
      this.next();
    }, 1000);
    this.loggedRole = localStorage.getItem('role');
    window.onscroll = (ev) => {
      this.scrollListener(ev);
    };
    this.loadJobFamily();
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
        if (this.members.length != 0) this.next();
      }
    }
    this.scrollY = window.scrollY;
  }
  pageNum: any = 0;
  pageSize: any = 12;
  paginationMessage = '';
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
    this.loadCommunityMembers(false);
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
    this.loadCommunityMembers(false);
  }
  first(): void {
    this.pageNum = 1;
    this.loadCommunityMembers(false);
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
    this.loadCommunityMembers(false);
  }
  scrollY: any = 0;
  block: any = false;
  scrollPosition: any = 0;
  ngOnInit(): void {
    this.addFeedbackMenuItemIfReqd();
    this.populateMonthYearSelector();
    if (this.commonService['selectedTab'] != undefined) {
      this.selectedTab = this.commonService['selectedTab'].split('#')[0];
      this.selectedTabLabel = this.commonService['selectedTab'].split('#')[1];
      //setTimeout(()=>{this.mattabgroup.selectedIndex = this.selectedTab;},500);
    } else {
      // setTimeout(()=>{this.mattabgroup.selectedIndex = 0;},500);
    }
  }
  setSelection(): void {
    localStorage.setItem('communityId', this.communityId);
    localStorage.setItem('communityName', this.community.name);
  }
  members: any;
  //membersTemp: any;
  community: any = {};
  //originalMembersList: any;
  selectedTab: any = 0;
  //membersToShow: any = [];
  selectedTabLabel: any = '';

  statusUpdated(): void {
    //document.body.scrollTop = 500;
    //document.documentElement.scrollTop = 500;

    setTimeout(() => {
      //this.loadMembersToShow();
      this.commonService.goTop();
    }, 300);
  }
  showEnablers = false;
  /* 
  loadMembersToShow1(): void {
    this.membersToShow = this.members;
    this.enablePeerNps();
    this.emailIds = '';
    for (var i = 0; i < this.membersToShow.length; ) {
      if (this.emailIds.length == 0)
        this.emailIds = this.membersToShow[i].user.username;
      else
        this.emailIds =
          this.emailIds + ',' + this.membersToShow[i].user.username;
      if (this.showEnablers && this.members[i].roleInCommunity == 1) {
        this.membersToShow.splice(i, 1);
      } else i++;
    }
  }
  */
  monthYearOptions: string[] = [];

  populateMonthYearSelector() {
    let startYear = new Date().getFullYear();
    let startMonth = new Date().getMonth() + 1; // January

    for (let year = startYear; year >= startYear - 10; year--) {
      for (let month = startMonth; month > 0; month--) {
        const monthString = month < 10 ? '0' + month : month.toString();
        const yearMonth = `${year}-${monthString}`;
        this.monthYearOptions.push(yearMonth);
      }
      startMonth = 12; // Reset start month for the next year
    }
  }

  enablePeerNps(): void {
    if (this.activateNpsForm) {
      var tempUserIds = '';
      for (var i = 0; i < this.members.length; i++) {
        if (tempUserIds.length == 0) tempUserIds = this.members[i].user.id;
        else tempUserIds = tempUserIds + ',' + this.members[i].user.id;
      }
      this.quarter = Math.ceil((new Date().getMonth() + 1) / 3);
      this.year = new Date().getFullYear();
      this.quarter = this.quarter - 1;
      if (this.quarter < 0) {
        this.year = this.year - 1;
        this.quarter = 4;
      }
      var surveySet = 'nps-peer-form-q' + this.quarter + '-' + this.year;
      this.commonService
        .get(
          'mainservice/framework/peernpsstatus?communityId=' +
            this.communityId +
            '&userIds=' +
            tempUserIds +
            '&arg1=' +
            this.myprofile.id +
            '&surveySet=' +
            surveySet
        )
        .subscribe((data: any) => {
          var temp = data['message'].split(',');
          for (var i = 0; i < temp.length; i++) {
            if (this.members[i]) this.members[i].filledNps = temp[i];
          }
        });
    }
  }
  year: any;
  quarter: any;
  acceptanceByAceValues: any = '1';
  acceptanceByAceMakerValues: any = '1';
  membersEligibleForPeerRating: any = 0;
  loadMyMembership(): void {
    if (this.member) return;
    if (!this.searchText) this.searchText = '';
    this.commonService
      .get(
        'mainservice/framework/members/' +
          this.communityId +
          '?acceptanceByAceValues=0,1,2,3,4,5,6,7,8,9,10&acceptanceByAceMakerValues=0,1,2,3,4,5,6,7,8,9,10&userId=' +
          this.commonService.user.id +
          '&roleInCommunity=0,1'
      )
      .subscribe((data: any) => {
        var temp = data['dataArray'];
        this.member = temp[0];

        if (
          this.member.acceptanceByAce == 1 &&
          this.member.acceptanceByAceMaker == 1
        ) {
          this.iAmConfirmedMember = true;
        }
        if (this.member.isAceMaker) {
          this.amIAceMaker = true;
        }
        //this.loadMyProfile();
      });
  }

  clubs: any;
  loadClub(): void {
    this.commonService.showProcessingIcon();
    let url = 'mainservice/framework/clubs/show';

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.clubs = data['dataObject'];
        // this for loop is for club icon in new array
        for (var i = 0; i < this.members?.length; i++) {
          this.members[i].selectedClubArray = [];
          if (this.members[i].clubs && this.members[i].clubs.length > 0) {
            let temp = this.members[i].clubs.split(',');
            for (var j = 0; j < temp.length; j++) {
              for (var k = 0; k < this.clubs.length; k++) {
                if (temp[j] == this.clubs[k].name) {
                  this.members[i].selectedClubArray.push(this.clubs[k]); //this array is only for displaying. not for saving.
                }
              }
            }
          }
        }
      }
    });
  }

  roles: any;
  loadRoles(): void {
    this.commonService.showProcessingIcon();
    let url = 'mainservice/framework/roles/show';
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.roles = data['dataObject'];
        // // this for role new array icon
        for (var i = 0; i < this.members?.length; i++) {
          this.members[i].selectedRoleArray = [];
          if (this.members[i].roles && this.members[i].roles.length > 0) {
            let temp = this.members[i].roles.split(',');
            for (var j = 0; j < temp.length; j++) {
              for (var k = 0; k < this.roles.length; k++) {
                if (temp[j].toUpperCase() == this.roles[k].name.toUpperCase()) {
                  if (temp[j] !== this.roles[k].name) {
                    this.roles[k].colorValue = '';
                  }
                  this.members[i].selectedRoleArray.push(this.roles[k]); //this array is only for displaying. not for saving.
                }
              }
            }
          }
        }
      }
    });
  }

  reqHandle2: any;
  totalEntries = 0;
  jobFamily = '';
  obCallOptions: any = [
    { name: 'All', value: 'all' },
    { name: 'Completed', value: 'true' },
    { name: 'Not Completed', value: false },
  ];
  loadCommunityMembers(filterChanged: boolean): void {
    if (this.reqHandle2) {
      this.reqHandle2.unsubscribe();
    }
    if (this.acceptanceByAceMakerValues == '0,6,7,8,9,10') {
      this.showMembersWithPhone = true;
      this.showMembersWithLinkedIn = true;
    } else {
      this.showMembersWithPhone = false;
      this.showMembersWithLinkedIn = false;
    }

    this.commonService.showProcessingIcon();
    var roleInCommunity = '1';
    if (this.showEnablers) roleInCommunity = '0';
    if (!this.searchText) this.searchText = '';
    this.reqHandle2 = this.commonService
      .get(
        'mainservice/framework/members2/' +
          this.communityId +
          '?acceptanceByAceValues=' +
          this.acceptanceByAceValues +
          '&acceptanceByAceMakerValues=' +
          this.acceptanceByAceMakerValues +
          '&userId=-1&roleInCommunity=' +
          roleInCommunity +
          '&pageNum=' +
          this.pageNum +
          '&pageSize=' +
          this.pageSize +
          '&searchText=' +
          this.searchText +
          '&showMembersWithKyc=' +
          this.showMembersWithKyc +
          '&obCall=' +
          this.showObCallCompleted +
          '&showMembersWithPhone=' +
          this.showMembersWithPhone +
          '&showMembersWithLinkedIn=' +
          this.showMembersWithLinkedIn +
          '&createdOnLike=' +
          this.creationMonth +
          '&approvedOnMonth=' +
          this.approvedOnMonth +
          '&jobFamily=' +
          this.jobFamily +
          '&lonelyMembers=' +
          this.lonelyMembers
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.totalEntries = data['dataObject'];
          this.block = false;
          this.paginationMessage = data['message'];
          var newBatch = data['dataArray'];
          //this.originalMembersList = data['dataArray'];
          //this.membersTemp = data['dataArray'];
          if (!newBatch || newBatch.length == 0) {
            this.members = [];
            return;
          }
          this.community = newBatch[0].community;
          if (newBatch.length === 0 && this.pageNum > 1) {
            this.pageNum = this.pageNum - 1;
            if (this.pageNum < 1) this.pageNum = 1;
          }

          this.emailIds = '';

          // this for loop is for club icon in new array
          for (var i = 0; i < newBatch.length; i++) {
            newBatch[i].selectedClubArray = [];
            if (newBatch[i].clubs && newBatch[i].clubs.length > 0) {
              let temp = newBatch[i].clubs.split(',');
              for (var j = 0; j < temp.length; j++) {
                for (var k = 0; k < this.clubs?.length; k++) {
                  if (temp[j] == this.clubs[k].name) {
                    newBatch[i].selectedClubArray.push(this.clubs[k]); //this array is only for displaying. not for saving.
                  }
                }
              }
            }
            // // this for role new array icon
            newBatch[i].selectedRoleArray = [];
            if (newBatch[i].roles && newBatch[i].roles.length > 0) {
              let temp = newBatch[i].roles.split(',');
              for (var j = 0; j < temp.length; j++) {
                for (var k = 0; k < this.roles.length; k++) {
                  if (
                    temp[j].toUpperCase() == this.roles[k].name.toUpperCase()
                  ) {
                    let tempRole = JSON.parse(JSON.stringify(this.roles[k]));
                    if (temp[j] == this.roles[k].name) {
                      //role is not selected
                      tempRole.colorValue = '#E9E9EA';
                    } //role is selected
                    else {
                      tempRole.name = tempRole.name.toUpperCase();
                    }
                    newBatch[i].selectedRoleArray.push(tempRole); //this array is only for displaying. not for saving.
                  }
                }
              }
            }

            if (
              newBatch[i].acceptanceByAce == 1 &&
              newBatch[i].acceptanceByAceMaker == 1
            ) {
              this.membersEligibleForPeerRating =
                this.membersEligibleForPeerRating + 1;
              if (!newBatch[i].buddies || newBatch[i].buddies.length == 0) {
                this.buddyLessMembers = [...this.buddyLessMembers, newBatch[i]];
              }
            }
            newBatch[i].statusMessage = 'Status : Member';
            if (newBatch[i].acceptanceByAce == 0)
              newBatch[i].statusMessage =
                'Status : Confirmation pending from community member';
            if (newBatch[i].acceptanceByAceMaker == 0)
              newBatch[i].statusMessage = 'Status : Requested to join';
            if (newBatch[i].acceptanceByAce == 2)
              newBatch[i].statusMessage =
                'Status : Rejected by community member';
            if (newBatch[i].acceptanceByAceMaker == 2)
              newBatch[i].statusMessage =
                'Status : Rejected by community leader';
            if (newBatch[i].acceptanceByAceMaker == 5)
              newBatch[i].statusMessage =
                'Status : Blocked by community leader';
            if (newBatch[i].acceptanceByAceMaker == 6)
              newBatch[i].statusMessage = 'Status : Validated';
            if (newBatch[i].acceptanceByAceMaker == 7)
              newBatch[i].statusMessage = 'Status : KYC under review';
            if (newBatch[i].acceptanceByAceMaker == 8)
              newBatch[i].statusMessage = 'Status : KYC completed';
            if (newBatch[i].acceptanceByAceMaker == 9)
              newBatch[i].statusMessage =
                'Status : KYC under review - Docs received';
            if (newBatch[i].acceptanceByAceMaker == 10)
              newBatch[i].statusMessage = 'Status : Re-submit KYC';
            if (newBatch[i].acceptanceByAceMaker == 11)
              newBatch[i].statusMessage = 'Status : Withheld';
            if (
              newBatch[i].acceptanceByAce == 1 &&
              newBatch[i].acceptanceByAceMaker == 1
            ) {
              if (this.emailIds.length == 0)
                this.emailIds = newBatch[i].user.username;
              else
                this.emailIds = this.emailIds + ',' + newBatch[i].user.username;
            }
            if (newBatch[i].isAceMaker) {
              if (this.aceMakerId == '')
                this.aceMakerId = this.aceMakerId + newBatch[i].user.id;
              else
                this.aceMakerId = this.aceMakerId + ',' + newBatch[i].user.id;
            }
            if (newBatch[i].user.id !== this.myprofile.id) {
              if (
                newBatch[i].acceptanceByAce === 1 &&
                newBatch[i].acceptanceByAceMaker === 1
              ) {
                if (this.otherMembersId == '')
                  this.otherMembersId =
                    this.otherMembersId + newBatch[i].user.id;
                else
                  this.otherMembersId =
                    this.otherMembersId + ',' + newBatch[i].user.id;
              }
            }

            if (this.emailIds.length == 0)
              this.emailIds = newBatch[i].user.username;
            else
              this.emailIds = this.emailIds + ',' + newBatch[i].user.username;
          }
          if (!this.members) this.members = [];
          this.members = this.members.concat(newBatch);
        }
        this.loadMyMembership();
        this.enablePeerNps();
      });
  }

  myprofile: any = {};
  /*
  loadMyProfile(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/myprofile')
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.myprofile = data['dataObject'];
          this.checkIfIamAceMaker();
          var createdOnArr = this.myprofile.createdOn.split(' ')[0].split('-');
          var d0 = new Date(
            createdOnArr[1] + '/' + createdOnArr[2] + '/' + createdOnArr[0]
          ); //var date2 = new Date("07/30/2019");
          var d1 = new Date();
          var time = d1.getTime() - d0.getTime();
          this.daysOld = time / (1000 * 3600 * 24);
        }
      });
  }
  */
  getDaysOld(createdOnString: any): any {
    if (!createdOnString) return 0;
    var createdOnArr = createdOnString.split(' ')[0].split('-');
    var d0 = new Date(
      createdOnArr[1] + '/' + createdOnArr[2] + '/' + createdOnArr[0]
    ); //var date2 = new Date("07/30/2019");
    var d1 = new Date();
    var time = d1.getTime() - d0.getTime();
    return time / (1000 * 3600 * 24);
  }
  daysOld = 0;
  amIAceMaker = false;
  aceMakerId = '';
  otherMembersId = ''; //for sending notification
  iAmConfirmedMember = false;
  member: any;
  myMembership: any = {};
  /*
  checkIfIamAceMaker(): void {
    if (this.amIAceMaker || this.iAmConfirmedMember) {
      //this.members = this.membersTemp;
      //this.loadMembersToShow();
      return;
    }
    this.amIAceMaker = false;
    for (var i = 0; i < this.membersTemp.length; i++) {
      if (this.membersTemp[i].isAceMaker) {
        if (this.aceMakerId == '')
          this.aceMakerId = this.aceMakerId + this.membersTemp[i].user.id;
        else
          this.aceMakerId = this.aceMakerId + ',' + this.membersTemp[i].user.id;
        if (this.membersTemp[i].id.userId == this.myprofile.id) {
          this.amIAceMaker = true;
          //break;
        }
      }
      if (this.membersTemp[i].user.id !== this.myprofile.id) {
        if (
          this.membersTemp[i].acceptanceByAce === 1 &&
          this.membersTemp[i].acceptanceByAceMaker === 1
        ) {
          if (this.otherMembersId == '')
            this.otherMembersId =
              this.otherMembersId + this.membersTemp[i].user.id;
          else
            this.otherMembersId =
              this.otherMembersId + ',' + this.membersTemp[i].user.id;
        }
      }
    }
    if (!this.amIAceMaker) {
      for (var i = 0; i < this.membersTemp.length; i++) {
        if (this.membersTemp[i].id.userId == this.myprofile.id) {
          //own profile should be visible
          continue;
        }
        if (
          this.membersTemp[i].isAceMaker ||
          this.commonService.rbac['joining-requests'] ||
          this.commonService.rbac['inactive-members']
        ) {
          continue;
        }
        if (!this.iAmConfirmedMember) {
          this.membersTemp.splice(i, 1);
          i = i - 1;
        }
      }
    }
    this.members = this.membersTemp;
    //this.loadMembersToShow();
  }
  */
  updateMembershipReqFromAce(
    member: any,
    response: any,
    confirmationDone: any
  ): void {
    var responseString = 'accept';
    if (response == 2) responseString = 'reject';
    if (!confirmationDone) {
      Swal.fire({
        title: 'Confirmation',
        text:
          'Are you sure you want to ' +
          responseString +
          ' request from ' +
          member.user.name +
          ' ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(3, 142, 220)',
        cancelButtonColor: 'rgb(243, 78, 78)',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.value) {
          this.updateMembershipReqFromAce(member, response, true);
        }
      });
      return;
    }
    member.acceptanceByAceMaker = response;
    this.commonService.showProcessingIcon();
    if (response == 1) {
      //TODO - assign grade and target to the community member and then update acceptanceByAceMaker=1.
      //this.acceptModal.show();
      //this.loadGrades();
    }
    //else
    {
      member.weeklyTarget = 3;
      if (new Date().getFullYear() >= 2025) {
        member.weeklyTarget = 2;
    }
      member.grade = {
        id: 3,
        name: 'Stage 1',
        remark:
          'Monthly Retainer - NIL, Revenue Share Percentage - 100% of Community member Share',
      };
      member.gradeId = 3;
      this.commonService.showInfoMessage('Info', 'Processing request');
      this.commonService
        .post('mainservice/framework/communitymember', member)
        .subscribe((data: any) => {
          this.commonService.hideProcessingIcon();
          this.filterChanged();
          if (data['result'] == 200) {
            this.commonService.showSuccessMessage(
              'Info',
              'Processed successfully.'
            );
            if (responseString == 'accept') {
              this.commonService.sendMail(
                this.selectedMember.user.name,
                'Congratulations, your account has been approved !!',
                'Glad you made it here. We are super excited to welcome you to the community. Refer your first degree connects for Jobs on the Platform and Earn big time. Also, Check out our Jamming Sessions ,<br>'+
                '<a href="'+this.commonService.uiPrefix+'recr/earn">Hot Mandates</a>'+'and your <a href="https://platform.pieworks.in/fw/community">co-Community Members</a>' +
                  '<a href="https://youtu.be/iNa26rWT54Y">Earn (How to analyze the platform opportunities)</a><br>' +
                  '<a href="https://youtu.be/qHXinzEZ-fo">Discovery (Loading a referral)</a><br>' +
                  '<a href="https://youtu.be/cSOjbjXesV0">Learn, Clubs & Events (Enhance your knowledge & network)</a><br>' +
                  '<a href="https://youtu.be/vjFUlHqPtok">Piebank (Banking at Pieworks)</a><br>' +
                  '<a href="https://youtu.be/5DrdaSwiRjw">Reports (Review your Performance)</a><br><br>' +
                  'You are invited to join the whatsapp group of Pieworks - Get to know others and also stay updated with all the info seamlessly - Have a great time here.<br>' +
                  '<a href="https://chat.whatsapp.com/JIdRwg0kV15IWHksrWsGkK">Click to join group</a><br><br>' +
                  'For any query related to the Pieworks platform, please contact Mr. Nikhil Raj at nikhil@pieworks.in (8590521099)',
                undefined,
                this.selectedMember.user.username,
                'jewel@pieworks.in',
                'anush@pieworks.in',
                'https://platform.pieworks.in/',
                undefined,
                'Pieworks Platform',
                undefined,
                'altlife@pieworks.in'
              );

              this.commonService.sendNotification(
                this.otherMembersId,
                this.selectedMember.user.name +
                  ' has joined your community ' +
                  this.community.name,
                '/fw/community',
                'COMMUNITY MEMBER',
                1,
                0
              );
            } else if (responseString == 'reject')
              this.commonService.sendNotification(
                this.selectedMember.user.id,
                'We are unable to accept your request due to either of the 2 reasons<br/>'+ 
                'a. Wrong contact number/Linkedin<br/>'+ 
                'b. Misalignment with Pieworks Community Model.<br/>'+ 
                'If you believe it is the reason "a", please drop an email at anush@pieworks.in. If it is reason "b" reapply after 6 months. ',
                'http://pieworks.platform.in',
                'COMMUNITY MEMBER',
                1,
                1
              );
            this.commonService.showInfoMessage('Info', 'Updated successfully.');
          } else {
            this.commonService.showErrorMessage(
              'Error',
              'Couldnt process the request, please try again later.'
            );
          }
        });
    }
  }
  selectedWeeklyTarget = 0;
  selectedGradeId = 3;
  acceptUser(): void {
    this.selectedMember.weeklyTarget = this.selectedWeeklyTarget;
    for (var i = 0; i < this.grades.length; i++) {
      if (this.grades[i].id == this.selectedGradeId)
        this.selectedMember.grade = this.grades[i];
    }
    this.commonService.showInfoMessage('Info', 'Processing request');
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.showSuccessMessage(
          'Info',
          'Processed successfully.'
        );
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] == 200) {
          this.acceptModal.hide();
          this.commonService.sendNotification(
            this.otherMembersId,
            this.selectedMember.user.name +
              ' has joined the community ' +
              this.community.name,
            '/fw/community',
            'COMMUNITY MEMBER',
            1,
            0
          );
        } else {
          this.commonService.showErrorMessage(
            'Error',
            'Sorry , couldnt process the request now. Please try again later.'
          );
        }
      });
  }

  callBackFunction: any;
  confirm(
    member: any,
    response: any,
    functionToCall: any,
    title: any,
    message: any
  ): void {
    this.callBackFunction = functionToCall;
    this.commonService.showConfirmWindow(
      title,
      message,
      () => {
        this.callBackFunction(member, response, true);
      },
      undefined
    );
  }
  goBack(): void {
    this._location.back();
  }

  @ViewChild('approveRolesModal') approveRolesModal: any;
  menuOptions: any = [];
  selectedMember: any;
  fillMenuOptions(member: any): void {
    this.selectedMember = member;
    this.menuOptions = [];
    //    this.menuOptions.push('View Profile');
    if (this.myprofile.id !== member.user.id && this.amIAceMaker) {
      this.menuOptions.push('Remove from community');
    }
    // this should be inside the above if statement
    this.menuOptions.push('Approve roles');

    this.menuOptions.push('View buddies');
    if (
      this.amIAceMaker ||
      this.commonService.rbac['community-member-tile-menu']
    ) {
      if (member && member.grade.id != 3) {
        //this.menuOptions.push("Set Weekly Target for Buddy Team");
      }
      if (
        member &&
        member.acceptanceByAce === 1 &&
        member.acceptanceByAceMaker === 1
      ) {
        this.menuOptions.push('Set Weekly Target');
        this.menuOptions.push('Set Stage');
        if (!member.buddies || member.buddies.split(',').length == 0) {
          this.menuOptions.push('Assign/Remove Co-Buddy');
          this.menuOptions.push('Assign/Remove Buddy');
        } else if (member.buddyType == 'BUDDY') {
          this.menuOptions.push('Assign/Remove Co-Buddy');
        } else if (member.buddyType == 'CO-BUDDY') {
          this.menuOptions.push('Assign/Remove Buddy');
        }
        if (this.amIAceMaker && !member.isAceMaker)
          this.menuOptions.push('Make Community Leader');
        if (
          this.amIAceMaker &&
          member.isAceMaker &&
          this.myprofile.id !== member.user.id
        )
          this.menuOptions.push('Dismiss As Community Leader');
        if (member.acceptanceByAceMaker == 1)
          this.menuOptions.push('Block Member'); //set acceptanceByAceMaker=5

        if (this.activateNpsForm) this.menuOptions.push('Give Feedback');
      }
      if (member.acceptanceByAceMaker == 5 || member.acceptanceByAceMaker == 11)
        this.menuOptions.push('Allow Member');
      this.menuOptions.push('View KYC');
      this.menuOptions.push('Notify to Update KYC');

      //this.menuOptions.push("View Online Status Logs");
    }
    /*
          if(this.amIAceMaker|| this.commonService.rbac['joining-requests']|| this.myprofile.id==7)// joining-requests can make changes 
          {
              
            if(member.acceptanceByAceMaker==0)
                this.menuOptions.push("Mark as validated");
            else if(member.acceptanceByAceMaker==6)//validated
                this.menuOptions.push("Mark as KYC under review");
            else if(member.acceptanceByAceMaker==7||member.acceptanceByAceMaker==9)//KYC under review or docs received
            {
                this.menuOptions.push("Mark as KYC completed");
                //this.menuOptions.push("Re-submit KYC");
            }
            
          }
          if(this.myprofile.id==8)//karthik
          {
              if(member.acceptanceByAceMaker==7||member.acceptanceByAceMaker==9)//KYC under review or docs received
              {
                this.menuOptions.push("Mark as KYC completed");
                //this.menuOptions.push("Re-submit KYC");
              }
          }
          */
    if (this.myprofile.id == member.user.id)
      this.menuOptions.push('Quit from community');
  }
  selectedMenuAction: any = undefined;
  handleMenuClick(option: string): void {
    this.selectedMenuAction = option;
    switch (option) {
      case 'View Profile':
        this.router.navigate([
          '../../../profile/' + this.selectedMember.user.id,
        ]);
        break;
      case 'View Online Status Logs':
        this.router.navigate([
          '../../../onlineStatusLog/' + this.selectedMember.user.id,
        ]);
        break;
      case 'Make Community Leader':
        this.makeAceMaker(false);
        break;
      case 'Dismiss As Community Leader':
        this.dismissAceMaker(false);
        break;
      case 'Quit from community':
        this.quitFromCommunity(false);
        break;
      case 'Approve roles':
        this.approveRolesModal.show();
        break;
      case 'Remove from community':
        this.removeFromCommunity(false);
        break;
      case 'Block Member':
        this.blockMember(false);
        break;
      case 'Allow Member':
        this.allowMember(false);
        break;
      case 'Mark as validated':
        this.updateStatus(false, 'validated', 6);
        break;
      case 'Mark as KYC under review':
        this.updateStatus(false, 'KYC under review', 7);
        break;
      case 'Mark as KYC verified':
        if (
          this.selectedMember.verified &&
          this.selectedMember.acceptanceByAceMaker == 9
        ) {
          this.statusString = 'KYC completed';
          this.callBackFunction = this.setAddressOfMember;
          this.formItemArray = [
            { arg: 'Community Member Address : ', value: '' },
          ];
          this.updateStatus(false, 'KYC verified', 8);
        }
        break;
      case 'Re-submit KYC':
        this.updateStatus(false, 'Re-submit KYC', 10);
        break;
      case 'Set Weekly Target':
        this.callBackFunction = this.setWeeklyTargetForMember;
        this.formItemArray = [
          { arg: 'Target', value: this.selectedMember.weeklyTarget },
        ];
        this.setWeeklyTargetModal.show();
        //                this.commonService.showGeneralInputWindow("Set Weekly Target",this.formItemArray,()=>{
        //                this.callBackFunction(this.formItemArray);
        //                },undefined);
        break;
      case 'Set Weekly Target for Buddy Team':
        this.callBackFunction = this.setWeeklyTargetForMemberForBuddyTeam;
        this.formItemArray = [
          {
            arg: 'Target',
            value: this.selectedMember.weeklyTargetForBuddyTeam,
          },
        ];
        //                this.commonService.showGeneralInputWindow("Set Weekly Target for Buddy Team",this.formItemArray,()=>{
        //                this.callBackFunction(this.formItemArray);
        //                },undefined);
        break;
      case 'Set Stage':
        this.callBackFunction = this.saveGrade;
        this.formItemArray = [
          { arg: 'Grade', value: this.selectedMember.grade.id },
        ];
        this.loadGrades();
        this.setGradeModal.show();
        break;
      case 'Assign/Remove Co-Buddy':
        //if(this.selectedMember.buddies)
        this.buddyModal.show();
        this.fillOriginalBuddies();
        this.loadBuddyDropDown(option, this.selectedMember);
        //this.showBuddyWindow();
        break;

      case 'Assign/Remove Buddy':
        //if(this.selectedMember.buddies)
        this.buddyModal.show();
        this.fillOriginalBuddies();
        this.loadBuddyDropDown(option, this.selectedMember);
        //this.showBuddyWindow();
        break;
      case 'Provide feedback':
        this.router.navigate([
          'community/mycommunities/2/peerfeedback/' +
            this.selectedMember.user.id,
        ]);
        break;
      case 'View buddies':
        this.buddiesViewModal.show();
        this.getBuddies(this.selectedMember.buddies);
        break;
      case 'View KYC':
        this.kycModal.show();
        this.loadKyc(this.selectedMember.user.id);
        break;
      case 'Notify to Update KYC':
        this.notificationForKyc();
        break;
      case 'Give Feedback':
        this.showFeedbackWindow();
        break;
    }
  }

  kycMessage: any = 'You are requested to upload the KYC documents.';
  // Notification and mail to user for kyc
  notificationForKyc(): void {
    Swal.fire({
      title: 'Confirmation required',
      text:
        'Are you sure you want to send KYC Notification and Mail ' +
        this.selectedMember.user.name +
        '?',
      input: 'text',
      inputValue: this.kycMessage,
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      if (result.value) {
        this.commonService.sendNotification(
          this.selectedMember.user.id,
          this.kycMessage,
          '/fw/user/' + this.selectedMember.user.id + '?action=uploadKyc',
          'COMMUNITY MEMBER',
          1,
          1
        );

        this.commonService.showSuccessMessage(
          'Kyc',
          'Notification send to User'
        );
      }
    });
  }
  grades: any = [];
  grade = -1;
  loadGrades(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/grades')
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.grades = data['dataArray'];
      });
  }
  whatsappMessage(selected: any) {
    window.open(
      `https://wa.me/+91${selected.mobileno}?text=Hello%20%20${selected.name} !`
    );
  }

  phoneCall(selected: any) {
    window.open(`tel:+91${selected.mobileno}`);
  }

  saveGrade() {
    for (var i = 0; i < this.grades.length; i++) {
      if (this.grades[i].id == this.formItemArray[0].value)
        this.selectedMember.grade = this.grades[i];
    }
    this.commonService.showInfoMessage('Info', 'Processing request');
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] === 200) {
          this.commonService.showSuccessMessage(
            'Info',
            'Updated weekly target for ' + this.selectedMember.user.name
          );
          this.commonService.sendNotification(
            this.selectedMember.user.id + '',
            this.myprofile.name +
              ' has set modified your grade to ' +
              this.selectedMember.grade.name,
            '/fw/community',
            'COMMUNITY MEMBER',
            2,
            1
          );
          this.setWeeklyTargetModal.hide();
        } else {
          this.commonService.showInfoMessage(
            'Error',
            'Couldnt update weekly target for ' +
              this.selectedMember.user.name +
              '.Please try again later.'
          );
        }
      });
  }
  formItemArray = [{ arg: 'Target', value: '' }];
  setWeeklyTarget = false;
  setWeeklyTargetForMember(formItemArray: any): void {
    this.selectedMember.weeklyTarget = formItemArray[0].value;
    this.commonService.showInfoMessage('Info', 'Processing request');
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] === 200) {
          this.commonService.showSuccessMessage(
            'Info',
            'Updated weekly target for ' + this.selectedMember.user.name
          );
          this.commonService.sendNotification(
            this.selectedMember.user.id + '',
            this.myprofile.name +
              ' has set you a weekly target of ' +
              formItemArray[0].value,
            '/fw/community',
            'COMMUNITY MEMBER',
            2,
            1
          );
          this.setWeeklyTargetModal.hide();
        } else {
          this.commonService.showInfoMessage(
            'Error',
            'Couldnt update weekly target for ' +
              this.selectedMember.user.name +
              '.Please try again later.'
          );
        }
      });
  }
  setWeeklyTargetForMemberForBuddyTeam(formItemArray: any): void {
    this.selectedMember.weeklyTargetForBuddyTeam = formItemArray[0].value;
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] === 200)
          this.commonService.sendNotification(
            this.selectedMember.user.id + '',
            this.myprofile.name +
              ' has set you a weekly target of ' +
              formItemArray[0].value +
              ' for you buddy team.',
            '/fw/community',
            'COMMUNITY MEMBER',
            2,
            1
          );
      });
  }
  setAddressOfMember(formItemArray: any): void {
    this.selectedMember.temp = formItemArray[0].value;
    this.selectedMember.acceptanceByAceMaker = 8;
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] === 200) {
          this.commonService.sendNotification(
            this.aceMakerId + ',32187,3762,8',
            this.myprofile.name +
              ' has updated status of ' +
              this.selectedMember.user.name +
              ' to ' +
              this.statusString,
            '/fw/community',
            'COMMUNITY MEMBER',
            3,
            0
          );
        }
      });
  }

  selectedRoles: string[] = []; // Array to hold selected role names
  approvedRoles: any = '';
  toTitleCase(str: string): string {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
      return match.toUpperCase();
    });
  }
  areAllCharactersCapital(str: string): boolean {
    for (let char of str) {
      if (char !== char.toUpperCase()) {
        return false;
      }
    }
    return true;
  }
  handleRoleCheckboxChange(roleName: string): any {
    let convertedRoleName = roleName;
    //alert(roleName);
    if (this.areAllCharactersCapital(roleName)) {
      //all chars are in capital, need to unselect
      convertedRoleName = this.toTitleCase(roleName);
    } else {
      convertedRoleName = roleName.toUpperCase();
    }
    this.selectedMember.roles = this.selectedMember.roles.replace(
      roleName,
      convertedRoleName
    );
    //alert("after replace with " + convertedRoleName+" "+this.selectedMember.roles );
    return convertedRoleName;
    //alert(convertedRoleName);
    /*
    const index = this.selectedRoles.indexOf(roleName.toUpperCase()); // Convert role name to uppercase
    const roleNameUpperCase = roleName.toUpperCase(); // Convert role name to uppercase

    if (index === -1) {
      // Role not found in array, add it
      this.selectedRoles.push(roleNameUpperCase);
    } else {
      // Role already in array, remove it
      this.selectedRoles.splice(index, 1);
    }

    this.approvedRoles = this.selectedRoles.join(','); // Convert array to string
    console.log(this.approvedRoles); // For testing
    */
  }

  approveRoles(): any {
    console.log(this.approvedRoles);
    //this.selectedMember.roles = this.approvedRoles;
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.approveRolesModal.hide();
          this.filterChanged();
        }
      });
  }
  showBuddyWindow() {}
  buddyformItemArray: any = [{ arg: 'buddies', value: '' }];
  buddies: any = [];
  setBuddiesForMember(): void {
    if (this.selectedMenuAction == 'Assign/Remove Co-Buddy')
      this.selectedMember.buddyType = 'BUDDY';
    else if (this.selectedMenuAction == 'Assign/Remove Co-Buddy')
      this.selectedMember.buddyType = 'CO-BUDDY';
    this.commonService.showProcessingIcon();
    var temp = [];
    for (var i = 0; i < this.buddies.length; i++) {
      if (this.selectedMenuAction == 'Assign/Remove Co-Buddy')
        this.buddies[i].buddyType = 'CO-BUDDY';
      else if (this.selectedMenuAction == 'Assign/Remove Co-Buddy')
        this.buddies[i].buddyType = 'BUDDY';
      temp.push(this.buddies[i].user.id);
      this.saveOtherMembers(this.buddies[i]);
    }
    this.selectedMember.buddies = temp.toString();
    this.commonService.showInfoMessage('Info', 'Processing request');
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.message = 'Save successfully.';
          if (
            this.selectedMember.acceptanceByAce == 1 &&
            this.selectedMember.acceptanceByAceMaker == 1
          )
            this.commonService.sendNotification(
              this.selectedMember.user.id,
              'Your buddy list has been updated in the community  ' +
                this.selectedMember.community.name,
              '/community/mycommunities/' + this.selectedMember.community.id,
              'COMMUNITY MEMBER',
              1,
              1
            );
        } else this.message = "Couldn't save. Please try again later.";
        this.commonService.showInfoMessage('Info', this.message);
        this.buddyModal.hide();
      });
    this.updateRemovedBuddies();
  }
  originalBuddies: any = [];
  saveOtherMembers(otherMember: any) {
    if (otherMember.buddies && otherMember.buddies.length > 0) {
      var temp = otherMember.buddies.split(',');
      if (temp.indexOf(this.selectedMember.user.id + '') > -1) return;
      else
        otherMember.buddies =
          otherMember.buddies + ',' + this.selectedMember.user.id;
    } else {
      otherMember.buddies = this.selectedMember.user.id + '';
    }
    this.commonService
      .post('mainservice/framework/communitymember', otherMember)
      .subscribe((data: any) => {
        if (
          otherMember.acceptanceByAce == 1 &&
          otherMember.acceptanceByAceMaker == 1
        )
          this.commonService.sendNotification(
            otherMember.user.id,
            'Your buddy list has been updated in the community  ' +
              this.selectedMember.community.name,
            '/fw/community/',
            'COMMUNITY MEMBER',
            1,
            1
          );
      });
  }
  updateRemovedBuddies(): void {
    var removedbuddies = [];
    for (var i = 0; i < this.originalBuddies.length; i++) {
      var found = false;
      for (var j = 0; j < this.buddies.length; j++) {
        console.log(
          this.originalBuddies[i].user.id + '==' + this.buddies[j].user.id
        );
        if (this.originalBuddies[i].user.id == this.buddies[j].user.id)
          found = true;
      }
      if (!found) {
        if (
          this.originalBuddies[i].buddies &&
          this.originalBuddies[i].buddies.length > 0
        ) {
          console.log(this.originalBuddies[i].buddies);
          var temp = this.originalBuddies[i].buddies.split(',');
          while (temp.indexOf(this.selectedMember.user.id + '') > -1) {
            temp.splice(temp.indexOf(this.member.user.id + ''), 1);
          }
          this.originalBuddies[i].buddies = temp.toString();
          this.commonService
            .post(
              'mainservice/framework/communitymember',
              this.originalBuddies[i]
            )
            .subscribe((data: any) => {
              if (
                this.originalBuddies[i].acceptanceByAce == 1 &&
                this.originalBuddies[i].acceptanceByAceMaker == 1
              )
                this.commonService.sendNotification(
                  this.originalBuddies[i].user.id,
                  'Your buddy list has been updated in the community  ' +
                    this.selectedMember.community.name,
                  '/fw/community',
                  'COMMUNITY MEMBER',
                  1,
                  0
                );
            });
        }
      }
    }
    setTimeout(() => {
      this.filterChanged();
    }, 3000);
  }
  buddyLessMembers: any = [];
  markAsVerified(): void {
    this.selectedMember.verified = true;
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        if (
          data['result'] === 200 &&
          this.selectedMember.acceptanceByAceMaker == 8
        ) {
          this.updateMembershipReqFromAce(this.selectedMember, 1, true);
        }

        this.commonService.sendNotification(
          this.selectedMember.user.id,
          'Congratulations !! Your profile has been validated by our team.',
          '',
          'COMMUNITY MEMBER',
          1,
          1
        );
      });
  }
  markAsObCallCompleted(): void {
    this.selectedMember.obCall = 'true';
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        if (
          data['result'] === 200 &&
          this.selectedMember.acceptanceByAceMaker == 8
        ) {
          this.updateMembershipReqFromAce(this.selectedMember, 1, true);
        }
      });
  }

  markAsKycCompleted(): void {
    Swal.fire({
      title: 'Confirmation',
      text:
        'Are you sure you want to mark request from ' +
        this.selectedMember.user.name +
        ' as KYC verified. ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.selectedMember.acceptanceByAceMaker = 8;
        this.commonService
          .post('mainservice/framework/communitymember', this.selectedMember)
          .subscribe((data: any) => {
            if (data['result'] === 200 && this.selectedMember.verified) {
              this.updateMembershipReqFromAce(this.selectedMember, 1, true);

              this.commonService.sendNotification(
                this.selectedMember.id,
                this.selectedMember.name +
                  ' Please click on this notification to join community whatsapp group.',
                'https://chat.whatsapp.com/JIdRwg0kV15IWHksrWsGkK',
                'COMMUNITY MEMBER',
                1,
                0
              );
            }
          });
      }
    });
  }

  confirmMenu(title: any, message: any, functionToCall: any): void {
    this.callBackFunction = functionToCall;
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
        this.callBackFunction(true, message);
      }
    });
  }
  makeAceMaker(confirmationDone: any): void {
    if (!confirmationDone) {
      this.confirmMenu(
        'Confirmation',
        'Are you sure, you want to make ' +
          this.selectedMember.user.name +
          ' as Community Leader ?',
        this.makeAceMaker
      );
      return;
    }
    this.selectedMember.isAceMaker = 1;
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] === 200)
          this.commonService.sendNotification(
            this.otherMembersId,
            this.myprofile.name +
              ' has marked ' +
              this.selectedMember.user.name +
              ' as Community Leader of the community ' +
              this.community.name,
            '/fw/community',
            'COMMUNITY MEMBER',
            1,
            0
          );
      });
  }
  dismissAceMaker(confirmationDone: any): void {
    if (!confirmationDone) {
      this.confirmMenu(
        'Confirmation',
        'Are you sure, you want to dismiss ' +
          this.selectedMember.user.name +
          ' as Community Leader ?',
        this.dismissAceMaker
      );
      return;
    }
    this.selectedMember.isAceMaker = 0;
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] === 200)
          this.commonService.sendNotification(
            this.otherMembersId,
            this.myprofile.name +
              ' has removed ' +
              this.selectedMember.user.name +
              ' as Community Leader of the community ' +
              this.community.name,
            '/fw/community',
            'COMMUNITY MEMBER',
            1,
            1
          );
      });
  }
  findNoOfAceMaker(): any {
    var count = 0;
    for (var i = 0; i < this.members.length; i++) {
      if (this.members[i].isAceMaker) count = count + 1;
    }
    return count;
  }
  quitFromCommunity(confirmationDone: any): void {
    if (this.selectedMember.isAceMaker) {
      if (this.findNoOfAceMaker() == 1) {
        this.commonService.showErrorMessage(
          'Error',
          'Sorry, You are the only Community Leader of this community. Please make a community member as community leader before quiting.'
        );
        return;
      }
    }
    if (!confirmationDone) {
      this.confirmMenu(
        'Confirmation',
        'Are you sure, you want to quit from this community ?',
        this.quitFromCommunity
      );
      return;
    }
    this.selectedMember.acceptanceByAce = 4; //deleted
    this.selectedMember.isAceMaker = 0;
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] === 200)
          this.commonService.sendNotification(
            this.otherMembersId,
            this.myprofile.name +
              ' has quit from the community ' +
              this.community.name,
            '/fw/community',
            'COMMUNITY MEMBER',
            3,
            0
          );
      });
  }
  removeFromCommunity(confirmationDone: any): void {
    if (!confirmationDone) {
      this.confirmMenu(
        'Confirmation',
        'Are you sure, you want to remove ' +
          this.selectedMember.user.name +
          ' from community ?',
        this.removeFromCommunity
      );
      return;
    }
    this.selectedMember.acceptanceByAceMaker = 4; //deleted
    this.selectedMember.isAceMaker = 0;
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] === 200) {
          //this.commonService.sendNotification(this.otherMembersId,this.myprofile.name+" has removed "+this.selectedMember.user.name+" from the community "+this.community.name,"/fw/community","COMMUNITY MEMBER",3,0);
          var message =
            'It is unfortunate that we have to end our association with you. We enjoyed your time and presence but this is not the end of our Journey. Rather, this is just a pause. As we wish for the best future for you, we want to assure you that if you wish to return to the community ' +
            this.community.name +
            ', it is always open to you by reaching out to us again.';
          this.commonService.sendNotification(
            this.selectedMember.user.id + '',
            message,
            '/fw/community',
            'COMMUNITY MEMBER',
            3,
            1
          );
        }
      });
  }
  blockMember(confirmationDone: any): void {
    if (!confirmationDone) {
      this.confirmMenu(
        'Confirmation',
        'Are you sure, you want to block ' +
          this.selectedMember.user.name +
          ' ?',
        this.blockMember
      );
      return;
    }
    this.selectedMember.acceptanceByAceMaker = 5; //block
    this.selectedMember.isAceMaker = 0;
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] === 200) {
          //this.commonService.sendNotification(this.otherMembersId,this.myprofile.name+" has blocked "+this.selectedMember.user.name+" to the community "+this.community.name,"/fw/community","COMMUNITY MEMBER",3,0);
          var message =
            'It is unfortunate that we have to end our association with you. We enjoyed your time and presence but this is not the end of our Journey. Rather, this is just a pause. As we wish for the best future for you, we want to assure you that if you wish to return to the community ' +
            this.community.name +
            ', it is always open to you by reaching out to us again.';
          this.commonService.sendNotification(
            this.selectedMember.user.id + '',
            message,
            '/fw/community',
            'COMMUNITY MEMBER',
            3,
            1
          );
        }
      });
  }
  allowMember(confirmationDone: any): void {
    if (!confirmationDone) {
      this.confirmMenu(
        'Confirmation',
        'Are you sure, you want to allow ' +
          this.selectedMember.user.name +
          ' ?',
        this.allowMember
      );
      return;
    }
    this.selectedMember.acceptanceByAceMaker = 1; //allow
    this.selectedMember.isAceMaker = 0;
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] === 200) {
          //this.commonService.sendNotification(this.otherMembersId,this.myprofile.name+" has allowed "+this.selectedMember.user.name+" to the community "+this.community.name,"/fw/community","COMMUNITY MEMBER",3,0);
          this.commonService.sendNotification(
            this.selectedMember.user.id + '',
            this.myprofile.name +
              ' has accepted you to the community ' +
              this.community.name,
            '/fw/community',
            'COMMUNITY MEMBER',
            3,
            1
          );
        }
      });
  }
  status: any;
  selectedStatus: any = -1;
  statusString: any;
  updateStatus(confirmationDone: any, statusString: any, status: any): void {
    if (!confirmationDone) {
      this.statusString = statusString;
      this.status = status;
      var msg =
        'Are you sure, you want to mark ' +
        this.selectedMember.user.name +
        ' as ' +
        statusString +
        ' ?';
      if (status == 6 || status == 10)
        msg =
          msg +
          ' Please note a mail for uploading the KYC documents will be send to the member.';
      this.confirmMenu('Confirmation', msg, this.updateStatus);
      return;
    }
    this.selectedMember.acceptanceByAceMaker = this.status;
    this.selectedMember.isAceMaker = 0;
    this.commonService.showProcessingIcon();
    //    if (status == 8) {
    //      this.selectedMember.contractAcceptance = 'pending';
    //    }
    this.commonService
      .post('mainservice/framework/communitymember', this.selectedMember)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.filterChanged();
        if (data['result'] === 200) {
          this.commonService.sendNotification(
            this.aceMakerId + ',3762,32187,8',
            this.myprofile.name +
              ' has updated status of ' +
              this.selectedMember.user.name +
              ' to ' +
              this.statusString,
            '/fw/community',
            'COMMUNITY MEMBER',
            3,
            0
          );
        }
      });
  }
  media: any = ['copy'];
  emailIds = '';
  copyEmailIds() {
    var url =
      'mainservice/framework2/forward?api=frameworkservice/framework2/community/copyEmailIds?communityId=' +
      localStorage.getItem('communityId');

    url =
      'mainservice/framework/members2/' +
      this.communityId +
      '?acceptanceByAceValues=' +
      this.acceptanceByAceValues +
      '&acceptanceByAceMakerValues=' +
      this.acceptanceByAceMakerValues +
      '&userId=-1&roleInCommunity=' +
      -1 +
      '&pageNum=' +
      this.pageNum +
      '&pageSize=' +
      this.pageSize +
      '&searchText=' +
      this.searchText +
      '&showMembersWithKyc=' +
      this.showMembersWithKyc +
      '&obCall=' +
      this.showObCallCompleted +
      '&showMembersWithPhone=' +
      this.showMembersWithPhone +
      '&createdOnLike=' +
      this.creationMonth +
      '&approvedOnMonth=' +
      this.approvedOnMonth +
      '&jobFamily=' +
      this.jobFamily +
      '&action=copyEmailIds';
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.clipboard.copy(data['dataObject']);
        this.commonService.showInfoMessage('Info', 'Copied email ids.');
      } else console.error('Error in getting data');
    });
  }
  showCopy = true;
  loadProspectForm() {
    // this.dialog.open(ProspectFormComponent);
    //        let backdropClicked = false;
    //        const dialogRef = this.dialog.open(ProspectFormComponent, {
    //            data: { backdropClicked: false },
    //            disableClose: true,
    //          });
    //        if(dialogRef){
    //            dialogRef.backdropClick().subscribe(() => {
    //                // Handle click outside the content box here
    //                backdropClicked = true;
    //                dialogRef.componentInstance.updateBackdropClicked(backdropClicked);
    //              });
    //        }
  }
  loadRsppForm() {
    var code = new Date().getTime() + this.myprofile.id;
    window.open(this.commonService.uiPrefix + 'recruitment/rspp-form/' + code);
  }
  showProspectCopy = true;
  copyProspectLink() {
    var code = new Date().getTime() + this.myprofile.id;
    this.showProspectCopy = false;
    this.clipboard.copy(
      this.commonService.uiPrefix + 'community/open/prospect-form/' + code
    );
    this.commonService.showInfoMessage('Info', 'Copied Prospect Form Link.');
    setTimeout(() => {
      this.showProspectCopy = true;
    }, 2000);
  }

  showRsppCopy = true;
  copyRsppLink() {
    var code = new Date().getTime() + this.myprofile.id;
    this.showRsppCopy = false;
    this.clipboard.copy(
      this.commonService.uiPrefix + 'recruitment/open/rspp-form/' + code
    );
    this.commonService.showInfoMessage('Info', 'Copied rspp link.');
    setTimeout(() => {
      this.showRsppCopy = true;
    }, 2000);
  }
  showReferalCopy = true;
  copyReferalLink() {
    var code = new Date().getTime() + this.myprofile.id;
    this.showReferalCopy = false;
    this.clipboard.copy(
      this.commonService.uiPrefix +
        'open/joining-form?referalCode=' +
        this.myprofile.myReferalCode +
        '&communityId=' +
        this.community.id
    );
    this.commonService.showInfoMessage('Info', 'Copied referral link.');
    setTimeout(() => {
      this.showReferalCopy = true;
    }, 2000);
  }
  memberType = 'Members';
  getOnlineStatusIcon(status: any): any {
    switch (status) {
      case 'WORK_ON_MODE':
        return ' ri-checkbox-blank-circle-fill pieworks-green';
      case 'IN_A_MEETING':
        return ' ri-checkbox-blank-circle-fill pieworks-red';
      case 'WORK_OFF_MODE':
        return ' ri-checkbox-blank-circle-line';
      default:
        return 'icofont-exit';
    }
  }
  addFeedbackMenuItemIfReqd(): void {
    var monthDate = this.commonService
      .getFormatedDate(new Date(), 'MM-dd')
      .split('-');
    if (
      monthDate[0] == '04' ||
      monthDate[0] == '07' ||
      monthDate[0] == '10' ||
      monthDate[0] == '11' ||
      monthDate[0] == '01'
    ) {
      //todo remove 11
      if (parseInt(monthDate[1]) <= 31) {
        //todo change it to 31st.
        this.activateNpsForm = true; //TODO enable this line after July 16th 2022.
      }
    }
    //this.activateNpsForm=true; //this line to be remove. added on 30-01-2023
  }

  buddiesName: any;
  getBuddies(userIds: any): any {
    if (!userIds) return;
    var names: any = [];
    this.commonService
      .get(
        'mainservice/framework/members/' +
          this.communityId +
          '?acceptanceByAceValues=0,1,2,3,4,5,6,7,8,9,10&acceptanceByAceMakerValues=0,1,2,3,4,5,6,7,8,9,10&userId=' +
          userIds +
          '&roleInCommunity=0,1'
      )
      .subscribe((data: any) => {
        for (var i = 0; i < data['dataArray'].length; i++) {
          names.push(data['dataArray'][i].user.name);
        }
        this.buddiesName = names.toString();
        return names.toString();
      });
  }
  kyc: any = undefined;
  loadKyc(userId: any): void {
    this.kyc = undefined;
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/kyc?userId=' + userId)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.kyc = data['dataObject'];
          console.log(this.kyc);
          if (this.kyc.addressProof) {
            var temp = this.kyc.addressProof.split('address');
            this.kyc.addressProof2 = temp[0] + '2' + 'address' + temp[1];
          }
        }
      });
  }

  doubleClickCounter = 0;
  clickedOnMember(m: any): void {
    return; //disabling navigation
    this.doubleClickCounter++;
    if (this.doubleClickCounter >= 2) this.doubleClicked(m);
    setTimeout(() => {
      this.doubleClickCounter = 0;
    }, 300);
  }
  doubleClicked(m: any): void {
    this.router.navigate(['fw/user/' + m.user.id]);
  }
  clearFilters(): void {
    this.searchText = '';
    this.acceptanceByAceMakerValues = '1';
    this.otherMembersId = '';
    this.emailIds = '';
    this.showEnablers = false;
    this.showMembersWithKyc = false;
    this.showMembersWithPhone = false;
    this.showMembersWithLinkedIn = false;
    this.lonelyMembers = false;
    this.showObCallCompleted = 'all';
    this.buddyLessMembers = [];
    this.creationMonth = '';
    this.approvedOnMonth = '';
    this.jobFamily = '';
    this.filterChanged();
  }
  lonelyMembers = false;
  filterChanged(): void {
    setTimeout(() => {
      this.pageNum = 1;
      this.members = [];
      this.otherMembersId = '';
      this.loadCommunityMembers(true);
    }, 500);
  }
  onMemberSearch(item: any) {
    this.searchText = item.term;
    this.filterChanged();
  }

  // when item is already loaded locally then this method made it local search
  memberLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }
  creationMonth: any = '';
  approvedOnMonth: any = '';
  //memberTypes:any=[{name:"Members",value:"1"},{name:"Blocked",value:"5"},{name:"Validated",value:"6"},{name:"KYC under review",value:"7"},{name:"KYC completed",value:"8"},{name:"KYC under review",value:"9"},{name:"Resubmit KYC",value:"10"},{name:"Rejected",value:"2"}];//0,1,5,6,7,8,9
  memberTypes: any = [
    { name: 'Members', value: '1' },
    { name: 'Blocked', value: '5' },
    { name: 'Joining Request', value: '0,6,7,8,9,10' },
    { name: 'Rejected', value: '2' },
    { name: 'Withheld ', value: '11' },
  ]; //0,1,5,6,7,8,9
  fillMemberTypes(): void {
    this.memberTypes = [];
    this.memberTypes.push({ name: 'Members', value: '1' });
    if (this.commonService.rbac['inactive-requests']) {
      this.memberTypes.push({ name: 'Blocked', value: '5' });
      this.memberTypes.push({ name: 'Rejected', value: '2' });
      this.memberTypes.push({ name: 'Withheld ', value: '11' });
    }
    if (this.commonService.rbac['joining-requests']) {
      this.memberTypes.push({
        name: 'Joining Requests',
        value: '0,6,7,8,9,10',
      });
    }
  }

  changedCarosel(member: any, index: any): void {
    //    return;
    //    this.commonService
    //      .get(
    //        'mainservice/framework2/forward?api=frameworkservice/framework2/community/extraMemberDetails?userId=' +
    //          member.user.id +
    //          ',communityId=' +
    //          this.communityId
    //      )
    //      .subscribe((data: any) => {
    //        this.commonService.hideProcessingIcon();
    //        if (data['result'] === 200) {
    //          member.extraDetails = data['dataObject'];
    //        }
    //      });
  }
  showFeedbackWindow(): void {
    this.peerForm.community = this.community;
    this.peerForm.userId = this.selectedMember.user.id;
    this.peerForm.loadCommunityMembers();
    this.peerViewModel.show();
  }
  fillOriginalBuddies(): void {
    this.buddies = [];
    this.originalBuddies = [];
    if (this.selectedMember.buddies && this.selectedMember.buddies.length > 0) {
      var temp = this.selectedMember.buddies.toString().split(',').join('-');
      var url =
        'mainservice/framework2/forward?api=frameworkservice/framework2/community/membersByUserIds?communityId=' +
        this.communityId +
        ',userIds=' +
        temp;
      this.commonService.get(url).subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.buddies = data['dataArray'];
          this.originalBuddies = data['dataArray'];
        }
      });
    }
  }
  buddyMessage = '';
  loadBuddyDropDown(action: any, member: any): void {
    this.buddyMessage = 'Loading members ...';
    this.buddyLessMembers = [];
    var url =
      'mainservice/framework2/forward?api=frameworkservice/framework2/community/buddylessmembers?communityId=' +
      this.communityId +
      ',excludeUserId=' +
      member.user.id;
    if (action == 'Assign/Remove Buddy')
      url =
        'mainservice/framework2/forward?api=frameworkservice/framework2/community/buddymembers?communityId=' +
        this.communityId +
        ',excludeUserId=' +
        member.user.id;
    this.commonService.get(url).subscribe((data: any) => {
      this.buddyMessage = '';
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.buddyLessMembers = data['dataArray'];
      }
    });
  }
  jobFamilies: any = [];
  loadJobFamily(): void {
    var url = 'mainservice/recruitment2/open/loadJobFamily?parentId=0';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      this.jobFamilies = data['dataArray'];
    });
  }
}
