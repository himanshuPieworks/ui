import { Component, ViewChild } from '@angular/core';
import { mandates } from './mockData';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-talent-dashboard',
  templateUrl: './talent-dashboard.component.html',
  styleUrls: ['./talent-dashboard.component.scss'],
})
export class TalentDashboardComponent {
  @ViewChild('futureFormPopup') futureFormPopup: any;
  @ViewChild('futureForm') futureForm: any;
  @ViewChild('askQuestion') askQuestion: any;
  @ViewChild('replyQuestion') replyQuestion: any;
  @ViewChild('guidePopUp') guidePopUp: any;
  @ViewChild('seekersPopUp') seekersPopUp: any;

  constructor(
    private modalService: BsModalService,
    public commonService: PieworksCommonService,
    private router: Router
  ) {
    this.topBarData();
    this.getMandateData();
    this.getExperts();
    this.getTheQuestionAskedBySeekers();
    this.questionAndAnswers();

    setTimeout(() => {
      this.futureForm.candidate.emailId = this.commonService.user.username;
      this.futureForm.candidate.name = this.commonService.user.name;
      this.loadFuture();

      console.log("Today's date:", this.formattedToday);
      console.log('Date one month from now:', this.formattedOneMonthLater);

      this.getAllEvents();
    }, 500);
  }


  talentTopBarData: any;
  topBarData() {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/talent/getTopBar?emailId=' +
      this.commonService.user.username;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.talentTopBarData = data['dataObject'];
        // console.log(this.talentTopBarData);
      }
    });
  }

  clickOnGuide(){
    this.commonService.navigateTo("fw/talent/connects",undefined);
  }

  whatsappGroup(): void {
    if (this.selectedEvent.link == null) {
      this.commonService.showErrorMessage('Link', 'There No Whatsapp Group');
    } else {
      window.open(this.selectedEvent.link);
    }
  }
  // icon color
  getEventStyle(club: string) {
    const styles: any = {
      'Tech Club': 'blue',
      'Art Club': 'green',
      'Music Club': 'red',
      'Fit Club': 'purple',
      'Book Club': 'orange',
      Theatre: 'yellow',
    };
    return { color: styles[club] || 'black' };
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
      }
    });
  }

  selectedMandate: any;
  applyMandate() {
    if (this.futureForm.candidate.cv != null) {
      Swal.fire({
        title: 'Confirmation required',
        text:
          'Are you sure you want to apply for ' +
          this.selectedMandate.role.name +
          '  ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'rgb(3, 142, 220)',
        cancelButtonColor: 'rgb(243, 78, 78)',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.value) {
          this.applyForMandate();

          Swal.fire({
            title:
              '<strong>Applied for  ' +
              '<b>' +
              this.selectedMandate.role.name +
              '</b>' +
              '</strong>',
            icon: 'success',
            html:
              `
            Thank you for showing your interest in the ` +
              `<b>` +
              this.selectedMandate.role.name +
              `</b>` +
              `, <b>` +
              this.selectedMandate.client.name +
              `</b>` +
              `. If you are meeting the threshold criteria for this role , one of our community members shall reach out to you to understand your career aspiration & discuss the fitment better. Alternatively, meet our community members by attending the events listed.`,
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: `
            <i class="bi bi-hand-thumbs-up-fill"></i> Great!
            `,
            confirmButtonAriaLabel: 'Thumbs up, great!',
          });
        } else {
          
        }
      });
    } else {
      this.commonService.showErrorMessage(
        'Submit',
        'Please go to profile section and update your CV'
      );
    }
  }

  applyForMandate() {
    var url = '/mainservice/recruitment/talent/applyForMandate';
    let futureApply = {
      mandate: this.selectedMandate,
      future: this.futureForm.candidate,
      status: 'applied',
    };
    this.commonService.post(url, futureApply).subscribe((data: any) => {
      if (data['result'] == 200) {
        this.getMandateData();

        this.sendNotificationToTalent();
        this.sendNotificationToPodAndClientAnchor();

        this.commonService.showSuccessMessage(
          'Success',
          'Your response has been marked.'
        );
      } else {
        this.commonService.showErrorMessage(
          'Error',
          'You are not able to apply :('
        );
      }
    });
  }

  sendNotificationToTalent(): void {
    // Notification
    this.commonService.sendNotification(
      this.commonService.user.id,
      'Pod Community of this role is intimated about your interest. Please wait for them to approach you, or you may attend events to meet them & discuss. ',
      '/',
      'Talent',
      1,
      1,
    );
  }

  sendNotificationToPodAndClientAnchor(): void {
    this.commonService.showProcessingIcon();
    let ids = '';
    this.commonService
      .get('mainservice/recruitment/acesResponsible/' + this.selectedMandate.id)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        let acesResponsible = [];
        if (data['result'] === 200) {
          acesResponsible = data['dataArray'];
          console.log(acesResponsible);
          for (var i = 0; i < acesResponsible.length; i++) {
            if (i == 0) {
              ids = acesResponsible[i].user.id;
            } else {
              ids = ids + ',' + acesResponsible[i].user.id;
            }
          }
        }
        if (this.selectedMandate.clientAnchorId) {
          if (ids.length == 0) {
            ids = this.selectedMandate.clientAnchorId + '';
          }
          ids = ids + ',' + this.selectedMandate.clientAnchorId;
        }
        if (this.selectedMandate.standbyClientAnchorId) {
          if (ids.length == 0) {
            ids = this.selectedMandate.standbyClientAnchorId + '';
          }
          ids = ids + ',' + this.selectedMandate.standbyClientAnchorId;
        }
        // alert("notification to pod" + ids)
        // Notification
        this.commonService.sendNotification(
          ids,
          'Talent ' +
            this.commonService.user.name +
            ' has applied for the position ' +
            this.selectedMandate.role.name +
            ' ,' +
            this.selectedMandate.client.name +
            '.Please take necessary action.',
          '/recr/future-detail/' + this.futureForm.candidate.id,
          'COMMUNITY MEMBER',
          1,
          1
        );
      });
  }

  expertPagination = {
    pageNum: 1,
    pageSize: 3,
    next: () => {
      if (this.expertPagination.message.length > 0) {
        var temp = this.expertPagination.message.split(' of ');
        if (parseInt(temp[1]) <= this.expertPagination.pageNum) return;
      }
      this.expertPagination.pageNum = this.expertPagination.pageNum + 1;

      this.getExperts();
    },
    previous: () => {
      if (this.expertPagination.pageNum == 1) return;
      this.expertPagination.pageNum = this.expertPagination.pageNum - 1;
      this.getExperts();
    },
    totalPages: 5,
    message: '',
  };

  experts: any;

  getExperts(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/talent/getExperts?emailId=' +
      this.commonService.user.username +
      ',pageNum=' +
      this.expertPagination.pageNum +
      ',pageSize=' +
      this.expertPagination.pageSize;
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        console.log(data['dataArray']);
        this.experts = data['dataArray'];
        this.expertPagination.totalPages = data['dataObject'];
        this.expertPagination.message = data['message'];
      }
    });
  }

  questionToExpert: any;
  selectedExpert: any;

  askToExpert() {
    var url = '/mainservice/recruitment/talent/seekGuidance';
    let question = {
      expert: this.selectedExpert,
      seeker: this.futureForm.candidate,
      question: this.questionToExpert,
      status: 'New',
    };

    this.commonService.post(url, question).subscribe((data: any) => {
      if (data['result'] == 200) {
        // notification
        this.commonService.sendNotification(
          this.selectedExpert.user.id,
          'Guess what?' +
            this.futureForm.candidate.name +
            'has a burning question that only your expert brain can answer!',
          '/',
          'Talent',
          1,
          1
        );

        this.askQuestion.hide();
        this.questionToExpert = '';

        this.commonService.showSuccessMessage(
          'Success',
          'Your response has been marked.'
        );
      } else {
        this.commonService.showErrorMessage(
          'Error',
          'You are not able to apply :('
        );
      }
    });
  }

  // sending the notification for experts.
  sendNotificationToExperts() {
    // Notification
    this.commonService.sendNotification(
      this.selectedExpert.user.id,
      'Guess what?' +
        this.selectedMandate.role.name +
        ' ,' +
        this.selectedMandate.client.name +
        'has a burning question that only your expert brain can answer!',
      '/',
      'Talent',
      1,
      1
    );
    // var msg =
    //   "Guess what? 'Name of Seeker' has a burning question that only your expert brain can answer!";

    // //recepientName,subject,message1,message2,toEmailId,ccEmailId,bccEmailId,link1,link2,link1Name,link2Name
    // this.commonService.sendMail(
    //   '',
    //   " You've Got a Question from " + '',
    //   msg,
    //   undefined,
    //   'accounts@pieworks.in',
    //   'jewel@pieworks.in',
    //   'anush@pieworks.in',
    //   undefined,
    //   undefined,
    //   undefined,
    //   undefined,
    //   'altlife@pieworks.in'
    // );
  }

  answerToExpertQuestion: any;
  answerToExpert() {
    var url = '/mainservice/recruitment/talent/seekGuidance';

    this.selectedQuestion.answer = this.answerToExpertQuestion;
    this.selectedQuestion.status = 'Answered';

    this.commonService
      .post(url, this.selectedQuestion)
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.replyQuestion.hide();
          this.answerToExpertQuestion = '';
          this.getTheQuestionAskedBySeekers();

          this.commonService.showSuccessMessage(
            'Success',
            'Your response has been marked.'
          );
        } else {
          this.commonService.showErrorMessage(
            'Error',
            'You are not able to apply :('
          );
        }
      });
  }
  rejectByExpert() {
    var url = '/mainservice/recruitment/talent/seekGuidance';

    this.selectedQuestion.status = 'Declined';

    this.commonService
      .post(url, this.selectedQuestion)
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.getTheQuestionAskedBySeekers();

          this.commonService.showSuccessMessage(
            'Success',
            'Your response has been marked.'
          );
        } else {
          this.commonService.showErrorMessage(
            'Error',
            'You are not able to apply :('
          );
        }
      });
  }

  questionsAskedBySeekers: any = [];
  getTheQuestionAskedBySeekers() {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/talent/getPendingQueriesForMe?emailId=' +
      this.commonService.user.username +
      ',pageNum=' +
      1 +
      ',pageSize=' +
      3;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        console.log(data['dataArray']);
        this.questionsAskedBySeekers = data['dataArray'];
      }
    });
  }

  guides: any;
  paginationMessageForGuide = '';
  pageNumForGuide = 1;
  pageSizeForGuide = 3;
  totalPagesForGuide = 0;
  nextForGuide(): void {
    if (this.paginationMessageForGuide.length > 0) {
      var temp = this.paginationMessageForGuide.split(' of ');
      if (parseInt(temp[1]) <= this.pageNumForGuide) return;
    }
    this.pageNumForGuide = this.pageNumForGuide + 1;
    this.questionAndAnswers();
  }
  previousForGuide(): void {
    if (this.pageNumForGuide == 1) return;
    this.pageNumForGuide = this.pageNumForGuide - 1;
    this.questionAndAnswers();
  }

  questionAndAnswers(): any {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/talent/getMyInteractions?emailId=' +
      this.commonService.user.username +
      ',pageNum=' +
      this.pageNumForGuide +
      ',pageSize=' +
      this.pageSizeForGuide;
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.guides = data['dataArray'];
        this.paginationMessageForGuide = data['message'];
        this.totalPagesForGuide = data['dataObject'];
      }
    });
  }

  indexes: any = [];
  tempData: any = [];
  fromDate: any;
  changedCarosel(event: any): void {
    //0 = > 0,2
    //1 => 3,5
    //2 => 6,8
    //3 => 9,11

    let startIndex = event == 0 ? 0 : event * 3;
    let endIndex = startIndex + 3;
    this.tempData = [];
    this.tempData = this.mandates.slice(startIndex, endIndex);

    console.log(this.tempData);

    // for (var i = 0; i < this.tempData.length; i++) {
    //   this.fromDate = this.commonService.getJsDateObject(
    //     this.tempData[i].modifiedOn
    //   );
    //   this.tempData[i].fromDate = this.commonService.getDaysBetween(
    //     this.fromDate,
    //     new Date()
    //   );
    // }
  }

  // Function to format date in the desired format
  formatDate(date: Date): string {
    // Get ISO string representation of the date
    let isoString: string = date.toISOString();
    // Extract the date part and add the timezone offset
    return isoString.substring(0, 10) + 'T00:00:00' + '+05:30';
  }

  // Get today's date
  today: Date = new Date();

  // Get the date one month from now
  oneMonthLater: Date = new Date(
    this.today.getFullYear(),
    this.today.getMonth() + 1,
    this.today.getDate()
  );

  // Format today's date and the date one month from now
  formattedToday: string = this.formatDate(this.today);
  formattedOneMonthLater: string = this.formatDate(this.oneMonthLater);

  paginationMessage = '';
  pageNum = 1;
  pageSize = 3;
  totalPages = 0;
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
    this.getAllEvents();
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
    this.getAllEvents();
  }
  first(): void {
    this.pageNum = 1;
    this.getAllEvents();
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
    this.getAllEvents();
  }

  allEvents: any;
  getAllEvents(): void {
    this.commonService
      .get(
        'mainservice/framework/event/showByDateRange?startDate=' +
          this.formattedToday +
          '&endDate=' +
          this.formattedOneMonthLater +
          '&userId=' +
          this.commonService.user.id +
          '&getMembers=' +
          'true' +
          '&pageNum=' +
          this.pageNum +
          '&pageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.allEvents = data['dataArray'];

          this.totalPages = data['dataObject'];
          this.paginationMessage = data['message'];

          // const filteredEvents = this.allEvents.filter(
          //   (data: any) => data.club !== null
          // );

          // this.allEvents = filteredEvents;

          for (let i = 0; i < this.allEvents.length; i++) {
            if (this.allEvents[i].iamAttending) {
              this.allEvents[i].selectedOption = true;
            } else {
              this.allEvents[i].selectedOption = false;
            }
          }
        } else {
        }
      });
  }
  selectedQuestion: any;
  mandates: any;
  getMandateData(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/talent/getMandates?emailId=' +
      this.commonService.user.username +
      ',pageNum=1,pageSize=1000';
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.mandates = data['dataArray'];

        let length = this.mandates.length / 3;
        if (this.mandates % 3 != 0) length = length + 1;
        this.indexes = [];
        for (let i = 0; i < length; i++) {
          this.indexes.push(i);
        }
        this.changedCarosel(0);
      }
    });
  }

  // event yes no

  selectedEvent: any;

  onSelectChange(event: any): void {
    //this.selectedOption = event.target.value;
    setTimeout(() => {
      // alert(this.selectedOption);
      if (event.selectedOption == true) {
        this.joiningEvent();
      } else {
        this.removeMyJoining();
      }
    }, 500);
  }

  joiningEvent(): void {
    Swal.fire({
      title: 'Confirmation required',
      text:
        'Are you sure you want to join ' +
        this.selectedEvent.title +
        ' event ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.joiningMember();
      } else {
        this.selectedEvent.selectedOption = !this.selectedEvent.selectedOption;
      }
    });
  }

  joinEvent: any = {};
  joiningMember(): void {
    var url = 'mainservice/framework/eventUserList/save';

    let userEventMap = {
      userId: this.commonService.user,
      eventId: this.selectedEvent,
    };

    this.commonService.post(url, userEventMap).subscribe((data: any) => {
      if (data['result'] == 200) {
        // if (this.event.link != null) {
        //   window.open(this.allEvents.link);
        // }

        this.commonService.showSuccessMessage(
          'Success',
          'Your response has been marked.'
        );

        this.getAllEvents();
      } else {
        this.commonService.showErrorMessage(
          'Error',
          'You are not able to join :('
        );
      }
    });
  }

  removeMyJoining(): void {
    Swal.fire({
      title: 'Confirmation required',
      text:
        'Are you sure you do not want to join ' +
        this.selectedEvent.title +
        ' event ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.removingMember();
      } else {
        this.selectedEvent.selectedOption = !this.selectedEvent.selectedOption;
      }
    });
  }
  removingMember(): void {
    var url =
      'mainservice/framework/eventUserList/removeEventUserList/' +
      this.commonService.user.id;
    this.commonService.post(url, this.selectedEvent).subscribe((data: any) => {
      if (data['result'] == 200) {
        // this.eventDetails.hide();
        this.commonService.showSuccessMessage(
          'Success',
          'Your response has been marked.'
        );
        this.getAllEvents();
      } else {
        this.commonService.showErrorMessage(
          'Error',
          'You are not able to join :('
        );
      }
    });
  }

  paginationMessageForSeeker = '';
  pageNumForSeeker = 1;
  pageSizeForSeeker = 3;
  totalPagesForSeeker  = 0;
  nextSeeker(): void {
    if (this.paginationMessageForSeeker .length > 0) {
      var temp = this.paginationMessageForSeeker.split(' of ');
      if (parseInt(temp[1]) <= this.pageNumForSeeker ) return;
    }
    this.pageNumForSeeker  = this.pageNumForSeeker  + 1;
    this.clickOnSeekers();
  }
  previousSeeker(): void {
    if (this.pageNumForSeeker== 1) return;
    this.pageNumForSeeker = this.pageNumForSeeker  - 1;
    this.clickOnSeekers();
  }


  seekers:any;
  clickOnSeekers():void
  {
    var url ='mainservice/framework2/forward?api=recruitmentservice/talent/getAllQueriesForMe?emailId='+this.commonService.user.username+',pageNum='+this.pageNumForSeeker+',pageSize='+this.pageSizeForSeeker;

    this.commonService.get(url).subscribe((data:any)=>{
      if (data['result'] === 200) {
        
        
        this.seekers = data['dataArray'];
        this.paginationMessageForSeeker = data['message'];
        this.totalPagesForSeeker = data['dataObject']
        // console.log(this.talentTopBarData);
        this.seekersPopUp.show();
      }
    });
  }

  truncateString(inputString: string, maxLength: number): string {
    if(!inputString)
      return inputString;
  if (inputString.length <= maxLength) {
    return inputString;
  } else {
    return inputString.substring(0, maxLength) + '...';
  }
}
}
