import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute,Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-nps',
  templateUrl: './nps.component.html',
  styleUrls: ['./nps.component.scss']
})
export class NpsComponent implements OnInit {

  constructor(private commonService: PieworksCommonService,private route: ActivatedRoute) { 
    var temp:any = this.route.snapshot.paramMap.get('id')?.split("-");
    this.shortlist.id=temp[0];
    this.shortlist.npsValidationKey=temp[1];
    this.commonService.get("mainservice/recruitment/shortlisting/openresource/nps/shortlist?id="+temp[0]+"&key="+temp[1]).subscribe((data:any) => 
    { 
        if(data["result"]==200)
            this.welcome = data["message"];
        else
            this.message = data["message"];
    });
  }

  ngOnInit(): void {

    this.userId = this.commonService.user.id;
      this.yearArray.push(this.selectedYear-1);
      this.yearArray.push(this.selectedYear-2);
      this.yearArray.push(this.selectedYear-3);
      var quarter = Math.ceil((new Date().getMonth()+1)/3);
      var year = new Date().getFullYear();
        quarter = quarter-1;
        if(quarter<0)
        {
          year = year-1;
          quarter=4;
        }
        this.selectedQuarter = quarter;
        this.userId = this.commonService.user.id;
    
  }
  welcome="";
  message="";
  shortlist:any={};
  submit():void{
    this.commonService.showProcessingIcon();
    this.shortlist.nps = this.selectedNps;
    this.commonService.post("mainservice/recruitment/shortlisting/openresource/nps",this.shortlist).subscribe((data:any) => 
    {
        this.commonService.hideProcessingIcon();
        if(data["result"]==200)
        {
            this.message = "Thanks for providing the feedback.";
        }
        else{
          this.message = data["message"];
        }
    });
  }
  selectedNps:number=0;


  selectedQuarter=1;selectedYear=new Date().getFullYear();
  quarterArray=[{id:1,name:"Q1"},{id:2,name:"Q2"},{id:3,name:"Q3"},{id:4,name:"Q4"}];
  yearArray=[this.selectedYear];userId:any;
  
 
  @ViewChild('tab2' /* #name or Type*/, {static: false}) tab2:any;
  @ViewChild('tab3' /* #name or Type*/, {static: false}) tab3:any;
  filterChanged():void
  {
      // this.tab1.loadData(this.selectedQuarter,this.selectedYear);
      this.tab2.loadData(this.selectedQuarter,this.selectedYear);
      this.tab3.loadData(this.selectedQuarter,this.selectedYear);
  } 


}
