import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-community-open-jd',
  templateUrl: './community-open-jd.component.html',
  styleUrls: ['./community-open-jd.component.scss']
})
export class CommunityOpenJDComponent {

  reqId:any;
  requirement:any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    public commonService: PieworksCommonService,
    private httpClient: HttpClient,private meta: Meta, private title: Title){
      this.reqId = this.route.snapshot.paramMap.get('reqId');

      this.loadRequirementDetails();

  }

  

  clickOnApply:boolean = false;

  onApply()
  {
    this.clickOnApply = true;
  }

  loadRequirementDetails(): void {
    var url = 'mainservice/recruitment/open/requirement/' + this.reqId;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.requirement = data['dataObject'];
        console.log("This is open Requirement : ", this.requirement)
      }
     
    });
  }

}
