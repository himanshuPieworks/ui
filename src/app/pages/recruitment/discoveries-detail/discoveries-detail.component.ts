import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discoveries-detail',
  templateUrl: './discoveries-detail.component.html',
  styleUrls: ['./discoveries-detail.component.scss'],
})
export class DiscoveriesDetailComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Discoveries', link: '/recr/discoveries', active: false },
    ];
  }

  isDiscovery: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    this.requirementId = this.route.snapshot.paramMap.get('reqId');
    if (this.requirementId == undefined || this.requirementId == 'undefined')
      this.requirementId = -1;
    if (this.requirementId <= 0) this.isDiscovery = false;
    this.shortlistId = this.route.snapshot.paramMap.get('discId');
    this.urlPrefix = this.commonService.urlPrefix;
    this.myId = parseInt(this.commonService.user.id + '');
    this.loadShortlistingDetail();
    this.loadDiscussions();
    this.loadFeedbacks();
    this.loadRemarks();
    this.loadMyMembership();
    // this.loadAcesResponsible();
    this.reqLink = '/recr/wp/' + this.requirementId;
  }

  daysSinceDiscovery: any = 0;
  myId: any = 0;
  reqLink: any = '';
  candidate: any = {};
  shortlistId: any;
  urlPrefix: any = '';
  shortlist: any = {};
  requirementId: any;
  amIClientAnchor: any = false;

  previousStatus: string = '';
  loadCandidateDetails(): void {
    var url = 'mainservice/recruitment2/candidate/' + this.shortlistId;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.candidate = data['dataObject'];

        this.shortlist = {};
        this.shortlist.candidate = this.candidate;
        console.log('I m details.' + this.shortlist.candidate);
        if (this.candidate.currentCtcTotal == 0)
          this.candidate.currentCtcTotal =
            this.candidate.currentCtcFixed + this.candidate.currentCtcVariable;
        this.daysSinceDiscovery = this.commonService.getDaysBetween(
          this.candidate.createdOn,
          new Date()
        );
      }
    });
  }
  candidateDipstics(): void
  {
    window.open(
      this.commonService.uiPrefix +
        'fw/open/candidate-survey/'+this.shortlistId,
      '_blank'
    );
  }


  loadShortlistingDetail(): void {
    if (this.requirementId == -1) {
      this.loadCandidateDetails();
      this.loadCommunityMembers();
      this.loadStatus();
      return;
    }
    var url =
      'mainservice/recruitment/shortlisting/shortlist/' +
      this.requirementId +
      '/' +
      this.shortlistId;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.shortlist = data['dataObject'];
        this.previousStatus = this.shortlist.status.name;
        if (this.shortlist.candidate.currentCtcTotal == 0)
          this.shortlist.candidate.currentCtcTotal =
            this.shortlist.candidate.currentCtcFixed +
            this.shortlist.candidate.currentCtcVariable;
        if (
          this.shortlist.requirement.clientAnchorId ==
            this.commonService.user.id ||
          this.shortlist.requirement.standbyClientAnchorId ==
            this.commonService.user.id
        )
          this.amIClientAnchor = true;
        else this.amIClientAnchor = false;
        this.loadCommunityMembers();
        var createdDate = this.commonService.getJsDateObject(
          this.shortlist.createdOn
        );

        if (createdDate) {
          this.daysSinceDiscovery = this.commonService.getDaysBetween(
            createdDate,
            new Date()
          );
        } else {
          // Handle the case where createdDate is undefined
          console.error('createdDate is undefined');
        }
        this.loadStatus();
        this.loadJustificiations();
      }
    });
  }
  acesResponsible: any;
  podMembers: any = [];
  loadAcesResponsible(): void {
    this.users = [];
    this.commonService.showProcessingIcon();

    this.commonService
      .get('mainservice/recruitment/acesResponsible/' + this.requirementId)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.acesResponsible = [];
        if (data['result'] === 200) {
          this.acesResponsible = data['dataArray'];

          console.log(this.acesResponsible);
        }
      });
  }

  discussions: any = [];
  feedbacks: any = [];
  getTwoDigit(number: any) {
    if (number.toString().length == 1) return '0' + number;
    else return number;
  }
  justifications: any = [{}, {}, {}];
  loadDiscussions(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment/shortlisting/discussion/' + this.shortlistId
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.discussions = data['dataArray'];
        }
      });
  }
  loadFeedbacks(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment/shortlisting/clientfeedback/' +
          this.shortlistId
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.feedbacks = data['dataArray'];
        }
      });
  }
  loadJustificiations(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment/shortlisting/justification/' + this.shortlistId
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.justifications = data['dataArray'];
          if (!this.justifications) {
            this.justifications = [];
          }
          var today = new Date();
          while (this.justifications.length < 3) {
            this.justifications.push({
              recruitmentShortlisting: this.shortlist,
              justification: ' ',
              date:
                today.getFullYear() +
                '-' +
                this.getTwoDigit(today.getMonth() + 1) +
                '-' +
                this.getTwoDigit(today.getDate()),
            });
          }
        }
      });
  }
  // goBack(): void {
  //   this._location.back();
  // }
  editStatus: any = false;
  edit: any = {};
  editNoticePeriod: any = false;
  editValueElement: any = false;
  editEsop: any = false;
  editDiscussion: any = false;
  editClientFeedBack: any = false;
  editJustification: any = false;
  status: any = [];
  confirmStatusChange(): void {
    setTimeout(() => {
      Swal.fire({
        title: 'Confirmation required',
        text:
          'Are you sure you want to update the status to ' +
          this.shortlist.status.name +
          ' ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(3, 142, 220)',
        cancelButtonColor: 'rgb(243, 78, 78)',
        confirmButtonText: 'Yes',
      }).then((result: any) => {
        if (result.value) {
          this.updateDiscovery();
          this.edit.status = false;
        }
      });
    }, 300);
  }

  offerToNurtureCandidate(): void {
    // Swal.fire({
    //   title: '',
    //   text: "Thats unfortunate, the talent didn't get through. Would you like to mark him/her for nurture ?",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: 'rgb(3, 142, 220)',
    //   cancelButtonColor: 'rgb(243, 78, 78)',
    //   confirmButtonText: 'Yes',
    // }).then((result: any) => {
    //   if (result.value) {
    //     
    //   }
    // });
    this.shortlist.candidate.nurture = true;
        this.edit.status = false;
    this.updateCandidate(this.shortlist.candidate);
  }
  loadStatus(): void {
    if (this.requirementId < 1) {
      return;
    }
    this.status = [];

    var url =
      'mainservice/recruitment/shortlisting/status?currentStatus=' +
      this.shortlist.status.id;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.status = data['dataArray'];
      }
    });
    this.loadProcesses();
  }
  message: any;
  updateSideCandidate(): void {
    // if(this.candidate["expectedCtc"]==undefined || (this.candidate["expectedCtc"] && this.candidate["expectedCtc"]>500))
    // {
    //     this.message = "Please enter expected CTC of the candidate in LPA";
    //     this.commonService.showErrorMessage("Error",this.message);
    //     return;
    // }
    // if(this.candidate["currentCtcTotal"] && this.candidate["currentCtcTotal"]>500)
    // {
    //     this.message = "Please enter current CTC of the candidate in LPA";
    //     this.commonService.showErrorMessage("Error",this.message);
    //     return;
    // }
    // this.message = "Saving....";
    // if(this.candidate["experience"]==undefined || this.candidate["experience"]<0)
    //     this.candidate["experience"]=undefined;
    this.commonService.showProcessingIcon();

    this.commonService
      .post('mainservice/recruitment2/candidate', this.candidate)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.loadCandidateDetails();
        this.commonService.showInfoMessage('info', 'Updated done :)');
      });
  }
  updateDiscovery(): void {
    if (!this.shortlist.status) {
      this.commonService.showErrorMessage('Error', 'Status not selected.');
      return;
    }
    if (this.shortlist.joinedAtCtc && this.shortlist.joinedAtCtc < 100000) {
      this.commonService.showErrorMessage(
        'Error',
        'Joined at CTC to be mentioned in actual figures ex: 1000000'
      );
      return;
    }
    if (this.shortlist.status.id == 13) {
      if (!this.shortlist.doj) {
        this.commonService.showErrorMessage(
          'Error',
          'Please mention the tentative date of joining of the candidate.'
        );
        return;
      }
    }
    if (this.shortlist.status.id == 12 || this.shortlist.status.id == 17) {
      if (!this.shortlist.joinedAtCtc) {
        this.commonService.showErrorMessage(
          'Error',
          'Please mention joined at CTC in actual figures ex: 1000000'
        );
        return;
      }
      if (!this.shortlist.doj) {
        this.commonService.showErrorMessage(
          'Error',
          'Please mention the date of joining of the candidate.'
        );
        return;
      }
      if (!this.shortlist.candidateInteractorId) {
        this.commonService.showErrorMessage(
          'Error',
          'Please mention who has done the candidate interaction.'
        );
        return;
      }
    }
    this.editStatus = false;
    this.commonService.showProcessingIcon();
    this.commonService.showInfoMessage('Info', 'Processing request');
    this.commonService
      .post('mainservice/recruitment/shortlisting/shortlist', this.shortlist)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.loadShortlistingDetail();
        if (data['result'] == 200) {
          if (this.previousStatus !== this.shortlist.status.name) {
            if (
              this.shortlist.status.id == 3 ||
              this.shortlist.status.id == 4 ||
              this.shortlist.status.id == 22 ||
              this.shortlist.status.id == 7 ||
              this.shortlist.status.id == 5 ||
              this.shortlist.status.id == 18 ||
              this.shortlist.status.id == 15 ||
              this.shortlist.status.id == 14 ||
              this.shortlist.status.id == 20 ||
              this.shortlist.status.id == 11
            ) {
              //for negative status updates, ask if the candidate needs to be marked for nurture or not.
              this.offerToNurtureCandidate();
            }
            var link =
              '/recr/discoveryDetails/' +
              this.shortlist.requirement.id +
              '/' +
              data['dataObject'].id;
            var message =
              'Discovery status of candidate ' +
              this.shortlist.candidate.name +
              ' for the role ' +
              this.shortlist.requirement.role.name +
              ' for ' +
              this.shortlist.requirement.client.name +
              ' has changed to ' +
              this.shortlist.status.name +
              '.';
            if (
              this.member &&
              this.member.acceptanceByAce === 1 &&
              this.member.acceptanceByAceMaker === 1
            ) {
              
              this.commonService.sendNotification(
                this.shortlist.createdBy.id + '',
                message,
                link,
                'COMMUNITY MEMBER',
                1,
                1,
                1
              );
            }
            var anchor = this.getMemberFromUserId(
              this.shortlist.requirement.standbyClientAnchorId
            );
            if (
              anchor &&
              anchor.acceptanceByAce === 1 &&
              anchor.acceptanceByAceMaker === 1 &&
              this.myId !== this.shortlist.requirement.standbyClientAnchorId
            )
              this.commonService.sendNotification(
                this.shortlist.requirement.standbyClientAnchorId + '',
                message,
                link,
                'COMMUNITY MEMBER',
                1,
                1,
                1
              );
            anchor = this.getMemberFromUserId(
              this.shortlist.requirement.clientAnchorId
            );
            if (
              anchor &&
              anchor.acceptanceByAce === 1 &&
              anchor.acceptanceByAceMaker === 1 &&
              this.myId != this.shortlist.requirement.clientAnchorId
            )
              this.commonService.sendNotification(
                this.shortlist.requirement.clientAnchorId + '',
                message,
                link,
                'COMMUNITY MEMBER',
                1,
                1,
                1
              );
          }
          this.edit.dateOfJoining = false;
          this.edit.joinedCtc = false;
          this.edit.candidateInteractor = false;
          this.commonService.showInfoMessage('Info', 'Updation successful.');
        } else {
          this.commonService.showInfoMessage('Info', data['message']);
        }
      });
  }
  getMemberFromUserId(userId: any): any {
    for (var i = 0; i < this.members.length; i++) {
      if (this.members[i].user.id == userId) return this.members[i];
    }
    return undefined;
  }
  editExperience = false;
  updateCandidate(candidate: any): void {
    if (candidate['experience'] == undefined || candidate['experience'] < 0)
      candidate['experience'] = undefined;
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment2/candidate', candidate)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.editExperience = false;
        this.edit.expectedCtc = false;
        this.edit.fixedCtc = false;
        this.edit.totalCtc = false;
        this.commonService.showInfoMessage('Info', 'Updation successful.');
      });
  }
  updateDiscussions(): void {
    for (var i = 0; i < this.discussions.length; i++) {
      this.discussions[i]['recruitmentShortlisting'] = this.shortlist;
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment/shortlisting/discussion', this.discussions)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        //this.message = data["message"];
        if (data['result'] == 200) {
          this.editDiscussion = false;
          this.commonService.showInfoMessage('Info', 'Updation successful.');
        }
        this.loadDiscussions();
      });
  }
  discussion: any = '';
  addDiscussion(): void {
    var today = new Date();

    this.discussions.push({
      discussion: this.discussion,
      date:
        today.getFullYear() +
        '-' +
        this.getTwoDigit(today.getMonth() + 1) +
        '-' +
        this.getTwoDigit(today.getDate()),
    });
    this.discussion = '';
  }
  removeDiscussion(obj: any) {
    for (var i = 0; i < this.discussions.length; i++) {
      if (obj === this.discussions[i]) {
        this.discussions.splice(i, 1);
        break;
      }
    }
  }
  feedback: any = '';
  addFeedback(): void {
    var today = new Date();

    this.feedbacks.push({
      feedback: this.feedback + " ("+ this.commonService.user.name.split(' ')[0] + ")",
      date:
        today.getFullYear() +
        '-' +
        this.getTwoDigit(today.getMonth() + 1) +
        '-' +
        this.getTwoDigit(today.getDate()),
    });
    this.feedback = '';
  }
  removeFeedback(obj: any) {
    for (var i = 0; i < this.feedbacks.length; i++) {
      if (obj === this.feedbacks[i]) {
        this.feedbacks.splice(i, 1);
        break;
      }
    }
  }
  updateFeedbacks(): void {
    for (var i = 0; i < this.feedbacks.length; i++) {
      this.feedbacks[i]['recruitmentShortlisting'] = this.shortlist;
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post(
        'mainservice/recruitment/shortlisting/clientfeedback',
        this.feedbacks
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.editClientFeedBack = false;
        this.commonService.showInfoMessage('Info', 'Updation successful.');        
        var link =
        '/recr/discoveryDetails/' +
        this.shortlist.requirement.id +
        '/' +
        data['dataObject'].id;
        var message =' The client has given the feedback on the candidate  as - ' +
        this.feedbacks[0].feedback;
        this.commonService.sendNotification(
          this.shortlist.createdBy.id + '',
          message,
          link,
          'COMMUNITY MEMBER',
          1,
          1,
          1
        );    
            
      });
  }
  updateJustificiations(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post(
        'mainservice/recruitment/shortlisting/justification',
        this.justifications
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.editJustification = false;
          this.commonService.showInfoMessage('Info', 'Updation successful.');
        }
        this.loadJustificiations();
      });
  }
  justification: any;
  addJustification(): void {
    var today = new Date();

    this.justifications.push({
      justification: this.justification,
      date:
        today.getFullYear() +
        '-' +
        this.getTwoDigit(today.getMonth() + 1) +
        '-' +
        this.getTwoDigit(today.getDate()),
    });
    this.justification = '';
  }

  // Remove Justification
  removeJustification(obj: any) {
    for (var i = 0; i < this.justifications.length; i++) {
      if (obj === this.justifications[i]) {
        this.justifications.splice(i, 1);
        break;
      }
    }
  }
  member: any = {};
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
        if (this.member.isAceMaker) {
          this.amIAceMaker = true;
        }
        //this.loadMyProfile();
      });
  }
  // Load Community Member
  members: any = [];
  otherMembersId: any = '';
  users: any = [];
  loadCommunityMembers(): void {
    this.commonService.showProcessingIcon();
    var acceptanceByAceValues = '1';
    var acceptanceByAceMakerValues = '1';
    this.commonService
      .get(
        'mainservice/framework/members2/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=' +
          acceptanceByAceValues +
          '&searchText=' +
          this.memberSearch +
          '&acceptanceByAceMakerValues=' +
          acceptanceByAceMakerValues +
          '&userId=-1' +
          '&pageNum=1' +
          '&pageSize=10&approvedOnMonth=&jobFamily='
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.members = data['dataArray'];
          this.users = [];
          for (var i = 0; i < this.members.length; i++) {
            this.users.push(this.members[i].user);
          }
          if (!this.members || this.members.length == 0) {
            this.members = [];
            this.checkIfIamAceMaker();
            return;
          }
          this.checkIfIamAceMaker();
          for (var i = 0; i < this.members.length; i++) {
            if (
              this.shortlist.candidateInteractorId &&
              this.shortlist.candidateInteractorId == this.members[i].user.id
            ) {
              this.candidateInteractor = this.members[i].user.name;
            }
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
            } else {
              this.myMembership = this.members[i];
            }
          }
        }
        this.addCandidateInteractoryUserObj();
      });
  }
  addCandidateInteractoryUserObj(): void {
    if (!this.shortlist.candidateInteractorId) return;
    this.commonService
      .get(
        'mainservice/framework/members2/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=1,2,3,4,5,6,7,8,9' +
          '&searchText=' +
          this.memberSearch +
          '&acceptanceByAceMakerValues=1,2,3,4,5,6,7,8,9' +
          '&userId=' +
          this.shortlist.candidateInteractorId +
          '&pageNum=1' +
          '&pageSize=10&approvedOnMonth=&jobFamily='
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.members = data['dataArray'];
          if (this.members.length > 0) {
            this.users.push(this.members[0].user);
            this.candidateInteractor = this.members[0].user.name;
          }
        }
      });
  }

  // Check If I am ace Maker
  myMembership: any;
  candidateInteractor: any = '';
  amIAceMaker: any = false;
  checkIfIamAceMaker(): void {
    this.amIAceMaker = false;
    for (var i = 0; i < this.members.length; i++) {
      if (
        this.members[i].isAceMaker &&
        this.members[i].id.userId == this.commonService.user.id
      ) {
        this.amIAceMaker = true;
        //break;
      }
      if (this.shortlist.requirement && this.members[i].user.id == this.shortlist.requirement.clientAnchorId)
        this.shortlist.requirement.clientAnchor = this.members[i].user; //this is required as the obj reference also must be same for the data to get binded at UI
    }
  }

  // Add Remark
  remarkTemp: any;
  remarks: any = [];
  editRemark: any = false;
  addRemark(): void {
    if (!this.remarkTemp || this.remarkTemp.length === 0) return;
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
          remark: temp2[j],
          category: 'recruitment-discovery',
          categoryId: this.shortlistId,
          createdBy: this.commonService.user.id,
        };
        this.remarks.push(remarkObj);
        this.saveRemark(remarkObj);
      }
    }
    this.remarkTemp = '';
  }

  // Remove Remark
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
          this.commonService.showInfoMessage('Info', 'Updation successful.');
          return;
        } else {
          this.loadRemarks();
        }
      });
  }

  // save Remark
  saveRemark(remarkObj: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/generic/remark', remarkObj)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.loadRemarks();
          this.editRemark = false;

          // alert(this.shortlist.createdBy.id)
          // Notification
          this.commonService.sendNotification(
            this.shortlist.createdBy.id,
            'Account Manager Remarks have been updated for ' +
              this.shortlist.candidate.name,
            '/recr/discoveryDetails/' +
              this.requirementId +
              '/' +
              this.shortlistId,
            'COMMUNITY MEMBER',
            1,
            1,
            1
          );
          this.commonService.showInfoMessage('Info', 'Updation successful.');
          return;
        } else {
          this.loadRemarks();
        }
      });
  }

  // Load Remarks api
  loadRemarks() {
    this.remarks = [];
    var url =
      'mainservice/framework/generic/remark/' +
      this.shortlistId +
      '?category=recruitment-discovery';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.remarks = data['dataArray'];
      }
    });
  }
  // nudge Account Manager
  nudgeClientAnchor(): void {
    this.commonService.showConfirmWindow(
      'Confirmation',
      'Are you sure you want to nudge Account Manager for the updates on this discovery ?',
      () => {
        var link =
          '/community/' +
          localStorage.getItem('communityId') +
          '/domain/recruitment/requirements/' +
          this.shortlist.requirement.id +
          '/shortlisting/' +
          this.shortlist.id;
        var userIds;
        if (this.shortlist.requirement.clientAnchor)
          userIds = this.shortlist.requirement.clientAnchor.id;
        if (this.shortlist.requirement.standbyClientAnchor) {
          if (!userIds)
            userIds = this.shortlist.requirement.standbyClientAnchor.id;
          else
            userIds =
              userIds + ',' + this.shortlist.requirement.standbyClientAnchor.id;
        }
        var message =
          this.myMembership.user.name +
          ' would like to know the updates on the discovery ' +
          this.shortlist.candidate.name +
          ' for ' +
          this.shortlist.requirement.role.name +
          ', ' +
          this.shortlist.requirement.client.name +
          '. Please update the status of the discovery on the portal.';
        this.commonService.sendNotification(
          userIds,
          message,
          link,
          'COMMUNITY MEMBER',
          2,
          1
        );
        this.commonService.showInfoMessage(
          'Info',
          'The Account Manager has been nudged to update the status of this discovery. We will update you once the status is updated.'
        );
      },
      undefined
    );
  }
  processes: any = [];
  loadProcesses(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment3/requirement/open/process/' +
          this.shortlist.requirement.id
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.processes = [];
        if (data['result'] === 200) {
          this.processes = data['dataArray'];
        }
      });
  }

  memberSearch: any = '';
  onMemberSearch(item: any) {
    this.memberSearch = item.term;
    this.loadCommunityMembers();
  }

  // when client is already loaded locally then this method made it local search
  memberLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }
}
