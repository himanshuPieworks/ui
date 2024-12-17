import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import {PieworksCommonService} from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
    breadCrumbItems = [
    { label: 'Home', active: false, link: '/' },
    { label: 'Notifications', active: true },
  ];
 constructor(public commonService: PieworksCommonService,private router: Router)
 {
      this.loadNotifications(true);
      this.urlPrefix = this.commonService.urlPrefix;
      
      this.filterChanged();
      window.onscroll = (ev)=> {
          if(this.block)
            return;
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight-1000)) {
        // you're at the bottom of the page 
            console.log("reached bottom");
            if(this.scrollPosition!=window.innerHeight + window.scrollY)
            {
                this.block=true;
                this.scrollPosition = window.innerHeight + window.scrollY;
                this.next();
            }
        }
        this.scrollY=window.scrollY;
    };
      if(this.commonService.isMobileDevice)
        this.showFilter=false;
    }
    block=false;
    scrollPosition=0;scrollY=0;
    membersArray:any=[];clientAnchors:any=[];
    
    amIAceMaker=false;
    
  communityId:any;
  ngOnInit(): void {
  }
  tableView=true;showFilter=false;
  urlPrefix="";
   rspps :any= []; 
   paginationMessage = "";
   searchText = "";
   
   reqHandle:any;
   clearFilters():void
   {
    this.searchText="";
    this.pageNum=1;
    this.loadNotifications(true);
   }
   analysis:any={};
   havingPendingPositions='na';
   havingClosedPositions='na';
   loadNotifications(filterChanged:any):void
   {
       
        var localClientAnchors = this.clientAnchors.toString();
        if(this.clientAnchors.length===0)
            localClientAnchors = "-1";  
       var url = "mainservice/framework/notification/getByUserId/"+this.commonService.user.id+"?pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&userrole="+localStorage.getItem("role");    
        if(this.reqHandle)
        {
            this.reqHandle.unsubscribe();
        }
        this.commonService.showProcessingIcon();
       this.reqHandle = this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(filterChanged)
                this.rspps = [];  
            if(data["result"]===200)
            {
               this.analysis = data["dataObject"];
               this.block=false;
               //this.rspps = this.rspps.concat(data["dataArray"]);   
               this.paginationMessage = data["message"];
               var newBatch = data["dataArray"];
               this.rspps = this.rspps.concat(newBatch);   
            }
            if(this.rspps.length===0 && this.pageNum>1)
            {
                this.pageNum=this.pageNum-1;
            }
            
        });
   }

   pageNum=1;
   pageSize=20;
   next():void
   {
       if(this.paginationMessage.length>0)
       {
           var temp = this.paginationMessage.split(" of ");
           if(parseInt(temp[1])<=this.pageNum)
                return;
       }
        this.pageNum = this.pageNum+1; 
        this.loadNotifications(false);
   }
   previous():void
   {
      if(this.pageNum==1)
      return;
      this.pageNum = this.pageNum-1; 
      this.loadNotifications(false);
   }
   first():void
   {
       this.pageNum=1;
       this.loadNotifications(false);
   }
   last():void
   {
       var temp = this.paginationMessage.split(" of ");
       this.pageNum=parseInt(temp[1]);
       this.loadNotifications(false);
   }
   filterChanged():void
   {
       this.rspps = [];
       setTimeout(()=>{
           this.pageNum=1;
           this.loadNotifications(true);
        },1000);
   }
   clientHandle:any;
   clients:any=[];
   client="";
   nothing():void{}
   menuOptions=["Edit","Assign To Mandate"];
   selectedRspp:any;
    
   buttonLabel="Assign";
}

