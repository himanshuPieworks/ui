import { Component, OnInit} from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-piecos-statement',
  templateUrl: './piecos-statement.component.html',
  styleUrls: ['./piecos-statement.component.scss']
})
export class PiecosStatementComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  constructor(public commonService: PieworksCommonService) {

    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'PieBank',link:'fw/pieBank', active: false },
      {label:"Piecos-Statement" , active:true}
    ];

   }

  
 section:any = 1;
  ngOnInit(): void {
      this.first();
  }
  loadStatement():void
  {
      this.commonService.get("mainservice/finance/statement?userId=" + this.commonService.user.id+"&pageSize="+this.pageSize+"&pageNum="+this.pageNum).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            this.statement = []; 
            if(data["result"]===200)
            {
               this.statement = data["dataArray"];   
               this.paginationMessage = data["message"];
            }
        });
  }
  statement:any=[];
   pageNum:any=1;
   pageSize:any=20;
   paginationMessage:any="";
   showInfo:any=true;
   next():void
   {
       if(this.paginationMessage.length>0)
       {
           var temp = this.paginationMessage.split(" of ");
           if(parseInt(temp[1])<=this.pageNum)
                return;
       }
        this.pageNum = this.pageNum+1; 
        this.loadStatement();
   }
   previous():void
   {
      if(this.pageNum==1)
      return;
      this.pageNum = this.pageNum-1; 
      this.loadStatement();
   }
   first():void
   {
       this.pageNum=1;
       this.loadStatement();
   }
   last():void
   {
       var temp = this.paginationMessage.split(" of ");
       this.pageNum=parseInt(temp[1]);
       this.loadStatement();
   }
}
