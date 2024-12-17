import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {PieworksCommonService} from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-req-timeline',
  templateUrl: './req-timeline.component.html',
  styleUrls: ['./req-timeline.component.scss']
})
export class ReqTimelineComponent {
     // bread crumb items
    breadCrumbItems!: Array<{}>;
    constructor(private route: ActivatedRoute, public commonService: PieworksCommonService)
    {
        
    }
    ngOnInit(): void {
      /**
       * BreadCrumb
       */
       this.reqId = this.route.snapshot.paramMap.get('id');
       this.loadRemarks();
       this.loadRequirementDetails();
      this.breadCrumbItems = [
        { label: 'Home', link: '/', active: false },
        {label: 'Earn', link: '/recr/wp', active: false},
        {label: 'Mandate', link: '/recr/wp/' + this.reqId, active: false},
        { label: 'Timeline', active: true }
      ];
    }
    reqId:any;remarks:any=[];requirement:any={};
    loadRequirementDetails():void
    {
        var url = "mainservice/recruitment/requirement/"+this.reqId;
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.requirement = data["dataObject"]; 
            }
        });
    }
    loadRemarks()
    {
        this.remarks=[];
        var url = "mainservice/framework/generic/remark/"+this.reqId+"?category=recruitment-requirement-timeline";
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.remarks = data["dataArray"];   
            }
        });
    }
}
