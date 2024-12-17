import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-talent-account',
  templateUrl: './talent-account.component.html',
  styleUrls: ['./talent-account.component.scss'],
})
export class TalentAccountComponent {
  breadCrumbItems = [
    { label: 'Home', active: false, link: '/' },
    { label: 'Manage', link: '/recr/manage', active: false },
    { label: 'Talent', active: false },
  ]; //this.breadCrumbItems = [{ label: 'Base UI' }, { label: 'Modals', active: true }];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    
    setTimeout(() => {
      this.next();
    }, 100);
   
    window.onscroll = (ev) => {
      this.scrollListener(ev);
    };
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
        if (this.talents.length != 0) this.next();
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
      console.log(parseInt(temp[1]))
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
    this.loadTalent(false);
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
    this.loadTalent(false);
  }
  first(): void {
    this.pageNum = 1;
    this.loadTalent(false);
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
    this.loadTalent(false);
  }
  scrollY: any = 0;
  block: any = false;
  scrollPosition: any = 0;

  searchText = '';
  talents: any = [];

  members:any;
  totalNumberOfTalent:any;
  loadTalent(filterChanged: boolean): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/talent/getTalentAccounts?pageSize='+this.pageSize+',pageNum='+this.pageNum+',searchString=' +
      this.searchText;
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] == 200) {
        // this.talents = data['dataArray'];
        this.paginationMessage = data['message'];
        
        var newBatch = data['dataArray'];

        this.talents = this.talents.concat(newBatch);

        this.totalNumberOfTalent = data['dataObject'];
        console.log(this.talents)
      }
    });
  }

  doubleClickCounter = 0;
  clickedOnTalent(req: any): void {
    this.doubleClickCounter++;
    if (this.doubleClickCounter >= 2) this.doubleClicked(req);
    setTimeout(() => {
      this.doubleClickCounter = 0;
    }, 300);
  }
  doubleClicked(req: any): void {
    
      this.router.navigate(['recr/future-detail/' + req.id]);
    
  }
}
