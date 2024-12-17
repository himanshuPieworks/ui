import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-peer-feedback-form',
  templateUrl: './peer-feedback-form.component.html',
  styleUrls: ['./peer-feedback-form.component.scss']
})
export class PeerFeedbackFormComponent implements OnInit {
  constructor(private route: ActivatedRoute,private router: Router,public commonService: PieworksCommonService) 
    {
        this.userId = this.commonService.user.id
        this.quarter = Math.ceil((new Date().getMonth()+1)/3);
        this.year = new Date().getFullYear();
        this.quarter = this.quarter-1;
        if(this.quarter<0)
        {
          this.year = this.year-1;
          this.quarter=4;
        }
        this.loadCommunityMembers();
    }
  
  ngOnInit(): void {
    // this.userId = this.commonService.user.id;
  }
  completedStep1:any=false;completedStep2:any=false;completedStep3:any=false;
  submitted:any=false;

@ViewChild('cdkStepper') cdkStepper:any;
  validate1Completion():void{

    setTimeout(()=>{
      if(this.answers.a1)
      {
        this.completedStep1 = true;
      }
      else{
        this.completedStep1 = false;
      }
    })
    

  }

  validate2Completion():void{
    setTimeout(()=>{
      if(this.answers.a2)
      {
        this.completedStep2 = true;
      }
      else{
        this.completedStep2 = false;
      }
    })
  }
  stepComplication(event:any):void{

    console.log(event)
    if(event.selectedIndex == 1 && !this.completedStep1)
    {
      // event.stopPropagation()
      this.cdkStepper.next()

    }

  }
  validate3Completion():void{
    setTimeout(()=>{
      if(this.answers.a3)
      {
        this.completedStep3 = true;
      }
      else{
        this.completedStep3 = false;
      }
    })
  }

  change(event: any) {
    this.submitted=true;
    console.log(event);
}

  userId:any;
  answers:any = {a1:"",a2:"",a3:""};
  message:any="";quarter:any=1;year:any=new Date().getFullYear();
  
  community:any={};memberIndex:any=0;
  member:any={};selectedNps:any;
  
  loadCommunityMembers():void
    {
        this.commonService.showProcessingIcon();
        var acceptanceByAceValues="1";
        var acceptanceByAceMakerValues="1";
        this.commonService.get("mainservice/framework/members/"+localStorage.getItem("communityId")+"?acceptanceByAceValues="+acceptanceByAceValues+"&acceptanceByAceMakerValues="+acceptanceByAceMakerValues+"&userId=-1").subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.membersTemp = data["dataArray"]; 
               for(var i=0;i<this.membersTemp.length;i++)
               {
                   if(this.membersTemp[i].user.id==this.commonService.user.id)
                   {
                       this.myMemberObj = this.membersTemp.splice(i,1)[0];
                       if(this.myMemberObj.hasFilledNps==this.membersTemp.length)
                            this.message = "Your response is already received. You can fill NPS form only once.!!";
                       break;
                   }
               } 
               for(var i=0;i<this.membersTemp.length;i++)
               {
                   if(this.membersTemp[i].user.id==this.userId)//this.userId is selected Member's userId
                   {
                       this.memberIndex = i;
                       break;
                   }
               }  
               this.community = this.membersTemp[0].community;   
               //this.memberIndex=0;
               //this.memberIndex=this.myMemberObj.hasFilledNps;
               this.member = this.membersTemp[this.memberIndex].user;               
            }
        });
    }
    myMemberObj:any={};
  aceMakerId:any=""; 
  membersTemp:any=[];  
  started:any=false;
  submit():void
  {
    this.message = "";
    var temp = "a1,a2,a3".split(",");
    for(var i=0;i<temp.length;i++)
    {
        if(this.answers[temp[i]].length==0)
        {
            this.message = "Please answer for the mandatory questions.";
            return;
        }
    }
    var surveyResponse=[];
    surveyResponse.push({arg1:this.commonService.user.id+"",surveySet:"nps-peer-form-q"+this.quarter+"-"+this.year,no:1,answer:this.answers.a1,userId:this.member.id,communityId:this.community.id});
    surveyResponse.push({arg1:this.commonService.user.id+"",surveySet:"nps-peer-form-q"+this.quarter+"-"+this.year,no:2,answer:this.answers.a2,userId:this.member.id,communityId:this.community.id});
    surveyResponse.push({arg1:this.commonService.user.id+"",surveySet:"nps-peer-form-q"+this.quarter+"-"+this.year,no:3,answer:this.answers.a3,userId:this.member.id,communityId:this.community.id});
    
    this.message = "Sending request...";
    this.commonService.post("mainservice/framework/generic/surveyResponse?deletePreviousResponse=false",surveyResponse).subscribe((data:any) => 
    {
        this.message = "saving...";  
        if(data["result"]==200)
        {
            this.message = "";
            this.answers = {a1:"",a2:"",a3:""};
            this.message = "Thank you for providing the feedback.";
            this.commonService.showInfoMessage("Info",this.message);
            this.updateMemberWithNpsFilled();
            setTimeout(()=>{this.commonService.goBack();},2000);            
        }
    });
  }
  skip():void
  {
      this.answers = {a1:"",a2:"",a3:""};
      this.memberIndex=this.memberIndex+1;
      if(this.memberIndex < this.membersTemp.length)
            this.member = this.membersTemp[this.memberIndex].user;
        else
            this.message = "Thank you for providing the feedback.";
      this.updateMemberWithNpsFilled();      
  }
  updateMemberWithNpsFilled():void
    {
        //0-pending,1-accepted,2-rejected,3-disabled(Only by acemaker),4-quitted(either acemaker or ace himself),5 - blocked
        this.myMemberObj.hasFilledNps=this.myMemberObj.hasFilledNps+1;
        this.commonService.post("mainservice/framework/communitymember",this.myMemberObj).subscribe((data:any) => 
        {
        });
    }
  
}
