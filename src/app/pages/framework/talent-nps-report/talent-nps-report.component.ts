import { Component, Input, OnInit } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-talent-nps-report',
  templateUrl: './talent-nps-report.component.html',
  styleUrls: ['./talent-nps-report.component.scss']
})
export class TalentNpsReportComponent implements OnInit {

  constructor(public commonService: PieworksCommonService) { }

  ngOnInit(): void {
      this.quarter = Math.ceil((new Date().getMonth()+1)/3);
      this.quarter = this.quarter-1;
      if(this.quarter<=0)
      {
        this.year = this.year-1;
        this.quarter=4;
      }
      
      var temp = this.commonService.getQuarterRange(this.year,this.quarter);//previous quarter
      this.startingDate = temp[0];
      this.endingDate = temp[1];
      this.loadData(this.quarter,this.year);
      window.onscroll = (ev)=> {
          if(this.block)
            return;
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight-1000)) {
        // you're at the bottom of the page 
            console.log("reached bottom");
            if(this.scrollPosition!=window.innerHeight + window.scrollY)
            {
                this.block=true;
                this.scrollPosition = window.innerHeight + window.scrollY;
                this.next();
            }
        }
        this.scrollY = window.scrollY;
        }
  }
    ngOnDestroy(): void {
        window.onscroll = (ev) => {};
    }
  @Input("userId") userId:any; 
  talentNpsScore=0;
  message:any="";
  quarters:any = [{id:1,name:'Q1 (Jan-Mar)'},{id:2,name:'Q2 (Apr-Jun)'},{id:3,name:'Q3 (Jul-Sep)'},{id:4,name:'Q4 (Oct-Dec)'}];
  quarter:any=1;year:any=2022;scrollY:any=0;block:any=false;scrollPosition:any=0;
    shortlisting:any=[];
    loadData(quarter:any,year:any):void
   {
       switch(quarter)
       {
           case 1:
           this.startingDate = year+"-01-01 00:00:00";
           this.endingDate = year+"-03-31 23:59:59";
           break;
           case 2:
           this.startingDate = year+"-04-01 00:00:00";
           this.endingDate = year+"-06-30 23:59:59";
           break;
           case 3:
           this.startingDate = year+"-07-01 00:00:00";
           this.endingDate = year+"-09-30 23:59:59";
           break;
           case 4:
           this.startingDate = year+"-10-01 00:00:00";
           this.endingDate = year+"-12-31 23:59:59";
           break;
           default:
           break;
       }
       this.commonService.showProcessingIcon();
       this.commonService.get("mainservice/recruitment/shortlisting/discoveriesWithNps?communityId="+localStorage.getItem("communityId")+"&userId="+this.userId+"&startingDate="+this.startingDate+"&endingDate="+this.endingDate).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
                this.shortlisting = data["dataArray"];  
                this.calculateNpsScore(this.shortlisting);   
            }
        });
   }
   startingDate:any="";endingDate:any="";
       toggleClassOnRowClick(row:any):void
    {
        if(!row.classOnRowClick)
        {
            row.classOnRowClick = "tr-on-select";
            return;
        }
        if(row.classOnRowClick && row.classOnRowClick.length===0)
            row.classOnRowClick = "tr-on-select";
        else
            row.classOnRowClick="";
    } 
    next()
    {
        
    }
    
    calculateNpsScore(discoveries:any):void
    {
        this.talentNpsScore=200;
        try
        {
            var numOfPromoters = 0;
            var numOfDetractors = 0;
            var totalResonders = 0;
            for (var i=0;i<discoveries.length;i++)
            {
                totalResonders=totalResonders+1;
                if(discoveries[i].nps>8)//9-10
                    numOfPromoters++;
                else if(discoveries[i].nps<7)//0-6
                    numOfDetractors++;
            }
            if(totalResonders!=0)
            {
                this.talentNpsScore = Math.round(((numOfPromoters-numOfDetractors)/totalResonders)*100);
            }
            if(this.talentNpsScore==200)
                this.message = "Talent NPS is not available";
            else
                this.message = "Talent NPS is "+this.talentNpsScore;
        }
        catch (e:any)
        {
            e.printStackTrace();
        }
    }

}
