import { Component, OnInit } from '@angular/core';
import {PieworksCommonService} from '../../../common/pieworkscommon.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-client-feedback',
  templateUrl: './client-feedback.component.html',
  styleUrls: ['./client-feedback.component.scss']
})
export class ClientFeedbackComponent {
  constructor(private route: ActivatedRoute,private router: Router,public commonService: PieworksCommonService) { 
  this.quarter = Math.ceil((new Date().getMonth()+1)/3);
  this.year = new Date().getFullYear();
    this.quarter = this.quarter-1;
    if(this.quarter<0)
    {
      this.year = this.year-1;
      this.quarter=4;
    }
    var temp:any = this.route.snapshot.paramMap.get('id');
    temp = temp?.split("-");
    //this.shortlist.id=temp[0];
    //this.shortlist.npsValidationKey=temp[1];

    this.message =""; 
    this.commonService.get("mainservice/framework/openresource/clientContact?id="+temp[0]).subscribe((data:any) => 
    { 
        if(data["result"]==200 &&  data["dataObject"]?.npsValidationKey && data["dataObject"]?.npsValidationKey==temp[1])
        {
            this.clientContact = data["dataObject"];
            this.loadClient();
            this.welcome = "Welcome "+data["dataObject"].name;
            this.message ="";
        }
        else
            this.message = "Url either not valid or expired. Please use the link received in your mail.";
    });
  }
  clientContact:any={};
  welcome="";year=2022;
  ngOnInit(): void {
  }
  answers:any = {a1:"",a2:"",a3:""};
  message="";
  
  community:any={};memberIndex=0;
  member:any={};

    myMemberObj:any={};
  aceMakerId=""; 
  membersTemp:any=[];  
  started=false;quarter=1;
  submit():void
  {
    this.message = "";
    var temp = "a1,a2,a3".split(",");
    for(var i=0;i<temp.length;i++)
    {
        if(this.answers[temp[i]].length==0)
        {
            this.commonService.showErrorMessage("Info","Please answer the mandatory questions.");
            return;
        }
    }
    var surveyResponse=[];
    //client contact id is passed as the userId as we dont know whom we are making this feedback for.
    surveyResponse.push({surveySet:"nps-client-form-q"+this.quarter+"-"+this.year,no:1,answer:this.answers.a1,userId:this.clientContact.id,communityId:this.community.id});
    surveyResponse.push({surveySet:"nps-client-form-q"+this.quarter+"-"+this.year,no:2,answer:this.answers.a2,userId:this.clientContact.id,communityId:this.community.id});
    surveyResponse.push({surveySet:"nps-client-form-q"+this.quarter+"-"+this.year,no:3,answer:this.answers.a3,userId:this.clientContact.id,communityId:this.community.id});
    
    this.message = "Sending request...";
    this.commonService.post("mainservice/framework/generic/openresource/surveyResponse?deletePreviousResponse=false",surveyResponse).subscribe((data:any) => 
    {
        //this.message = data["message"];  
        if(data["result"]==200)
        {
            this.answers = {a1:"",a2:"",a3:""};
            this.memberIndex=this.memberIndex+1;
            if(this.memberIndex < this.membersTemp.length)
                this.member = this.membersTemp[this.memberIndex].user;
            else
                this.message = "Thank you for providing the feedback.";
            this.updateContactWithNpsFilled();
        }
    });
  }
  updateContactWithNpsFilled():void
    {
        //0-pending,1-accepted,2-rejected,3-disabled(Only by acemaker),4-quitted(either acemaker or ace himself),5 - blocked
        
        this.clientContact["npsValidationKey"]="filled";
        this.commonService.post("mainservice/framework/openresource/clientContactObj",this.clientContact).subscribe((data:any) => 
        {
        });
    }
  client:any={};  
  loadClient():void
  {
      this.commonService.get("mainservice/framework/openresource/client/id/"+this.clientContact.clientId).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();            
            if(data["result"]===200)
            {
               this.client = data["dataObject"]; 
               this.community = this.client.community;
            }
        });
  }
  
}
