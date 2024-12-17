import { Component, OnInit } from '@angular/core';
import {PieworksCommonService} from '../../../common/pieworkscommon.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-talent-review',
  templateUrl: './talent-review.component.html',
  styleUrls: ['./talent-review.component.scss']
})
export class TalentReviewComponent {

  constructor(private commonService: PieworksCommonService,private route: ActivatedRoute) { 
    this.shortlistId = this.route.snapshot.paramMap.get('id');
    this.getPostOfferFollowUp();
  }
  getPostOfferFollowUp():void
    {
        var url = "mainservice/recruitment/shortlisting/open/getPostOfferFollowUp/"+this.shortlistId;
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
                if(data["dataObject"])
                    this.followUp = data["dataObject"];
            }
        });
    }  
  ngOnInit(): void {
    
  }
  followUp:any={"followUpOneResult":"Select","followUpOneRemark":"","followUpTwoResult":"Select","followUpTwoRemark":"",
    "followUpThreeResult":"Select","followUpThreeRemark":"","followUpFourResult":"Select","followUpFourRemark":"",
    "followUpFiveResult":"Select","followUpFiveRemark":"","followUpSixResult":"Select","followUpSixRemark":"",
    "followUpSevenResult":"#ffff99","followUpSevenRemark":"","followUpEightResult":"Select","followUpEightRemark":"","followUpNineResult":"Select","followUpNineRemark":""};
  welcome="";
  message="";
  shortlistId:any;
  submit():void{
        this.followUp.shortlistingId = this.shortlistId;
        this.followUp.followUpSevenResult = "#ffff99";
        this.commonService.showProcessingIcon();
    this.commonService.post("mainservice/recruitment/shortlisting/open/postOfferFollowUp",this.followUp).subscribe((data:any) => 
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
  selectedNps:number=0;

}
