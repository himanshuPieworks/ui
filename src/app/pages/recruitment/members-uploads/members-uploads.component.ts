import { Component, ViewChild } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-members-uploads',
  templateUrl: './members-uploads.component.html',
  styleUrls: ['./members-uploads.component.scss'],
})
export class MembersUploadsComponent {

  @ViewChild('filterWindow') filterWindow:any;
startDate:any;
endDate:any;
  constructor(public commonService: PieworksCommonService) {
    this.startDate = this.commonService.getParameterFromUrl('startDate');
    this.endDate = this.commonService.getParameterFromUrl('endDate');
    window.onscroll = (ev) => {
      this.scrollListener(ev);
    };
    this.getListOfMembers();
  }
  scrollY: any = 0;
  block: any = false;
  scrollPosition: any = 0;
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
        this.next();
        this.nextCandidate();
      }
    }
    this.scrollY = window.scrollY;
  }
  paginationMessage: any = '';
  pageNum: any = 1;
  pageSize: any = 12;
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
    this.getListOfMembers();
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
    this.getListOfMembers();
  }
  first(): void {
    this.pageNum = 1;
    this.getListOfMembers();
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
    this.getListOfMembers();
  }
  membersList: any = [];
  getListOfMembers() {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/candidates/referredCandidateCount?pageNum=' +
      this.pageNum +
      ',pageSize=' +
      this.pageSize;
      if (this.startDate != undefined) url = url + '&startDate=' + this.startDate;
      if (this.endDate != undefined) url = url + '&endDate=' + this.endDate;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();

      if (data['result'] === 200) {
        this.block = false;
        var newBatch = data['dataArray'];

        this.membersList = this.membersList.concat(newBatch);

        this.paginationMessage = data['message'];
      }
      if (this.membersList.length === 0 && this.pageNum > 1) {
        this.pageNum = this.pageNum - 1;
      }
    });
  }

  paginationMessageCandidate: any = '';
  pageNumCandidate: any = 1;
  pageSizeCandidate: any = 12;
  nextCandidate(): void {
    if (this.paginationMessageCandidate.length > 0) {
      var temp = this.paginationMessageCandidate.split(' of ');
      if (parseInt(temp[1]) <= this.pageNumCandidate) return;
    }
    this.pageNumCandidate = this.pageNumCandidate + 1;
    this.getListOfSelectedCandidates();
  }
  previousCandidate(): void {
    if (this.pageNumCandidate == 1) return;
    this.pageNumCandidate = this.pageNumCandidate - 1;
    this.getListOfSelectedCandidates();
  }
  firstCandidate(): void {
    this.pageNumCandidate = 1;
    this.getListOfSelectedCandidates();
  }
  lastCandidate(): void {
    var temp = this.paginationMessageCandidate.split(' of ');
    this.pageNumCandidate = parseInt(temp[1]);
    this.getListOfSelectedCandidates();
  }
  selectedMemberReferralCode:any;
  candidateList:any = [];
  getListOfSelectedCandidates()
  {
    var url = 'mainservice/framework2/forward?api=recruitmentservice/candidates/referredCandidates/'+this.selectedMemberReferralCode+'?pageNum='+
      this.pageNumCandidate +
      ',pageSize=' +
      this.pageSizeCandidate;
      this.commonService.get(url).subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
  
        if (data['result'] === 200) {
          this.block = false;
          var newBatch = data['dataArray'];
  
          this.candidateList = this.candidateList.concat(newBatch);
  
          this.paginationMessageCandidate = data['message'];
        }
        if (this.candidateList.length === 0 && this.pageNumCandidate > 1) {
          this.pageNumCandidate = this.pageNumCandidate - 1;
        }
      });
  }
  selectedCandidate:any;
  doubleClickCounter = 0;
  clickedOnCandidateTalent(disc: any): void {
    this.doubleClickCounter++;
    if (this.doubleClickCounter >= 2) this.doubleClickedTalent(disc);
    setTimeout(() => {
      this.doubleClickCounter = 0;
    }, 300);
  }
  doubleClickedTalent(disc: any): void {
    window.open(
      this.commonService.uiPrefix +
        '/recr/discoveryDetails/' +
        -1 +
        '/' +
        disc.id,
      '_blank'
    );
  }

  selectedMemberCandidates: any | null = null;

  // Function to show candidates
  showCandidates(candidates: any) {
    this.candidateList = [];
    this.selectedMemberCandidates = candidates;
    this.selectedMemberReferralCode = candidates;
    this.getListOfSelectedCandidates();
  }

  // Function to go back to the members list
  goBack() {
    this.selectedMemberCandidates = null;
  }

  clearFilters()
  {
    this.pageNum = 1;
    this.pageNumCandidate = 1;
    this.startDate = undefined; //this.commonService.getFormatedDate(new Date(),"yyyy-MM-dd");
    this.endDate = undefined; 
  }

  filterChanged()
  {
    this.membersList=[];
    this.pageNum =1;
    this.pageNumCandidate = 1;
    this.filterWindow.hide();
    this.getListOfMembers();
  }
}
