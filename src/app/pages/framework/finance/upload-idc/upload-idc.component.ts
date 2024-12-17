import { Component } from '@angular/core';
import {PieworksCommonService} from '../../../../common/pieworkscommon.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-upload-idc',
  templateUrl: './upload-idc.component.html',
  styleUrls: ['./upload-idc.component.scss']
})
export class UploadIdcComponent {
constructor(public commonService: PieworksCommonService) { }

  ngOnInit(): void {
      this.loadDocuments();
  }
  breadCrumbItems = [{label: 'Home', active: false, link: '/'}, {label: 'Manage', active: false, link: '/recr/manage'}, 
  {label: 'Finance', active: false, link: '/fw/finance'},{label: 'Upload idc', active: true, link: '/recr/manage/finance/upload-idc'}];
  
    file:any;message:any;documents:any=[];
    uploadForm: FormGroup = new FormGroup({});  
    fileToUpload: File | null = null;
    onProfilePicSelect(event:any) 
    {
        if(event.target.files.length==0)
        {
            return;
        }  
        this.file = event.target.files[0];
        if(this.file.size > 60720000)//300*100 Kb limit
        {
            this.message = "File size too big. Please choose a file less than 600 KB.";
            this.commonService.showErrorMessage("Error",this.message);
            return ;
        }
        this.fileToUpload = event.target.files[0]; 
    }
    uploadFile() 
    {
        if((this.fileToUpload && this.fileToUpload!==null))
        {
            const formData: FormData = new FormData();
            if(this.fileToUpload && this.fileToUpload!==null)
            {
                var fileName:any = this.fileToUpload.name;
                fileName = this.commonService.removeSpecialChar(fileName,"-.","-");
                formData.append('contract', this.fileToUpload, fileName);
                formData.append('domain', "recruitment");
            }

            let headers = new HttpHeaders({
                   "Accept": "application/json" ,
                   'Authorization': ""+localStorage.getItem("accesstoken")+""
                });
            let options = { headers: headers };
            this.commonService.showProcessingIcon();
            this.commonService.post2("mainservice/framework2/uploadIndependentContract", formData,options).subscribe((data:any) => 
            {
                (<HTMLInputElement>document.getElementById("fileinput")).value="";
                this.commonService.showSuccessMessage("Update","Uploaded the document successfully.");
                this.commonService.hideProcessingIcon();
                this.message = data["message"];
                this.loadDocuments();
            });
        }
    }
    loadDocuments():void
    {
        this.commonService.get("mainservice/framework2/open/independentContracts?domain=recruitment").subscribe((data:any) => 
        {
            this.documents = data["dataArray"];
        });
    }

}
