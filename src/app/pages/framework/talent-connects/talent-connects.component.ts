import { Component } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-talent-connects',
  templateUrl: './talent-connects.component.html',
  styleUrls: ['./talent-connects.component.scss']
})
export class TalentConnectsComponent {
  breadCrumbItems!: Array<{}>;
constructor(public commonService: PieworksCommonService){
  this.breadCrumbItems = [
    { label: 'Home', link: '/', active: false },
    { label: 'Talent Connects', active: true }
  ];
  
  
  this.myConnects();
}
  guides:any;
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
    this.myConnects();
  }
  previousForGuide(): void {
    if (this.pageNumForGuide == 1) return;
    this.pageNumForGuide = this.pageNumForGuide - 1;
    this.myConnects();
  }



  myConnects()
  {
    var url ='mainservice/framework2/forward?api=recruitmentservice/talent/myConnects?emailId='+this.commonService.user.username+',pageNum='+this.pageNumForGuide+',pageSize=100';

    this.commonService.get(url).subscribe((data:any)=>{
      if (data['result'] === 200) {
        
        
        this.guides = data['dataArray'];
        console.log(this.guides)
        this.paginationMessageForGuide = data['message'];
        this.totalPagesForGuide = data['dataObject']
      }
    });
  }
}
