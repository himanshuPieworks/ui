import { Component, OnInit } from '@angular/core';
import {PieworksCommonService} from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-user-role-rights',
  templateUrl: './user-role-rights.component.html',
  styleUrls: ['./user-role-rights.component.scss']
})
export class UserRoleRightsComponent implements OnInit {

    constructor(public commonService: PieworksCommonService) {
        this.breadCrumbItems = [
        { label: 'Home', link: '/', active: false },
        { label: 'Manage',link:'/recr/manage', active: false },
        { label: 'RBAC', link:'/recr/manage/user-roles', active: false },
        { label: 'Role to feature mapping', link:'/recr/manage/user-role-rights', active: true }
      ];
    }
    breadCrumbItems:any=[];
    ngOnInit(): void {
        this.loadFeatures();
        this.loadRoles();
    }
    nodes:any=[];
    loadFeatures():void
    {
        var url = "mainservice/framework/rbac/allFeatures?roleId="+this.selectedRole; 
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.nodes = data["dataArray"];   
            }
        });
    }
    clickedNode(item:any):void
    {
        setTimeout(()=>{
            for(var i=0;i<item.children.length;i++)
            {
                item.children[i].isSelected = item.isSelected; 
                this.clickedNode(item.children[i]);                   
            }
        },500);
    }
    filterChanged():void
    {
        setTimeout(()=>{this.loadFeatures();},500);
    }
    roles=[];pageNum=1;pageSize=10000;selectedRole=-1;
    loadRoles():void
    {
        this.pageNum=1;
        var url = "mainservice/framework/rbac/roles?name=&pageNum="+this.pageNum+"&pageSize="+this.pageSize;   
        
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.roles = data["dataArray"];   
            }
        });
    }
    save():void
    {
        if(this.selectedRole==undefined)
        {
            this.commonService.showInfoMessage("Info","Please select a role to continue");
            return;
        }
        var url = "mainservice/framework/rbac/roleRights?roleId="+this.selectedRole;   
        this.commonService.showProcessingIcon();
        this.commonService.post(url,this.nodes).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.loadFeatures();
               this.commonService.goTop();
                setTimeout(() => {this.commonService.showInfoMessage("Info","Updated rights for the selected role.");},1000);
            }
        });
    }
    menuOptions:any=["User roles","User to role mapping"];
    handleMenu(option:any):void
    {   
        if(option=="User roles")
            this.commonService.navigateTo("recr/manage/user-roles",undefined)
        else if(option=="User to role mapping")
            this.commonService.navigateTo("recr/manage/user-role-mapping",undefined)
    }
}
