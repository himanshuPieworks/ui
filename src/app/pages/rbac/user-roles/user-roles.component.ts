import { Component, OnInit } from '@angular/core';
import {PieworksCommonService} from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  breadCrumbItems:any=[];
  constructor(public commonService: PieworksCommonService) {
        this.breadCrumbItems = [
        { label: 'Home', link: '/', active: false },
        { label: 'Manage',link:'recr/manage', active: false },
        { label: 'RBAC', active: true }
      ];
    }
    ngOnInit(): void {
        
        this.loadRoles(true);
        window.onscroll = (ev)=> {
          if(this.block)
            return;
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight-1000)) {
        // you're at the bottom of the page 
            if(this.scrollPosition!=window.innerHeight + window.scrollY)
            {
                this.block=true;
                this.scrollPosition = window.innerHeight + window.scrollY;
                this.next();
            }
        }
        this.scrollY = window.scrollY;
        }
    }
    showAssignedUsers(role:any):void
    {
        var url ='mainservice/framework2/forward?api=frameworkservice/framework/rbac/mappingByRoleId?roleId='+role.id;
        this.commonService.post(url,role).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            { 
               var users = "";
               for(var i=0;i<data["dataArray"].length;i++)
               {
                   users = users+data["dataArray"][i].name+", ";
               }
               this.commonService.showInfoMessage(role.name,users);
            }
        });
    }
    ngOnDestroy(): void {
        window.onscroll = (ev) => {};
    }
    menuOptions:any=["User to role mapping","Role to feature mapping"];
    handleMenu(option:any):void
    {   
        if(option=="User to role mapping")
            this.commonService.navigateTo("recr/manage/user-role-mapping",undefined)
        else if(option=="Role to feature mapping")
            this.commonService.navigateTo("recr/manage/user-role-rights",undefined)
    }
    scrollY:any=0;
    block:any=false;scrollPosition:any=0;
    roles:any=[];reqHandle:any;
    roleName:any="";
    description:any="";
    save():void
    {
        var url = "mainservice/framework/rbac/role";
        var obj:any = {name:this.roleName,description:this.description};
        this.commonService.post(url,obj).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            { 
               this.roleName="";
               this.description="";
               this.loadRoles(true);
                this.commonService.showInfoMessage("Info",data["message"]);
            }
        });
    }
    modify(role:any):void
    {
        var url = "mainservice/framework/rbac/role";
        this.commonService.post(url,role).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            { 
               this.loadRoles(true);
               this.commonService.showInfoMessage("Info",data["message"]);
            }
        });
    }
    delete(role:any):void
    {
        var url = "mainservice/framework/rbac/deleteRole";
        this.commonService.post(url,role).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            { 
               this.loadRoles(true);
               this.commonService.showInfoMessage("Info",data["message"]);
            }
        });
    }
    loadRoles(filterChanged:any):void
    {
        if(this.pageNum<1)
            this.pageNum=1;
        var url = "mainservice/framework/rbac/roles?name=&pageNum="+this.pageNum+"&pageSize="+this.pageSize;   
        if(this.reqHandle)
        {
            this.reqHandle.unsubscribe();
        }
        this.commonService.showProcessingIcon();
        this.reqHandle = this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.block=false;
               var newBatch = data["dataArray"];   
               if(!filterChanged)
                this.roles = this.roles.concat(newBatch);   
               else
                this.roles = newBatch;
               this.paginationMessage = data["message"];
            }
        });
    }
    pageNum=1;
    pageSize=12;paginationMessage="";
    next():void
    {
        if(this.paginationMessage.length>0)
        {
            var temp = this.paginationMessage.split(" of ");
            if(parseInt(temp[1])<=this.pageNum)
                 return;
        }
         this.pageNum = this.pageNum+1; 
         this.loadRoles(false);
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
}
