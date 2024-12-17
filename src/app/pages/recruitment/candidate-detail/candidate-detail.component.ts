import { Clipboard } from '@angular/cdk/clipboard';
import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})


export class CandidateDetailComponent implements OnInit {

  constructor(private clipboard:Clipboard,private route: ActivatedRoute,public commonService: PieworksCommonService,private sanitizer: DomSanitizer) { }
    candidate:any={};
    experiences:any=[];
    education:any=[];
    sectors:any=[];

    //Copy the pdf link of resume 
    copyToClipboard() {
        const linkToCopy =
          this.commonService.encode(
            this.candidate.cv && this.candidate.cv.indexOf('upload') == 0
              ? this.urlPrefix + this.candidate.cv
              : this.candidate.cv
          );
    
        this.clipboard.copy(linkToCopy);
        this.commonService.showInfoMessage("Copied","Linked Copied");
      }
    
  ngOnInit(): void {
      if(window.location.toString().indexOf("candidates")>-1)
          this.candidateId = this.route.snapshot.paramMap.get('id');
      this.loadCandidate();
      this.loadExperiences();
      this.loadEducation();
      this.loadSectors();
      this.loadAvaialbleTags();
      this.loadAvaialbleSectors();
      this.urlPrefix = this.commonService.urlPrefix;
  }
  @Input('candidateId') candidateId:any;
  valueSets:any = 
[
 {question:'How we deliver ?',values:[{value:'Customer Focused',selected:false},{value:'Result Focused',selected:false},{value:'Relationship Focused',selected:false},{value:'Teamwork',selected:false},{value:'Patiently',selected:false},{value:'Resolutely',selected:false},{value:'Research based',selected:false}]},
 {question:'How we treat each other ?',values:[{value:'Empathy',selected:false},{value:'Unbiased',selected:false},{value:'Inclusivity',selected:false},{value:'Equality',selected:false},{value:'Nonhierarchical',selected:false},{value:'Flexibly',selected:false},{value:'Openness',selected:false}]},
 {question:'How we identify ourselves ?',values:[{value:'Fun',selected:false},{value:'Creative',selected:false},{value:'Freethinkers',selected:false},{value:'Meritocratic',selected:false},{value:'Diverse',selected:false},{value:'Dependable',selected:false},{value:'Ethical',selected:false}]}   
];
  loadCandidate():void
  {
      var url = "mainservice/recruitment2/candidate/"+this.candidateId;
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          if(data["result"]===200)
          {
             this.candidate = data["dataObject"];   
             console.log("I m candidate."+ this.candidate)  
             if(this.candidate.currentCtcTotal==0)
              this.candidate.currentCtcTotal=this.candidate.currentCtcFixed+this.candidate.currentCtcVariable;
              
              if(!this.candidate.image || this.candidate.image.length<2)
              {
                    this.candidate.image = "assets/img/home-1/profile/1.jpg";
                    //this.urlPrefix="";
              }
              else
              {
                  this.urlPrefix = this.commonService.urlPrefix;
              }
              this.imgPreview = this.urlPrefix+this.candidate.image; 
              if(this.candidate.cultureValues)
              {
                   var values = this.candidate.cultureValues.split(",");
                   for(var i=0;i<values.length;i++)
                   {
                       for(var j=0;j<this.valueSets.length;j++)
                       {
                           for(var k=0;k<this.valueSets[j].values.length;k++)
                           {
                               if(values[i]==this.valueSets[j].values[k].value)
                               {
                                   this.valueSets[j].values[k].selected=true;
                                   this.clickedValue(this.valueSets[j].values[k],j);
                               }
                           }
                       }
                   }
              }
              
          }
          this.loadDiscoveriesOfCandidate();
          this.loadTags();
      });
  }
  discoveries:any=[];
  loadDiscoveriesOfCandidate():void
  {
      var url = "mainservice/recruitment/shortlisting/shortlistByCandidateId/"+this.candidateId;
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          if(data["result"]===200)
          {
             this.discoveries = data["dataArray"];  
          }
      });
  }
  urlPrefix:any="";
  loadExperiences():void
  {
      var url = "mainservice/recruitment2/candidate/"+this.candidateId+"/experience";
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          if(data["result"]===200 && data["dataArray"]!=null)
          {
             this.experiences = data["dataArray"];   
          }
      });
  }
  loadEducation():void
  {
      var url = "mainservice/recruitment2/candidate/"+this.candidateId+"/education";
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          if(data["result"]===200 && data["dataArray"]!=null)
          {
             this.education = data["dataArray"];   
          }
      });
  }
  loadSectors():void
  {
      var url = "mainservice/recruitment2/candidate/"+this.candidateId+"/sector";
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          if(data["result"]===200 && data["dataArray"]!=null)
          {
             this.sectors = data["dataArray"];   
          }
      });
  }
  loadTags():void
  {
      var url = "mainservice/recruitment2/candidate/"+this.candidateId+"/tag";
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          if(data["result"]===200 && data["dataArray"]!=null)
          {
             this.tags = data["dataArray"];   
          }
      });
  }
   
  tags:any=[];newTag:any="";availableTags:any=[];
  loadAvaialbleTags():void
  {
      this.availableTags=[];
      var url = "mainservice/recruitment2/availableTags?searchText="+this.newTag;
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          if(data["result"]===200 && data["dataArray"]!=null)
          {
             this.availableTags = data["dataArray"];   
          }
      });
  }
  editTag:any=false;
  addTag():void
  {
      if(this.newTag=='Select')
          return;
      for(var i=0;i<this.tags.length;i++)
      {
          if(this.tags[i].name==this.newTag)
          {
              return;
          }
      }
      this.tags.push({name:this.newTag});
      this.newTag='';
      this.updateTags();
  }
  removeTag(obj:any):void
  {
      for(var i=0;i<this.tags.length;i++)
      {
          if(this.tags[i]==obj)
          {
              this.tags.splice(i,1);
          }
      }
      this.updateTags();
  }
  updateTags():void
  {
      for(var i=0;i<this.tags.length;i++)
      {
          this.tags[i]["recruitmentCandidate"]=this.candidate;
      }
      this.commonService.showProcessingIcon();
      this.commonService.post("mainservice/recruitment2/tag/"+this.candidate.id,this.tags).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          this.editTag=false;      
          this.loadTags();
      });
  }
  imgPreview:any;
  uploadForm: FormGroup = new FormGroup({});
  fileToUpload: File | null = null;
  cvToUpload: File | null = null;
  onProfilePicSelect(files:FileList) 
  {
      // if(files.item(0).size > 307200)//300 Kb limit
      // {
      //     this.commonService.showErrorMessage("Error","File size too big. Please choose a file less than 300 KB.");
      //     return ;
      // }
      // this.fileToUpload = files.item(0);        
      // this.imgPreview =  this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.fileToUpload));
      // this.uploadFile(this.candidate);
  }
  uploadFile(obj:any) 
  {
      if((this.fileToUpload && this.fileToUpload!==null) || this.cvToUpload && this.cvToUpload!=null)
      {
          const formData: FormData = new FormData();
          if(this.fileToUpload && this.fileToUpload!==null)
          {
              var fileName = this.fileToUpload.name;
              fileName = this.commonService.removeSpecialChar(fileName,"-.","-");
              formData.append('image', this.fileToUpload, fileName);
          }
          if(this.cvToUpload && this.cvToUpload!==null)
          {
              var fileName = this.cvToUpload.name;
              fileName = this.commonService.removeSpecialChar(fileName,"-.","-");
              formData.append('cv', this.cvToUpload, fileName);
          }
          formData.append('id', obj["id"]);

          let headers = new HttpHeaders({
                 "Accept": "application/json" ,
                 'Authorization': localStorage.getItem("accesstoken")+""
              });
          let options = { headers: headers };
          this.commonService.showProcessingIcon();
          this.commonService.post2("mainservice/recruitment2/candidateFiles", formData,options).subscribe((data:any) => 
          {
              this.commonService.hideProcessingIcon();
              this.loadCandidate();
              this.commonService.showInfoMessage("CV Uploaded", "Thank You for uploading CV");
              this.edit.cv = false;
              this.editBasicDetails=false;
          });
      }
  }
  editContactInfo:any=false;editSocial:any=false;hideExtraDetails:any=false;editSector:any=false;editBasicDetails:any=false;editWorkExp:any=false;editEdu:any=false;
  message:any="";
  experience:any={};
  educationObj:any={};
  valuesArray:any=[];
 selectedValueSet1:any;selectedValueSet2:any;selectedValueSet3:any;
clickedValue(value:any,set:any)
{
    if(set==0)
    {        
      if(this.selectedValueSet1!==undefined)
      {
          this.selectedValueSet1.selected=false;
          if(this.selectedValueSet1.value==value.value)
              this.selectedValueSet1 = undefined;
          else
              this.selectedValueSet1 = value;
          
      }
      else
          this.selectedValueSet1 = value;
    }
    if(set==1)
    {
      
      if(this.selectedValueSet2!==undefined)
      {
          this.selectedValueSet2.selected=false;
          if(this.selectedValueSet2.value==value.value)
              this.selectedValueSet2 = undefined;
          else
              this.selectedValueSet2 = value;
          
      }
      else
          this.selectedValueSet2 = value;
    }
    if(set==2)
    {
      if(this.selectedValueSet3!==undefined)
      {
          this.selectedValueSet3.selected=false;
          if(this.selectedValueSet3.value==value.value)
              this.selectedValueSet3 = undefined;
          else
              this.selectedValueSet3 = value;
          
      }
      else
          this.selectedValueSet3 = value;
      
    }
}



  updateCandidate():void
  {
      if(!this.candidate.cultureValues)
      {
        if(!this.selectedValueSet1|| !this.selectedValueSet2|| !this.selectedValueSet3)
        {
            this.commonService.showErrorMessage("Error","Please select the culture values.");
            return;
        }
      }
      if(!this.candidate["name"] || this.candidate["name"].toString().trim()=="")
      {
          this.message = "Please enter the name of the candidate";
          this.commonService.showErrorMessage("Error",this.message);
          return;
      }
      if(this.experience.designation && this.experience.designation.length>0)
      {
          this.message = "Looks like you have forgot to add the experience. Please click on the add button.";
          this.commonService.showErrorMessage("Error",this.message);
          return;
      }
       if(this.educationObj.course && this.educationObj.course.length>0)
      {
          this.message = "Looks like you have forgot to add the qualification. Please click on the add button.";
          this.commonService.showErrorMessage("Error",this.message);
          return;
      }
      if(this.candidate["expectedCtc"]==undefined || (this.candidate["expectedCtc"] && this.candidate["expectedCtc"]>500))
      {
          this.message = "Please enter expected CTC of the candidate in LPA";
          this.commonService.showErrorMessage("Error",this.message);
          return;
      }
      if(this.candidate["currentCtcTotal"] && this.candidate["currentCtcTotal"]>500)
      {
          this.message = "Please enter current CTC of the candidate in LPA";
          this.commonService.showErrorMessage("Error",this.message);
          return;
      }
      this.message = "Saving....";
      if(this.candidate["experience"]==undefined || this.candidate["experience"]<0)
          this.candidate["experience"]=undefined;  
      this.commonService.showProcessingIcon();
      if(this.selectedValueSet1.value && this.selectedValueSet2.value && this.selectedValueSet3.value)
      {
        this.valuesArray = [];
        this.valuesArray.push(this.selectedValueSet1.value);
        this.valuesArray.push(this.selectedValueSet2.value);
        this.valuesArray.push(this.selectedValueSet3.value);
        this.candidate.cultureValues = this.valuesArray.toString();
      }
      this.commonService.post("mainservice/recruitment2/candidate",this.candidate).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          this.loadCandidate();
          this.commonService.showInfoMessage("info","Updated done :)")
          this.editContactInfo=false; 
          this.edit.cultureValue = false;
          this.editSocial=false;  
          this.editSector=false;  
          this.editBasicDetails=false;    
      });
  }
  edit: any = {};
  updateSectors():void
  {
      for(var i=0;i<this.sectors.length;i++)
      {
          this.sectors[i]["recruitmentCandidate"]=this.candidate;
      }
      this.commonService.showProcessingIcon();
      this.commonService.post("mainservice/recruitment2/sector",this.sectors).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          //this.editSector=false;          
          this.loadAvaialbleSectors();
      });
  }
  updateEducation(obj:any):void
  {
      for(var i=0;i<this.education.length;i++)
      {
          this.education[i]["recruitmentCandidate"]=obj;
      }
      this.commonService.showProcessingIcon();
      this.commonService.post("mainservice/recruitment2/education",this.education).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          this.editEdu=false;          
      });
  }
  updateExperience(obj:any):void
  {
      for(var i=0;i<this.experiences.length;i++)
      {
          this.experiences[i]["recruitmentCandidate"]=obj;
      }
      this.commonService.showProcessingIcon();
      this.commonService.post("mainservice/recruitment2/experience",this.experiences).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          this.editWorkExp=false;
      });    
      
  }
  
  newSector:any="";
  addSector():void
  {
      if(this.newSector=='Select')
          return;
      this.sectors.push({name:this.newSector});
      this.newSector='';
  }
  availableSectors:any=[];
  loadAvaialbleSectors():void
  {
      this.availableSectors=[];
      var url = "mainservice/recruitment2/open/availableSectors?searchText="+this.newSector;
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data:any) => 
      {
          this.commonService.hideProcessingIcon();
          if(data["result"]===200 && data["dataArray"]!=null)
          {
             this.availableSectors = data["dataArray"];   
          }
      });
  }
  addExperience():void
  {
      if(!this.experience.designation || this.experience.designation.trim().length==0)
          return;
      if(!this.experience.company || this.experience.company.trim().length==0)
          return;
      if(!this.experience.fromYear || this.experience.fromYear<1985)
          return;
      if(!this.experience.toYear || this.experience.toYear<1985)
          return;
      if(this.experience.toYear<this.experience.fromYear)
          return;
      this.experiences.push(this.experience);
      this.experience={designation:"",company:"",fromYear:"",toYear:""};
      this.updateExperience(this.candidate);
  }
  addEducation():void
  {
      if(!this.educationObj.course || this.educationObj.course.trim().length==0)
          return;
      if(!this.educationObj.institution || this.educationObj.institution.trim().length==0)
          return;
      if(!this.educationObj.year || this.educationObj.year<1985)
          return;
      this.education.push(this.educationObj);
      this.educationObj={course:"",institution:"",year:""};
      this.updateEducation(this.candidate);
  }
  removeExperience(obj:any):void
  {
      for(var i=0;i<this.experiences.length;i++)
      {
          if(this.experiences[i]===obj)
          {
              this.experiences.splice(i,1);
          }
      }
      this.updateExperience(this.candidate);
  }
  removeEducation(obj:any):void
  {
      for(var i=0;i<this.education.length;i++)
      {
          if(this.education[i]===obj)
          {
              this.education.splice(i,1);
          }
      }
      this.updateEducation(this.candidate);
  }
  removeSector(obj:any):void
  {
      for(var i=0;i<this.sectors.length;i++)
      {
          if(this.sectors[i]===obj)
          {
              this.sectors.splice(i,1);
          }
      }
  }
  file:any;
    onCvSelect(event:any) 
    {
        if (event.target.files.length == 0) {
            return;
          }
          
          this.file = event.target.files[0];
          if (this.file.size > 10485760 * 5) {
            //10 MB limit
            this.message =
              'File size too big. Please choose a file less than 10mb.';
            this.commonService.showErrorMessage('Error', this.message);
            return;
          }
          this.cvToUpload = event.target.files[0];
         this.uploadFile(this.candidate);     
    }
  
  

}
