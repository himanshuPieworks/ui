import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-peer-feedback-result',
  templateUrl: './peer-feedback-result.component.html',
  styleUrls: ['./peer-feedback-result.component.scss']
})
export class PeerFeedbackResultComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router,private commonService: PieworksCommonService) 
    {
        this.quarter = Math.ceil((new Date().getMonth()+1)/3);
        this.quarter = this.quarter-1;
        if(this.quarter<0)
        {
          this.year = this.year-1;
          this.quarter=4;
        }
        this.latestQuarter=this.quarter;
        this.latestYear = this.year;
        //this.loadData(this.quarter,this.year);
        this. loadCommunityMembers();
    }
    latestQuarter:any;latestYear:any;
  @Input("userId") userId:any;  
  
  ngOnInit(): void {
    // console.log(this.membersTemp)
  }
  answers:any = {a1:"",a2:"",a3:"",a4:"",a5:"",a6:"",a7:"",a8:""};
  message:any="";
  userprofile:any={};
  community:any={};quarter=1;year:any=new Date().getFullYear();quarters:any = [{id:1,name:'Q1 (Jan-Mar)'},{id:2,name:'Q2 (Apr-Jun)'},{id:3,name:'Q3 (Jul-Sep)'},{id:4,name:'Q4 (Oct-Dec)'}];
  loadCommunityMembers():void
    {
        this.commonService.showProcessingIcon();
        var acceptanceByAceValues="0,1";
        var acceptanceByAceMakerValues="0,1";
        this.commonService.get("mainservice/framework/members/"+this.commonService.user.id+"?acceptanceByAceValues="+acceptanceByAceValues+"&acceptanceByAceMakerValues="+acceptanceByAceMakerValues+"&userId=-1").subscribe((data:any) => 
        {
            console.log(this.route.snapshot.paramMap.get('id'))
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.membersTemp = data["dataArray"]; 
               console.log(this.membersTemp)  
               if(!this.membersTemp || this.membersTemp.length==0)
               {
                   return;
               }
               this.community = this.membersTemp[0].community;              
            }
            for(var i=0;i<this.membersTemp.length;i++)
            {
                if(this.membersTemp[i].user.id==this.userId)
                {
                    this.userprofile = this.membersTemp[i].user;
                    this.member = this.membersTemp[i];
                    this.memberOriginal = JSON.parse(JSON.stringify(this.membersTemp[i]));
                }
                else
                {
                    if(this.membersTemp[i].acceptanceByAce===1 ||this.membersTemp[i].acceptanceByAceMaker===1 )
                    {
                        if(this.otherMembersId=="")
                            this.otherMembersId=this.otherMembersId+this.membersTemp[i].user.id;
                        else
                            this.otherMembersId=this.otherMembersId+","+this.membersTemp[i].user.id;
                    }
                }
            }

            this.loadData(this.quarter,this.year);
        });
    }
    memberOriginal:any;
  aceMakerId:any=""; 
  membersTemp:any=[];  
  surveyResponses:any=[];
  member:any={};
  answer1Array:any=[];answer2Array:any=[];answer3Array:any=[];
  loadData(quarter:any,year:any):void
  {
    this.commonService.get("mainservice/framework/generic/surveyResponse?surveySet=nps-peer-form-q"+quarter+"-"+year+"&userId="+this.commonService.user.id+"&communityId="+localStorage.getItem('communityId')).subscribe((data:any) => 
    {
      
        if(data["result"]==200)
        {
            // console.log(data["result"])
            this.answer1Array=[];
            this.answer2Array=[];
            this.answer3Array=[];
            this.surveyResponses = data["dataArray"];
            // console.log(this.surveyResponses)
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
                return;
            }
            this.member.peerNps = 200;
            this.member.nps = 200;
            if(data["dataObject"]&&data["dataObject"].peerNps!=undefined)
            {
                 this.member.peerNps = data["dataObject"].peerNps;
                 console.log(this.member.peerNps)
                 this.member.nps = data["dataObject"].nps;
                 console.log(this.member.nps)
            }
        }
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
      otherMembersId:any="";

}
