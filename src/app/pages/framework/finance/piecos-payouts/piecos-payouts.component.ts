import { Component, Input, OnInit } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-piecos-payouts',
  templateUrl: './piecos-payouts.component.html',
  styleUrls: ['./piecos-payouts.component.scss']
})
export class PiecosPayoutsComponent implements OnInit {
  constructor(public commonService: PieworksCommonService) {   
          var todayDate = new Date().toISOString().slice(0, 10);
          this.d = new Date(todayDate);
          this.endingDate=this.d.toISOString().slice(0, 10);
          this.d.setDate(1);
          this.month=this.d.toISOString().slice(0, 10);
          this.loadMembers();
        //this.loadCommunityMembers();
      }
      block:any=false;
      scrollPosition:any=0;
      membersArray:any=[];
      amIAceMaker:any=false;
       
    communityId:any;
    @Input() callbackFunction: (args: any) =>  void = (args: any) => { };
    @Input() parentObj: any;
    ngOnInit(): void {
        
        
    }
    
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
     pageNum=1;
     pageSize=12;
     paginationMessage="";
     next():void
     {
         if(this.paginationMessage.length>0)
         {
             var temp = this.paginationMessage.split(" of ");
             if(parseInt(temp[1])<=this.pageNum)
                  return;
         }
          this.pageNum = this.pageNum+1; 
          this.loadPreviousPayouts();
     }
     previous():void
     {
        if(this.pageNum==1)
        return;
        this.pageNum = this.pageNum-1; 
        this.loadPreviousPayouts();
     }
     first():void
     {
         this.pageNum=1;
         this.loadPreviousPayouts();
     }
     last():void
     {
         var temp = this.paginationMessage.split(" of ");
         this.pageNum=parseInt(temp[1]);
         this.loadPreviousPayouts();
     }
     statement:any=[];
     userId:any;sumOfCredits:any=0;sumOfDebits:any=0;
     user:any;
     loadUser():void
     {
         this.commonService.get("mainservice/framework/user/"+this.userId).subscribe((data:any) => 
          {
              this.user = data["dataObject"];
          })
     }
     loadStatement():void
      {
          if(!this.members)
              return;
          this.sumOfCredits=0;this.sumOfDebits=0;
          for(var i=0;i<this.members.length;i++)
          {
              if(this.member==this.members[i].name)
              {
                  this.userId = this.members[i].id;
                  this.loadUser();
              }
          }
          
          if(!this.userId)
              return;
            this.commonService.get("mainservice/finance/piecospayout/statementsForPayout?entryType=PIECOS&userId="+this.userId+"&month="+this.month).subscribe((data:any) => 
            {
                  var temp = this.month.split("-");
                  var newMonth = parseInt(temp[1])+1;
                  var newMonthString = newMonth+"";
                  if(newMonth<10)
                    newMonthString = "0"+newMonthString;
                  var month2 = temp[0]+"-"+newMonthString+"-01";
                  this.commonService.get("mainservice/finance/piecospayout/statementsForPayout?entryType=PENALTY&userId="+this.userId+"&month="+month2).subscribe((data2:any) => 
                  {
                      this.commonService.hideProcessingIcon();
                      this.statement = []; 
                      if(data["result"]===200)
                      {
                         this.statement = data["dataArray"];
                         var statement2 = data2["dataArray"];  
                         for(var i=0;i<statement2.length;i++)
                         {
                            this.statement.push(statement2[i]);
                         }
                         for(var i=0;i<this.statement.length;i++)
                         {
                            this.sumOfCredits = this.sumOfCredits+this.statement[i].credit;
                            this.sumOfDebits = this.sumOfDebits+this.statement[i].debit;
                         }
                      }
                  });
                  this.loadPreviousPayouts();
            });
      }
     filterChanged():void
     {
        
         setTimeout(()=>{           
             this.pageNum=1;
             this.loadStatement();
             
             this.loadAllMemberPayouts();
             //this.loadMembers();
          },1000);
     }
     memberHandle:any;
     members:any=[];
     member:any="";
     loadMembers():void
     {
          
          //this.month=this.d.toISOString().slice(0, 10);
         //this.month="2022-01-01 00:00:00";
         //this.endingDate=this.commonService.getFormatedDate(new Date(),'yyyy-MM-dd hh:mm:ss');
         if(this.memberHandle)
              this.memberHandle.unsubscribe();
          this.commonService.showProcessingIcon();
          this.memberHandle = this.commonService.get("mainservice/finance/piecospayout/membersForPayout?searchText="+this.member+"&month="+this.month+"&endingDate="+this.endingDate+" 23:59:59").subscribe((data:any) => 
          {
              this.commonService.hideProcessingIcon();
              this.members = []; 
              //if(data["result"]===200)
              {
                 this.members = data["dataArray"];   
              }
          });
     }
     unbilledHandle:any;
     unbilledItems:any=[];
     endingDate:any="";month:any="";
     memberId:any=-1;
     d:Date;
  
     memberEmailId:any="";
     total:any=0;
     getMonth(activeFrom:string):any
      {
          try
          {
              var currentMonth = parseInt(this.endingDate.split("-")[1]);
              var activeFromParts = activeFrom.split("-");
              var activeFromMonth = parseInt(activeFromParts[1]);
              var monthDiff = 0;
              if(parseInt(activeFromParts[2]) >=16 )
              {
                  monthDiff = currentMonth-activeFromMonth;
                  if(monthDiff<0)//2-12
                      monthDiff = 12+monthDiff;
              }
              else
              {
                  monthDiff = currentMonth-activeFromMonth+1;
                  if(monthDiff<0)//2-12
                      monthDiff = 12+monthDiff;
              }  
              return monthDiff;
          }
          catch (e)
          {
              return 0;
          }
      }
      confirmPayoutGeneration():void
      {
          if(!this.userId)
          {
              this.commonService.showErrorMessage("Error","Please select a member");
              return;
          }
          if(this.sumOfCredits-this.sumOfDebits <=0)
          {
              this.commonService.showErrorMessage("Error","Payout not possible for negative piecos earning for the month.");
              return;
          }
          if(this.user.piecos<0)
          {
              this.commonService.showErrorMessage("Error","Payout not possible for negative piecos in the wallet. "+this.user.piecos);
              return;
          }
          if(this.sumOfCredits-this.sumOfDebits > this.user.piecos)//this shouldn't happen
          {
              this.commonService.showErrorMessage("Error","Insufficent Piecos available with user. "+this.user.piecos);
              return;
          }
          this.commonService.showConfirmWindow("Confirmation","Hope you have verified the payout via preview option. Are you sure you want to proceed with payout generation ?",()=>{
          this.generatePayout(); 
          },undefined);
      }
      message="";
      generatePayout():void
      {
          this.message="";
          this.commonService.showProcessingIcon();
          //penalty and tds is calculated at the reruitmentservice handler rest api.
          var netTotal = this.total;
          var url="mainservice/finance/piecospayout/generate";
          var piecosPayout = {userId:this.userId,userName:this.user.name,month:this.month,credit:this.sumOfCredits,debit:this.sumOfDebits,amount:(this.sumOfCredits-this.sumOfDebits)*500,tds:((this.sumOfCredits-this.sumOfDebits)*500)*10/100,netAmount:(this.sumOfCredits-this.sumOfDebits)*500 - ((this.sumOfCredits-this.sumOfDebits)*500)*10/100};
          this.commonService.post(url,piecosPayout).subscribe((data:any) => 
          {
              this.commonService.hideProcessingIcon();
              if(data["result"]===200)
              {                
                  this.loadStatement();
                  this.loadPreviousPayouts();
                  this.loadAllMemberPayouts();
                  this.message = "Successfully generated piecoin payout.";
              }
          });
      }
      showGeneratedPayoutSlip(payoutId:any):void
      {
          this.commonService.showProcessingIcon();
          var url="mainservice/finance/piecospayout/printablePreviousPayout/"+payoutId;
         this.commonService.get(url).subscribe((data:any) => 
         {
             this.commonService.hideProcessingIcon();
             if(data["result"]===200)
             {
              this.commonService.hideProcessingIcon();
              var newWindow = window.open("", "", "status");
              
              if (newWindow) {
                var newContent = data["message"];
                newWindow.document.write(newContent);
                newWindow.document.close();
              } else {
                // Handle the case where window.open failed to create a new window
                
              }
              
             }
         });  
      }
      contract:any={};
  
      
      
      
      
      invoices:any=[];allMemberInvoices:any=[];
      loadPreviousPayouts():void
      {
          this.commonService.showProcessingIcon();
          this.contract={};
          var url="mainservice/finance/piecospayout/report?userId="+this.userId+"&pageNum="+this.pageNum+"&pageSize="+this.pageSize;
          this.commonService.get(url).subscribe((data:any) => 
          {
              this.commonService.hideProcessingIcon();
              if(data["result"]===200)
              {
                  this.invoices = data["dataArray"];
              }
          });
      }
      loadAllMemberPayouts():void
      {
          this.commonService.showProcessingIcon();
          this.contract={};
          var url="mainservice/finance/piecospayout/allMemberReport?month="+this.month;
          this.commonService.get(url).subscribe((data:any) => 
          {
              this.commonService.hideProcessingIcon();
              if(data["result"]===200)
              {
                  this.allMemberInvoices = data["dataArray"];
              }
          });
      }
         
  }
  
  