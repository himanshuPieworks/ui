import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-my-wip',
  templateUrl: './my-wip.component.html',
  styleUrls: ['./my-wip.component.scss']
})
export class MyWipComponent {
    user:any={};showAllStatusForWip:boolean=false;discoveries:any=[];modifiedStartDate:any;modifiedEndDate:any;communityId:any;
    activeDiscoveryPagination:any = {pageNum:1,pageSize:100,paginationMessage:"",id:"activeDiscovery"};
    constructor(private router:Router,public commonService: PieworksCommonService,private route: ActivatedRoute){
        this.user = JSON.parse(localStorage.getItem("user")+"");
        this.communityId=localStorage.getItem('communityId');
        var arr = this.commonService.getStartingEndingDates();
        this.modifiedStartDate = this.commonService.getFormatedDate(arr[0],"yyyy-MM-dd HH:mm:ss");
        this.modifiedEndDate = this.commonService.getFormatedDate(arr[1],"yyyy-MM-dd HH:mm:ss");
        this.loadMyActiveDiscoveries();
    }
    loadMyActiveDiscoveries():void
    {
        var statusIds = "6,7,8,9,10,11,12,13,14,15,17,18,19";
        if(this.showAllStatusForWip)
            statusIds = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19";
        var url = "mainservice/recruitment/shortlisting/activeDiscovery?communityId="+localStorage.getItem('communityId')+"&statusIds="+statusIds+"&userId="+this.user.id+"&pageNum="+this.activeDiscoveryPagination.pageNum+"&pageSize="+this.activeDiscoveryPagination.pageSize;
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            this.discoveries = []; 
            if(data["result"]===200)
            {
               this.discoveries = data["dataArray"];  
               this.activeDiscoveryPagination.paginationMessage = data["message"] ;
            }
            if(this.discoveries.length===0 && this.activeDiscoveryPagination.pageNum>1)
            {
                this.activeDiscoveryPagination.pageNum=this.activeDiscoveryPagination.pageNum-1;
            }
        });
    }
    toggleClassOnRowClick(row:any):void
    {
        if(!row.classOnRowClick)
        {
            row.classOnRowClick = "tr-on-select";
            return;
        }
        if(row.classOnRowClick && row.classOnRowClick.length===0)
            row.classOnRowClick = "tr-on-select";
        else
            row.classOnRowClick="";
    }
    setDiscFilter(id:any,statusId:any):void
    {
        //this.requirementId+"::"+localDiscoverers+"::"+this.searchText+"::"+localStatus+"::"+localClients+"::"+localRoles+"::"+this.top50+
        // "::"+this.minCtc+"::"+this.maxCtc+"::"+this.minExp+"::"+this.maxExp+"::"+localClientAnchors
        var filter = "-1::-1::::"+statusId+"::"+id+"::-1::false::0::500::0::50::-1";
        localStorage.setItem("discFilter",filter);
        this.router.navigate(["community/"+localStorage.getItem("communityId")+"/domain/recruitment/requirements/-1/allShortlisting/"],{queryParams:{modifiedStartDate: this.modifiedStartDate,modifiedEndDate:this.modifiedEndDate}});
    }
}
