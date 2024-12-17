import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-client-feedback-result',
  templateUrl: './client-feedback-result.component.html',
  styleUrls: ['./client-feedback-result.component.scss']
})
export class ClientFeedbackResultComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router,private commonService: PieworksCommonService) 
   {
       this.communityId = this.route.snapshot.paramMap.get('id');
       this.quarter = Math.ceil((new Date().getMonth()+1)/3);
       this.quarter = this.quarter-1; //client will be giving previous quarters feedback.
       if(this.quarter<0)
       {
         this.year = this.year-1;
         this.quarter=4;
       }
       this.latestQuarter=this.quarter;
       this.latestYear = this.year;
       var temp = this.commonService.getQuarterRange(this.year, this.quarter);
       this.startingDate=temp[0];
       this.endingDate=temp[1];
       this.loadMyClientContacts();
       this.loadCommunityMembers();
   }
 @Input("userId") userId:any;  
 quarter:any=1;year:any=2022;
 ngOnInit(): void {
 }
 answers:any = {a1:"",a2:"",a3:"",a4:"",a5:"",a6:"",a7:"",a8:""};
 message:any="";
 userprofile:any={};
 communityId:any;
 startingDate:any="";endingDate:any="";
 loadMyClientContacts():void
   {
       this.commonService.showProcessingIcon();
       var acceptanceByAceValues="0,1";
       var acceptanceByAceMakerValues="0,1";
       this.commonService.get("mainservice/framework/myClientContact?startingDate="+this.startingDate+"&endingDate="+this.endingDate+"&clientAnchorId="+this.userId).subscribe((data:any) => 
       {
           this.commonService.hideProcessingIcon();
           if(data["result"]===200)
           {
              this.clientContacts = data["dataArray"];   
              for(var i=0;i<this.clientContacts.length;i++)
              {
                  if(this.clientContactIds=="")
                   this.clientContactIds = this.clientContacts[i].id+"";
                  else
                   this.clientContactIds = this.clientContactIds+","+this.clientContacts[i].id;
              } 
              this.loadData(this.quarter,this.year);           
           }
       });
   }
 aceMakerId:any=""; 
 clientContacts:any=[];  
 surveyResponses:any=[];
 member:any={};
 answer1Array:any=[];answer2Array:any=[];answer3Array:any=[];latestQuarter:any;latestYear:any;memberOriginal:any;
 clientContactIds:any="";quarters:any = [{id:1,name:'Q1 (Jan-Mar)'},{id:2,name:'Q2 (Apr-Jun)'},{id:3,name:'Q3 (Jul-Sep)'},{id:4,name:'Q4 (Oct-Dec)'}];
 loadData(quarter:any,year:any):void
 {
   this.commonService.get("mainservice/framework/generic/surveyResponse?surveySet=nps-client-form-q"+quarter+"-"+year+"&userId="+this.userId+"&communityId="+this.communityId).subscribe((data:any) => 
   {
       //this.message = data["message"];  
       if(data["result"]==200)
       {            
           this.answer1Array=[];
           this.answer2Array=[];
           this.answer3Array=[];
           this.surveyResponses = data["dataArray"];
           for(var i=0;i<this.surveyResponses.length;i++)
           {
               if(this.surveyResponses[i].no==1)
                   this.answer1Array.push(this.surveyResponses[i]);
               else if(this.surveyResponses[i].no==2)
                   this.answer2Array.push(this.surveyResponses[i]);
               else if(this.surveyResponses[i].no==3)
                   this.answer3Array.push(this.surveyResponses[i]);    
           }            
           if(this.latestQuarter==quarter && this.latestYear==year)
           {
               this.member = JSON.parse(JSON.stringify(this.memberOriginal));
               if(this.member.clientNps!=200)
                   this.message = "Client NPS is "+this.member.clientNps;
               else
                   this.message = "Client NPS is not available.";
               return;
           }
           this.member.peerNps = 200;
           this.member.nps = 200;
           if(data["dataObject"]&&data["dataObject"].peerNps!=undefined)
           {
                this.member.peerNps = data["dataObject"].peerNps;
                this.member.nps = data["dataObject"].nps;
           }
       }
       if(this.member.clientNps!=200)
           this.message = "Client NPS is "+this.member.clientNps;
       else
           this.message = "Client NPS is not available.";
   });
 }
 callBackFunction:any;
 confirm(member:any,response:any,functionToCall:any,title:any,message:any):void
     {
       this.callBackFunction = functionToCall;
       this.commonService.showConfirmWindow(title,message,()=>{
       this.callBackFunction(member,response,true);
       },undefined);
     }
     otherMembersId:any="";membersTemp:any=[];
 loadCommunityMembers():void
   {
       this.commonService.showProcessingIcon();
       var acceptanceByAceValues="0,1";
       var acceptanceByAceMakerValues="0,1";
       this.commonService.get("mainservice/framework/members/"+this.route.snapshot.paramMap.get('id')+"?acceptanceByAceValues="+acceptanceByAceValues+"&acceptanceByAceMakerValues="+acceptanceByAceMakerValues+"&userId=-1").subscribe((data:any) => 
       {
           this.commonService.hideProcessingIcon();
           if(data["result"]===200)
           {
              this.membersTemp = data["dataArray"];   
              if(!this.membersTemp || this.membersTemp.length==0)
              {
                  return;
              }           
           }
           for(var i=0;i<this.membersTemp.length;i++)
           {
               if(this.membersTemp[i].user.id==this.userId)
               {
                   this.member = this.membersTemp[i];
                   this.memberOriginal = JSON.parse(JSON.stringify(this.membersTemp[i]));
               }
           }
           this.loadData(this.quarter,this.year);
       });
   }

}
