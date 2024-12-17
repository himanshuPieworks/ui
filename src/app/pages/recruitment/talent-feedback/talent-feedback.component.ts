import { Component, OnInit } from '@angular/core';
import {PieworksCommonService} from '../../../common/pieworkscommon.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-talent-feedback',
  templateUrl: './talent-feedback.component.html',
  styleUrls: ['./talent-feedback.component.scss']
})
export class TalentFeedbackComponent {
 constructor(private commonService: PieworksCommonService,private route: ActivatedRoute) { 
    var temp:any = this.route.snapshot.paramMap.get('id');
    temp = temp?.split("-");
    this.shortlist.id=temp[0];
    this.shortlist.npsValidationKey=temp[1];
    this.commonService.get("mainservice/recruitment/shortlisting/openresource/nps/shortlist?id="+temp[0]+"&key="+temp[1]).subscribe((data:any) => 
    { 
        if(data["result"]==200)
            this.welcome = data["message"];
        else
            this.message = data["message"];
    });
  }

  ngOnInit(): void {
    
  }
  welcome="";
  message="";
  shortlist:any={};
  submit():void{
    this.commonService.showProcessingIcon();
    this.shortlist.nps = this.selectedNps;
      this.commonService.post("mainservice/recruitment/shortlisting/openresource/nps", this.shortlist).subscribe((data: any) => 
    {
        this.commonService.hideProcessingIcon();
        if(data["result"]==200)
        {
            this.message = "Thanks for providing the feedback.";
        }
        else{
          this.message = data["message"];
        }
    });
  }
  selectedNps:any;

}
