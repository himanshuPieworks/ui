import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {PieworksCommonService} from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-future-edit',
  templateUrl: './future-edit.component.html',
  styleUrls: ['./future-edit.component.scss']
})
export class FutureEditComponent {

  constructor(private route: ActivatedRoute,public commonService: PieworksCommonService) {
        this.futureId = this.route.snapshot.paramMap.get('id');
        this.loadFuture();  
    }
  futureId:any="-1";
  ngOnInit(): void {
  }
  breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Candidates', link: '/recr/candidates', active: false },
       { label: 'Edit Future', link: '/recr/future-edit', active: true },
    ];
  candidate:any={};
    markAsValidated(confirmed:any):void
    {
        if(!confirmed)
        {
            this.commonService.showConfirmWindow("Confirmation","Are you sure, you want to mark "+this.candidate.name+" as validated ?",()=>{this.markAsValidated(true);},undefined);
            return;
        }
        this.candidate.validated=1;
        this.commonService.post("mainservice/recruitment/future/openresource/save",this.candidate).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]==200)
            {
                
            }
            else
            {
              this.candidate.validated=0;
                this.commonService.showErrorMessage("Error",data["message"]);
            }
        });
    }
  loadFuture():void
  {
      var url = "mainservice/recruitment/future/get/"+this.futureId;
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
                this.candidate = data["dataObject"];
                if(this.candidate.leadershipProgram)
                    this.candidate.leadershipProgram='true';
                else
                    this.candidate.leadershipProgram='false';
            }
        });
  }
  otherJobFunction:any;currentOtherJobFunction:any;nextOtherJobFunction:any;message="";
  communityId="-1";userId:any;
  resetForm():void
  {
      this.message = "";
      this.candidate={};
      this.otherJobFunction=undefined;
      this.currentOtherJobFunction=undefined;
      this.nextOtherJobFunction=undefined;      
  }
  
  submit():void
  {
      if(!this.validate())
      {
          return;
      }
      this.candidate.communityId = this.communityId;
      this.candidate.validated = 0;
      this.commonService.showProcessingIcon();
      this.commonService.post("mainservice/recruitment/future/openresource/save",this.candidate).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]==200)
            {
                this.tempMessage = data["message"];
                this.candidate = data["dataObject"];
                this.uploadCv();
                //this.commonService.showNotificationWindow(this.message);
            }
            else
            {
                this.commonService.showErrorMessage("Error",data["message"]);
            }
        });
  }
  tempMessage="";
  validate():boolean
  {
      
      if(!this.candidate.emailId || this.candidate.emailId.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter email id.");
          return false;
      }
      this.candidate.name = this.candidate.name.trim();
      if(!this.candidate.name || this.candidate.name.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter name.");
          return false;
      }
      this.candidate.name = this.candidate.name.trim();
      if(!this.candidate.phoneNo || this.candidate.phoneNo.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter phone no.");
          return false;
      }
      this.candidate.phoneNo = this.candidate.phoneNo.trim();
      if(!this.candidate.linkedInUrl || this.candidate.linkedInUrl.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter your linkedIn profile url.");
          return false;
      }
      this.candidate.linkedInUrl = this.candidate.linkedInUrl.trim();
      if(this.candidate.experience==undefined)
      {
          this.commonService.showErrorMessage("Error","Please enter experience.");
          return false;
      }
      if(!this.candidate.preferredLocation)
      {
          this.commonService.showErrorMessage("Error","Please enter preferred location.");
          return false;
      }
      if(!this.candidate.designation || this.candidate.designation.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter designation.");
          return false;
      }
      this.candidate.designation = this.candidate.designation.trim();
      if(this.candidate.nextJobFunction && this.candidate.nextJobFunction=="other")
      {
          this.candidate.nextJobFunction = this.nextOtherJobFunction;
      }
      if(!this.candidate.nextJobFunction || this.candidate.nextJobFunction.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter your preferred job function.");
          return false;
      }
      this.candidate.nextJobFunction = this.candidate.nextJobFunction.trim();
      if(this.candidate.currentJobFunction && this.candidate.currentJobFunction=="other")
      {
          this.candidate.currentJobFunction = this.currentOtherJobFunction;
      }
      if(!this.candidate.currentJobFunction || this.candidate.currentJobFunction.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter current job function.");
          return false;
      }
      this.candidate.currentJobFunction = this.candidate.currentJobFunction.trim();
      if(!this.candidate.emailId || this.candidate.emailId.trim().length==0)
      { 
          this.commonService.showErrorMessage("Error","Please enter the email id.");
          return false;
      }
      this.candidate.sector = this.candidate.sector.trim();
      if(!this.candidate.sector || this.candidate.sector.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter sector.");
          return false;
      }
      this.candidate.sector = this.candidate.sector.trim();
      if(!this.candidate.reasonToSwitch || this.candidate.reasonToSwitch.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter the driving force/motivation for exploring new opportunities.");
          return false;
      }
      this.candidate.reasonToSwitch = this.candidate.reasonToSwitch.trim();
      if(!this.candidate.orgCulture || this.candidate.orgCulture.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter kind of org. culture would you associate yourself with.");
          return false;
      }
      this.candidate.orgCulture = this.candidate.orgCulture.trim();
      if(!this.candidate.idealCompany || this.candidate.idealCompany.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter ideal company according to you.");
          return false;
      }
      this.candidate.idealCompany = this.candidate.idealCompany.trim();
      if(!this.candidate.expectation || this.candidate.expectation.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter expectation.");
          return false;
      }
      this.candidate.expectation = this.candidate.expectation.trim();
      if(!this.candidate.workModel || this.candidate.workModel.trim().length==0)
      {
          this.commonService.showErrorMessage("Error","Please enter your preferred working mode.");
          return false;
      }
      this.candidate.workModel = this.candidate.workModel.trim();
      if(this.candidate.leadershipProgram==undefined)
      {
          this.commonService.showErrorMessage("Error","Please mention if you would like to be considered for our Leadership Talent Program.");
          return false;
      }
      if(this.candidate.leadershipProgram=='true')
      {
//        if(!this.cv)
//        {
//            this.commonService.showErrorMessage("Error","Please upload cv.");
//            return false;
//        }
//        if(!this.candidate.videoLink)
//        {
//            this.commonService.showErrorMessage("Error","Please upload introduction video.");
//            return false;
//        }
      }
      return true;
  }
  showLtProgramDetails()
  {
      this.commonService.showImageWindow("","assets/img/ltp.jpeg",()=>{},()=>{}) ;

  } 
  onFileSelecet(event:any) 
    {
        var errormessage ="";
        this.cv=null;
        if (event.target.files.length == 0) {
            return;
          }
        var file = event.target.files[0];
        if(file.size > 10485760 *1)//10 x 1 MB limit
        {
            errormessage = "File size too big. Please choose a file less than 10 MB.";
            this.commonService.showErrorMessage("Error",errormessage);
            var ele:any = document.getElementById("cv");
            ele["value"]=null;
            return ;
        }
        this.cv = file;     
    }
     cv:any;
     
     uploadCv():void
     {
        const formData: FormData = new FormData();
        formData.append('futureId', this.candidate.id);
        if(this.cv)
        {
            formData.append('cv', this.cv, this.cv.name);
            this.commonService.showProcessingIcon();
            let headers = new HttpHeaders({
                   "Accept": "application/json" ,
                   'Authorization': ''//localStorage.getItem("accesstoken").toString()
                });
            let options = { headers: headers };
            this.commonService.showProcessingIcon();  
            this.commonService.post2("mainservice/recruitment/future/openresource/cv", formData,options).subscribe((data:any) => 
            {
                this.commonService.hideProcessingIcon();  
                if(data["result"]===200)
                {
                    this.commonService.goTop();
                    this.message = this.tempMessage;
                    setTimeout(() => {this.commonService.showInfoMessage("Update","Saved changes.");},2000);
                }
                else
                {
                    this.commonService.showErrorMessage("Error","File upload failed. Please try again later.");
                }
            });
        }
        else
        {
            this.commonService.goTop();
            this.message = this.tempMessage;
            setTimeout(() => {this.commonService.showInfoMessage("Update","Saved changes.");},2000);
        }
     }
}
