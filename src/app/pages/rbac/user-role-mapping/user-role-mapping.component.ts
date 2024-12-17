import { Component, OnInit } from '@angular/core';
import {PieworksCommonService} from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-user-role-mapping',
  templateUrl: './user-role-mapping.component.html',
  styleUrls: ['./user-role-mapping.component.scss']
})
export class UserRoleMappingComponent implements OnInit {

constructor(public commonService: PieworksCommonService) {
        this.breadCrumbItems = [
        { label: 'Home', link: '/', active: false },
        { label: 'Manage',link:'/recr/manage', active: false },
        { label: 'RBAC', link:'/recr/manage/user-roles', active: false },
        { label: 'User Role Mapping', link:'', active: true }
      ];
    }

    ngOnInit(): void {
        this.loadActiveUsers();
        this.loadRoles(true);
    }
    roles:any=[];assignedRoles:any=[];
    roleName="";selectedRoles:any;selectedUserId:any;breadCrumbItems:any=[];
    menuOptions:any=["User roles","Role to feature mapping"];
    handleMenu(option:any):void
    {   
        if(option=="User roles")
            this.commonService.navigateTo("recr/manage/user-roles",undefined)
        else if(option=="Role to feature mapping")
            this.commonService.navigateTo("recr/manage/user-role-rights",undefined)
    }
    save():void
    {
        var url = "mainservice/framework/rbac/userRoleMapping?userId="+this.selectedUserId;
        this.commonService.post(url,this.assignedRoles).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            { 
               this.roleName="";
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
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.roles = data["dataArray"];
               this.paginationMessage = data["message"];
               this.loadAssignedRoles(filterChanged);
            }
        });
    }
    loadAssignedRoles(filterChanged:any):void
    {
        if(!this.selectedUserId)
            this.selectedUserId=-1;
        var url = "mainservice/framework/rbac/assignedRoles?userId="+this.selectedUserId;
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.assignedRoles = data["dataArray"];
               for(var i=0;i<this.assignedRoles.length;i++)
               {
                    for(var j=0;j<this.roles.length;)
                    {
                        if(this.assignedRoles[i].name==this.roles[j].name)
                        {
                            this.roles.splice(j,1);
                            break;
                        }
                        else
                            j++;
                    }
               }
            }
        });
    }
    loadActiveUsers():void
    {
        if(this.pageNum<1)
            this.pageNum=1;
        var url = "mainservice/framework/rbac/activeUsers?searchString=&pageNum="+this.pageNum+"&pageSize="+this.pageSize;
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.users = data["dataArray"];   
            }
        });
    }
    pageNum=1;users:any=[];
    pageSize=10000;paginationMessage="";
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
    filterChanged():void
    {
        setTimeout(()=>{this.loadRoles(true);},500);
    }
    assign():void
    {
        if(this.rolesToAdd.length==0)
            return;
        this.assignedRoles = this.assignedRoles.concat(this.rolesToAdd);
        for(var j=0;j<this.rolesToAdd.length;j++)
        {
            for(var i=0;i<this.roles.length;)
            {
                if(this.roles[i].name==this.rolesToAdd[j].name)
                {
                    var s = this.roles[i];
                    !s.color?s.color='blue':s.color='';
                    this.roles.splice(i,1);
                    break;
                }
                else
                    i=i+1;
            }
        }
        this.rolesToAdd=[];
    }
    rolesToRemove:any=[];rolesToAdd:any=[];
    remove():void
    {
        if(this.rolesToRemove.length==0)
            return;
        this.roles = this.roles.concat(this.rolesToRemove);
        for(var j=0;j<this.rolesToRemove.length;j++)
        {
            for(var i=0;i<this.assignedRoles.length;)
            {
                if(this.assignedRoles[i].name==this.rolesToRemove[j].name)
                {
                    var s = this.assignedRoles[i];
                    !s.color?s.color='blue':s.color='';
                    this.assignedRoles.splice(i,1);
                    break;
                }
                else
                    i=i+1;
            }
        }
        this.rolesToRemove=[];
    }
    clickedOnAvailableRole(s:any):void
    {        
        !s.color?s.color='blue':s.color='';        
        var index = this.rolesToAdd.indexOf(s);
        index==-1?this.rolesToAdd.push(s):this.rolesToAdd.splice(index,1);
    }
    clickedOnAssignedRole(s:any):void
    {        
        !s.color?s.color='blue':s.color='';        
        var index = this.rolesToRemove.indexOf(s);
        index==-1?this.rolesToRemove.push(s):this.rolesToRemove.splice(index,1);
    }
}

