import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-candidates-tracker',
  templateUrl: './candidates-tracker.component.html',
  styleUrls: ['./candidates-tracker.component.scss'],
  animations: [
    trigger('filterAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateX(-100%)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('void => *', [animate('300ms ease-in-out')]),
      transition('* => void', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class CandidatesTrackerComponent {
  breadCrumbItems!: Array<{}>;
  @ViewChild('updateStatusModal') updateStatusModal: any;
  @ViewChild('seeJustification') seeJustification: any;
  @ViewChild('clientFeedbackModal') clientFeedbackModal: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Tracker', link: '/fw/client/tracker', active: true },
    ];

    this.reqIds = this.route.snapshot.paramMap.get('reqIds') + '';
    this.statusIds = this.route.snapshot.paramMap.get('statusIds') + '';
    this.showStatusIds = this.route.snapshot.paramMap.get('statusIds') + '';

    setTimeout(() => {
      this.getCandidateData();
    }, 500);
    this.urlPrefix = this.commonService.urlPrefix;
    this.loadStatusArray();
  }
  urlPrefix: any = '';
  statusIds: string;
  reqIds: string;
  searchText: any = '';
  candidates: any = [];
  showStatusIds: any;
  getCandidateData() {
    let clientIds = this.commonService.clientIds
      .toString()
      .split(',')
      .join('-');
    let url =
      'mainservice/framework2/forward?api=recruitmentservice/client/allCandidates?clientIds=' +
      clientIds +
      ',reqIds=' +
      this.reqIds +
      ',searchText=' +
      this.searchText;

    if (this.statusIds != '-1') url = url + ',statusIds=' + this.statusIds;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.candidates = data['dataArray'];
        // Load justifications for each candidate
        this.candidates.forEach((candidate: any) => {
          this.loadJustifications(candidate);
        });
        this.candidates.forEach((candidate: any) => {
          this.loadFeedbacks(candidate);
        });
      }
    });
  }

  truncateString(inputString: string, maxLength: number): string {
    // console.log("Hi i am at truncateString")
    if (!inputString) return inputString;
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.substring(0, maxLength) + '...';
    }
  }
  showFilter: any = false;
  editClientFeedBack: any = false;
  selectedCandidate: any = {};
  updateStatus() {
    if (this.selectedCandidate.status.id == 6) {
      this.selectedCandidate.status.name = 'New';
    }
    if (this.selectedCandidate.status.id == 7) {
      this.selectedCandidate.status.name = 'Validation Drop';
    }
    this.updateStatusModal.show();
    this.loadStatus();
  }

  status: any = [];
  loadStatus(): void {
    if (this.selectedCandidate.status.id < 1) {
      return;
    }
    this.status = [];

    var url =
      'mainservice/recruitment/shortlisting/status?currentStatus=' +
      this.selectedCandidate.status.id;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.status = data['dataArray'];
        for (let i = 0; i < this.status.length; ) {
          if (this.status[i].id == 6) {
            alert('hello');
            this.status[i].name = 'New';
          }

          i++;
        }
      }
    });
    this.loadProcesses();
  }
  processes: any = [];
  loadProcesses(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment3/requirement/open/process/' +
          this.selectedCandidate.requirement.id
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.processes = [];
        if (data['result'] === 200) {
          this.processes = data['dataArray'];
        }
      });
  }

  loadJustifications(candidate: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/recruitment/shortlisting/justification/' + candidate.id)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          let justifications = data['dataArray'];
          if (!justifications) {
            justifications = [];
          }
          var today = new Date();
          while (justifications.length < 3) {
            justifications.push({
              recruitmentShortlisting: candidate.requirement.id,
              justification: ' ',
              date:
                today.getFullYear() +
                '-' +
                this.getTwoDigit(today.getMonth() + 1) +
                '-' +
                this.getTwoDigit(today.getDate()),
            });
          }
          for (let i = 0; i < justifications.length; i++) {
            justifications[i].justificationShort = this.truncateString(
              justifications[i].justification,
              80
            ).trim();
          }

          candidate.candidateJustification = justifications;

          // console.log(candidate.candidateJustification);
        }
        // Append justifications to candidate
      });
  }
  justifications: any;
  loadFullJustification(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment/shortlisting/justification/' +
          this.selectedCandidate.id
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.justifications = data['dataArray'];
          if (!this.justifications) {
            this.justifications = [];
          }
          // var today = new Date();
          // while (this.justifications.length < 3) {
          //   this.justifications.push({
          //     recruitmentShortlisting: this.selectedCandidate.requirement.id,
          //     justification: ' ',
          //     date:
          //       today.getFullYear() +
          //       '-' +
          //       this.getTwoDigit(today.getMonth() + 1) +
          //       '-' +
          //       this.getTwoDigit(today.getDate()),
          //   });
          // }
        }
      });
  }

  statusArray: any = [];
  loadStatusArray(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/recruitment/shortlisting/status?currentStatus=-1')
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.statusArray = data['dataArray'];
          for (let i = 0; i < this.statusArray.length; ) {
            if (this.statusArray[i].id < 6) {
              this.statusArray.splice(i, 1);
              // continue;
            }
            if (this.statusArray[i].id == 6) {
              this.statusArray[i].name = 'New';
            }
            if (this.statusArray[i].id == 7) {
              this.statusArray[i].name = 'Validation Drop';
            }

            i++;
          }
        }
      });
  }

  getBgStyle(status: string) {
    const styles: any = {
      s2c: '#EF6471',
      exploratorycall: '#5B73FF',
      'offer acceptd': '#22CAAD',
      'offer made': '#22CAAD',
      intrv: '#A064D9',
      joined: '#22CAAD',
      New: '#EF6471',
      'offer sent': '#22CAAD',
      select2adv: '#F98550',
    };
    return { 'background-color': styles[status] || 'transparent' };
  }

  getBgTranStyle(status: string) {
    const styles: any = {
      s2c: '#FEECEE',
      exploratorycall: '#EBEEFF',
      'offer acceptd': '#E9FAF7',
      'offer made': '#E9FAF7',
      intrv: '#F4ECFB',
      joined: '#E9FAF7',
      New: '#FEECEE',
      'offer sent': '#E9FAF7',
      select2adv: '#FFF0EA',
    };
    return { 'background-color': styles[status] || 'transparent' };
  }

  viewAndEditFeedback() {
    this.fullClientFeedback();
    this.clientFeedbackModal.show();
  }
  feedbacks: any;
  fullClientFeedback(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment/shortlisting/clientfeedback/' +
          this.selectedCandidate.id
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.feedbacks = data['dataArray'];
        }
      });
  }

  loadFeedbacks(candidate: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment/shortlisting/clientfeedback/' + candidate.id
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          let feedbacks = data['dataArray'];

          // Append justifications to candidate
          candidate.candidateFeedback = feedbacks;
        }
      });
  }

  getTat(date: Date): any {
    let last = this.commonService.getJsDateObject(date);
    let today = new Date();

    let daysAgo = this.commonService.getDaysBetween(last, today);

    return daysAgo;
  }

  arrayStatus: number[] = [];
  filterChanged() {
    this.statusIds = this.arrayStatus.join('-');
    if (this.statusIds == '') {
      this.statusIds = '-1';
    }
    this.getCandidateData();
  }

  showJustification() {
    this.loadFullJustification();
    this.seeJustification.show();
  }
  getTwoDigit(number: any) {
    if (number.toString().length == 1) return '0' + number;
    else return number;
  }

  // update justification
  updateJustifications(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post(
        'mainservice/recruitment/shortlisting/justification',
        this.justifications
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.commonService.showInfoMessage('Info', 'Updation successful.');
        }
        // this.loadJustifications();
      });
  }

  feedback: any = '';
  addFeedback(): void {
    var today = new Date();

    this.feedbacks.push({
      feedback: this.feedback + " ("+ this.commonService.user.name.split(' ')[0]+ ")",
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
      this.feedbacks[i]['recruitmentShortlisting'] = this.selectedCandidate;
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post(
        'mainservice/recruitment/shortlisting/clientfeedback',
        this.feedbacks
      )
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.commonService.hideProcessingIcon();
          // this.editClientFeedBack = false;
          this.commonService.showInfoMessage('Info', 'Updated successful.');
          this.getCandidateData();

          var link =
            '/recr/discoveryDetails/' +
            this.selectedCandidate.requirement.id +
            '/' +
            data['dataObject'].id;
          var message =
            'Discovery status of candidate ' +
            this.selectedCandidate.candidate.name +
            ' for the role ' +
            this.selectedCandidate.requirement.role.name +
            ' for ' +
            this.selectedCandidate.requirement.client.name +
            ' has changed to ' +
            this.selectedCandidate.status.name +
            '.';

          if (this.feedbacks && this.feedbacks.length > 0) {
            var feedbks = '';
            for (var i = 0; i < this.feedbacks.length; i++) {
              if (feedbks.length == 0) feedbks = this.feedbacks[i].feedback;
              else feedbks = feedbks + ' ' + this.feedbacks[i];
            }
            message =
              message +
              ' The client has given the feedback on the candidate  as - ' +
              feedbks;
          }

          this.commonService.sendNotification(
            this.selectedCandidate.createdBy.id +
            ',' +
            this.selectedCandidate.requirement.standbyClientAnchorId +
            ',' +
            this.selectedCandidate.requirement.clientAnchorId +
            '',
            message,
            link,
            'COMMUNITY MEMBER',
            1,
            1,
            1
          );
        }
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

  // Save Discovery
  saveDiscovery() {
    this.commonService
      .post(
        'mainservice/recruitment/shortlisting/shortlist',
        this.selectedCandidate
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.commonService.showSuccessMessage('Update !', 'Status Updated :)');
        this.getCandidateData();
        this.updateStatusModal.hide();

        var link =
          '/recr/discoveryDetails/' +
          this.selectedCandidate.requirement.id +
          '/' +
          data['dataObject'].id;
        var message =
          'Discovery status of candidate ' +
          this.selectedCandidate.candidate.name +
          ' for the role ' +
          this.selectedCandidate.requirement.role.name +
          ' for ' +
          this.selectedCandidate.requirement.client.name +
          ' has changed to ' +
          this.selectedCandidate.status.name +
          '.';

        this.commonService.sendNotification(
          this.selectedCandidate.createdBy.id +
            ',' +
            this.selectedCandidate.requirement.standbyClientAnchorId +
            ',' +
            this.selectedCandidate.requirement.clientAnchorId +
            '',
          message,
          link,
          'COMMUNITY MEMBER',
          1,
          1,
          1
        );
        
      });
  }
}
