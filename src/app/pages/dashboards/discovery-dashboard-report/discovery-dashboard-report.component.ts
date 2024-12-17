import { Component, OnInit,Input, ViewChild,TemplateRef } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-discovery-dashboard-report',
  templateUrl: './discovery-dashboard-report.component.html', 
  styleUrls: ['./discovery-dashboard-report.component.scss']
})
export class DiscoveryDashboardReportComponent{
    @ViewChild("fullscreen") fullscreen:any;
  constructor(private modalService: BsModalService,private router:Router,public commonService: PieworksCommonService) {
    this.user = JSON.parse(localStorage.getItem("user")+"");
    this.communityId=localStorage.getItem('communityId');
    this.year=new Date().getFullYear();
    this.years.push(this.year);
    this.years.push(this.year-1);
    this.years.push(this.year-2);
    this.years.push(this.year-3);    
    this.month=new Date().getMonth()+1;
    if(this.name.indexOf("Monthly")!=-1 && localStorage.getItem("monthly_dashboard_filter"))
    {
        var filter = localStorage.getItem("monthly_dashboard_filter");
        if(filter)
        {
            this.year = (parseInt(filter.split("#")[0]));
            this.month = (parseInt(filter.split("#")[1]));
        }
    }
    this.loadDiscoveryCommunityReport();
    this.loadMember();
  }
    config = {
    backdrop: true,
    ignoreBackdropClick: true
  }; 
  modalRef?: BsModalRef;
  @ViewChild("performanceWindow") performanceWindow:any;
  member:any;@Input("detailedView") detailedView:any=false;user;
  printd(d:any):any
  {
      return (JSON.stringify(d));
  }
  loadMember():void
  {
      var url:any = "mainservice/framework/members/"+this.communityId+"?acceptanceByAceValues=0,1,2,3,4,5,6&acceptanceByAceMakerValues=0,1,2,3,4,5,6&userId="+this.user.id+"&roleInCommunity=0,1";
      this.commonService.get(url).subscribe((data:any) => 
        {
            if(data["result"]===200)
            {
               this.member = data["dataArray"][0];  
            }
        });
  }
  years:any=[];year:any;communityId:any;
  months:any=[{id:1,name:"Jan"},{id:2,name:"Feb"},{id:3,name:"Mar"},{id:4,name:"Apr"},{id:5,name:"May"},{id:6,name:"Jun"},{id:7,name:"Jul"},{id:8,name:"Aug"},{id:9,name:"Sep"},{id:10,name:"Oct"},{id:11,name:"Nov"},{id:12,name:"Dec"}];
  month:any;
  lastweek:any=false;
  createdOnFrom:any="";createdOnTill:any="";
  @Input() name: string="";
    Discoveries:any=[];
    Table:any=[];    
    DiscoveryPagination:any = {pageNum:1,pageSize:1000,paginationMessage:"",id:"Discovery"};
    weeksPassed:any=1;
    loadDiscoveryCommunityReport():void
    {
        this.myData=undefined;
        this.Discoveries=[];
        this.TableGlobal = [];
        this.Table=[];
        setTimeout(()=>{
        if(this.name.indexOf("Monthly")!=-1)
            localStorage.setItem("monthly_dashboard_filter",this.year+"#"+this.month);    
        var curr = new Date(); // get current date
        if(this.lastweek)
        {
            curr.setDate(curr.getDate() - 7);
        }
        var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        
        var last = first + 6; // last day is the first day + 6
        
        this.createdOnFrom = this.commonService.getFormatedDate(new Date(curr.setDate(first)),"yyyy-MM-dd")+" 00:00:00";
        this.createdOnTill = this.commonService.getFormatedDate(new Date(curr.setDate(last)),"yyyy-MM-dd")+" 23:59:59";
        var firstDay = parseInt(this.createdOnFrom.split(" ")[0].split("-")[2]);
        var lastDay = parseInt(this.createdOnTill.split(" ")[0].split("-")[2]);
        if(lastDay<firstDay)
        {
            curr.setDate(last);
            curr.setMonth(curr.getMonth()+1);
            this.createdOnTill = this.commonService.getFormatedDate(new Date(curr),"yyyy-MM-dd")+" 23:59:59";
        }
        
        if(this.name=='Monthly Leadership Board - Weighted(Actual)')
        {
            this.weeksPassed = Math.ceil(new Date().getDate()/7);
            //if(this.month!==(new Date().getMonth()+1))//not current month.
                this.weeksPassed = 5;
            var monthString = (this.month)+"";
            if(monthString.length==1)
                monthString="0"+monthString;
            this.createdOnFrom = this.year+"-"+monthString+"-01 00:00:00";
            monthString = (this.month+1)+"";
            if(monthString.length==1)
                monthString="0"+monthString;
                if(monthString=="13")
                {
                    monthString="01";
                    this.createdOnTill = (this.year+1)+"-"+monthString+"-01 00:00:00";
                }
            else
                this.createdOnTill = this.year+"-"+monthString+"-01 00:00:00";
        }
        
//        createdOnFrom = "2022-02-01 00:00:00";
        let userId = this.commonService.user.id;
        if(this.commonService.rbac["manage-others-reports"] && ! this.showOnlyMyData)
            userId = -1;
        var url = "mainservice/recruitment/shortlisting/weeklyPerformance/"+localStorage.getItem('communityId')+"?createdOnFrom="+this.createdOnFrom+"&createdOnTill="+this.createdOnTill+"&pageNum="+this.DiscoveryPagination.pageNum+"&pageSize="+this.DiscoveryPagination.pageSize+"&weeksPassed="+this.weeksPassed+"&userId="+userId;
        this.commonService.showProcessingIcon();
        this.commonService.get(url).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            if(data["result"]===200)
            {
               this.Discoveries = data["dataArray"];  
               this.DiscoveryPagination.paginationMessage = data["message"] ;
            }
            if(this.Discoveries.length===0 && this.DiscoveryPagination.pageNum>1)
            {
                this.DiscoveryPagination.pageNum=this.DiscoveryPagination.pageNum-1;
            }
            this.fillTable();
        });
        },300);
    }
    TableGlobal:any=[];
    fillTable()
    {
        
        for(var i=0;i<this.Discoveries.length;i++)//count,name,statusId
        {
            var index = this.findUserInTable(this.Discoveries[i].arg2,this.Table);            
            if(index==-1)
            {
                if(!this.Discoveries[i].arg2)
                    continue;
                var obj:any={};
                obj.userId=this.Discoveries[i].arg5;
                obj.name=this.Discoveries[i].arg2;
                obj["status"+this.Discoveries[i].arg3]=this.Discoveries[i].arg1;
                obj.Target = parseInt(this.Discoveries[i].arg4)*this.weeksPassed;
                if(this.Discoveries[i].arg6)
                {
                    //obj.teamTarget = parseInt(this.Discoveries[i].arg6)*this.weeksPassed;
                    obj.teamTarget = parseInt(this.Discoveries[i].arg6);
                    obj.buddies = this.Discoveries[i].arg7;
                }
                if (this.Discoveries[i].arg8)
                {
                    obj.clientReferal = this.Discoveries[i].arg8;
                }
                var totalArray = this.getTotal(obj,true);
                obj.total = totalArray[0];
                //var def1 = (obj.Target - totalArray[0]);
                var def2 = obj.Target-totalArray[0];
                //obj.deficient = def2+"("+def1+")";
                obj.deficient = def2;
                if(obj.deficient<0)
                    obj.deficient=0;
                //console.log("pushing data for "+this.Discoveries[i].arg2);
                this.Table.push(obj);
            }
            else
            {
                this.Table[index].userId=this.Discoveries[i].arg5;
                this.Table[index]["status"+this.Discoveries[i].arg3]=this.Discoveries[i].arg1;
                var totalArray = this.getTotal(this.Table[index],true);
                this.Table[index]["total"] = totalArray[0]+"("+totalArray[1]+")";
                //var def1 = (this.Table[index].Target - totalArray[0]);
                var def2 = this.Table[index].Target-totalArray[0];
                if(def2<0)
                    def2=0;
                this.Table[index]["deficient"] = def2;
                this.Table[index]["deficientPerc"] = Math.ceil((def2/this.Table[index].Target)*100);
                //console.log("updating data for "+this.Discoveries[i].arg2);
            }
        }
        this.TableGlobal = this.Table;
        //console.log("Total rows in table "+this.TableGlobal.length);        
        this.sortTable();
        this.Table=[];
        setTimeout(()=>{this.fillBuddyTeamTotalCount();},2000);
        this.loadTablePage();
        this.hideBlankColumns();
    }
    showStatusColumn=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    hideEmptyColumns=true;
    statusTotal:any={};
    hideBlankColumns():void
    {
        this.statusTotal = {total:0};
        setTimeout(()=>
        {
            if(this.hideEmptyColumns)
            this.showStatusColumn=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
            else
                this.showStatusColumn=[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            for(var i=0;i<this.TableGlobal.length;i++)
            {
                for(var j=0;j<24;j++)
                {
                    if(this.TableGlobal[i]["status"+j])
                    {
                        this.showStatusColumn[j] = true;
                        if (this.statusTotal["status"+j])
                            this.statusTotal["status"+j] = this.statusTotal["status"+j] + parseInt(this.TableGlobal[i]["status"+j].split("(")[1].split(")")[0]);
                        else
                            this.statusTotal["status"+j] = parseInt(this.TableGlobal[i]["status"+j].split("(")[1].split(")")[0]);
                        
                        this.statusTotal["total"] = this.statusTotal["total"] + parseInt(this.TableGlobal[i]["status"+j].split("(")[1].split(")")[0]);
                    }
                }
                if(this.statusTotal.clientReferral)
                    this.statusTotal.clientReferral = this.statusTotal.clientReferral + parseInt(this.TableGlobal[i].clientReferal)/10;
                else
                    this.statusTotal.clientReferral = parseInt(this.TableGlobal[i].clientReferal)/10;
                if(this.statusTotal.clientReferral)
                {
                    this.statusTotal["total"] = this.statusTotal["total"] + parseInt(this.TableGlobal[i].clientReferal)/10;
                    
                }
            }  
        },500);
        
    }
    printnow(name:any,string:any):void
    {
        if(name=="Noor Dhawan")
            console.log(string);
    }
    myData:any;
    fillBuddyTeamTotalCount():void
    {
        var weightedTotal:any = 0;
        var total:any = 0;
        for(var i:any=0;i<this.TableGlobal.length;i++)
        {
            weightedTotal = 0;
            total = 0;
            if(this.TableGlobal[i].teamTarget)
            {
                //this.printnow(this.TableGlobal[i].name,"My buds are "+this.TableGlobal[i].buddies);
                var buds = this.TableGlobal[i].buddies.replace("[","").replace("]","").split(",");
                this.TableGlobal[i].buddyNames="";
                for(var j:any=0;j<buds.length;j++)
                {
                    //this.printnow(this.TableGlobal[i].name,"checking on buddy "+buds[j]);
                    var index:any = this.findUserInTable(parseInt(buds[j].trim()),this.TableGlobal);
                    if(index!=-1)
                    {
                        var totalString = this.TableGlobal[index].total;
                        //this.printnow(this.TableGlobal[i].name,"totalString IS "+totalString+ " for buddy "+this.TableGlobal[index].name);
                        this.TableGlobal[i].buddyNames = this.TableGlobal[i].buddyNames+this.TableGlobal[index].name+",";
                        if(totalString)
                        {                            
                            var temp:any = (totalString+"").replace(")","").split("(");
                            weightedTotal = weightedTotal+parseInt(temp[0]);
                            total = total+parseInt(temp[1]);
                        }
                    }
//                    else
                        //this.printnow(this.TableGlobal[i].name,"Didnt get buddy with id "+parseInt(buds[j]));
                }
                if(this.TableGlobal[i].buddyNames.length>1)
                    this.TableGlobal[i].buddyNames=this.TableGlobal[i].buddyNames.toString().substring(0,this.TableGlobal[i].buddyNames.length-1);
            }
            let temp1 = this.getTotal(this.TableGlobal[i],true);
            //this.printnow(this.TableGlobal[i].name,"My weighted total "+temp1[0]);
            //this.printnow(this.TableGlobal[i].name,"Buddies weighted total "+weightedTotal);
            this.TableGlobal[i].buddyTeamTotal=(temp1[0]+weightedTotal)+"("+(temp1[1]+total)+")";
            //var def2 = this.TableGlobal[i].teamTarget+this.TableGlobal[i].Target-weightedTotal-temp1[0];
            var def2 = this.TableGlobal[i].teamTarget-weightedTotal-temp1[0];
            if(def2<0)
                def2=0;
            this.TableGlobal[i]["deficientTeam"] = def2;
            //this.TableGlobal[i]["deficientPercTeam"] = Math.ceil((def2/(this.TableGlobal[i].teamTarget+this.TableGlobal[i].Target))*100);
            this.TableGlobal[i]["deficientPercTeam"] = Math.ceil((def2/(this.TableGlobal[i].teamTarget))*100);
//            console.log(this.TableGlobal[i].buddyTeamTotal+" for "+this.TableGlobal[i].name);
        }
    }
    summaryTotalArray:any = [0,0];
    sortTable():void
    {
        this.summaryTotalArray = [0,0];
        for(var i:any=0;i<this.TableGlobal.length;i++)
        {
            for(var j:any=0;j<this.TableGlobal.length;j++)
            {
                var totalArray1 = this.getTotal(this.TableGlobal[j],true);
                var totalArray2 = this.getTotal(this.TableGlobal[i],true);
                if(totalArray1[1]<totalArray2[1])
                    this.swap(i,j);
            } 
        }
//        for(var i:any=0;i<this.TableGlobal.length;i++)
//        {
//            for(var j:any=0;j<this.TableGlobal.length;j++)
//            {
//                var totalArray1 = this.getTotal(this.TableGlobal[j],true);
//                var totalArray2 = this.getTotal(this.TableGlobal[i],true);
//                var test1 = this.TableGlobal[i].teamTarget ? true: false;
//                var test2 = this.TableGlobal[j].teamTarget ? true: false;
//                if(test1 && !test2)
//                    this.swap(i,j);
//            } 
//        }
        for(var i:any=0;i<this.Table.length;i++)
        {
            var temp = this.getTotal(this.Table[i],true);
            this.summaryTotalArray[0] = this.summaryTotalArray[0] + temp[0];
            this.summaryTotalArray[1] = this.summaryTotalArray[1] + temp[1];
            if (this.showOnlyMyData)
            {
                if(this.Table[i].name==this.commonService.user.name)
                {
                    this.myData = this.Table[i];
                }
            }
        }
    }
    showOnlyMyData=true;
    swap(i:any,j:any):void
    {
        var temp:any = this.TableGlobal[i];
        this.TableGlobal[i]=this.TableGlobal[j];
        this.TableGlobal[j]=temp;
    }
  loadTablePage()
    {
        var maxPages:any = this.TableGlobal.length/this.DiscoveryPagination.pageSize;
        if(this.TableGlobal.length%this.DiscoveryPagination.pageSize !==0)
            maxPages = maxPages+1;
        this.DiscoveryPagination.paginationMessage = "Showing results Page "+this.DiscoveryPagination.pageNum+" of "+maxPages;
        this.Table = this.TableGlobal.slice((this.DiscoveryPagination.pageNum-1)*this.DiscoveryPagination.pageSize,this.DiscoveryPagination.pageNum*this.DiscoveryPagination.pageSize);
    }
    findUserInTable(userName:any,Table:any)
    {
        for(var i:any=0;i<Table.length;i++)
        {
            if(Table[i].name==userName || Table[i].userId==userName)
                return i;
        }
        return -1;
    }
    reqHandle:any;
    exportReport():void
    {
//        createdOnFrom = "2022-02-01 00:00:00";
        var url = "mainservice/recruitment/shortlisting/weeklyPerformance/export/excel/"+localStorage.getItem('communityId')+"?createdOnFrom="+this.createdOnFrom+"&createdOnTill="+this.createdOnTill+"&pageNum="+this.DiscoveryPagination.pageNum+"&pageSize="+this.DiscoveryPagination.pageSize+"&weeksPassed="+this.weeksPassed;
        
        if(this.reqHandle)
        {
            this.reqHandle.unsubscribe();
        }
        this.commonService.showProcessingIcon();
        this.reqHandle = this.commonService.getBlob(url).subscribe(
            (response: any) =>{
                this.commonService.hideProcessingIcon();
                let dataType = response.type;
                let binaryData = [];
                binaryData.push(response);
                let downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
                var filename = this.name+"-"+this.createdOnFrom.split(" ")[0]+".xlsx";
                downloadLink.setAttribute('download', filename);
                document.body.appendChild(downloadLink);
                downloadLink.click();
            }
        )
    }
    getCountAndWeightedCount(countString:any)
    {
        if(!countString)
            return [0,0];
        var temp = countString.split("(");
        temp[1] = temp[1].replace(")","");
        return temp;
    }
    getTotal(d:any,aboveStatus5:any)
    {
        var total:any = 0;
        var weightedTotal:any = 0;
        if(!aboveStatus5)
        {
            if(d.status1)
            {
                var countArray:any = this.getCountAndWeightedCount(d.status1);
                total = total+parseInt(countArray[0]);
                weightedTotal = weightedTotal+parseInt(countArray[1]);
            }
            if(d.status2)
            {
                var countArray:any = this.getCountAndWeightedCount(d.status2);
                total = total+parseInt(countArray[0]);
                weightedTotal = weightedTotal+parseInt(countArray[1]);
            }
            if(d.status3)
            {
                var countArray:any = this.getCountAndWeightedCount(d.status4);
                total = total+parseInt(d.status3);
                weightedTotal = weightedTotal+parseInt(countArray[1]);
            }
            if(d.status4)
             {
                var countArray:any = this.getCountAndWeightedCount(d.status4);
                total = total+parseInt(countArray[0]);
                weightedTotal = weightedTotal+parseInt(countArray[1]);
            }
        }
        
        if(d.status5)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status5);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status6)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status6);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status7)
         {
            var countArray:any = this.getCountAndWeightedCount(d.status7);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status8)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status8);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status9)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status9);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
//        if(d.status9)
//            total = total+parseInt(d.status9);
        if(d.status10)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status10);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status11)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status11);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status12)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status12);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status13)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status13);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status14)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status14);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status15)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status15);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        /*if(d.status16)//nurture
        {
            var countArray = this.getCountAndWeightedCount(d.status16);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }*/
        if(d.status17)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status17);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status18)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status18);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status19)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status19);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status20)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status20);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        /*if(d.status21)//validated is before s2c
        {
            var countArray:any = this.getCountAndWeightedCount(d.status21);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }*/
        if(d.status22)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status22);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status23)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status23);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        }
        if(d.status24)
        {
            var countArray:any = this.getCountAndWeightedCount(d.status24);
            total = total+parseInt(countArray[0]);
            weightedTotal = weightedTotal+parseInt(countArray[1]);
        } 
        total = total+parseInt(d.clientReferal);
        weightedTotal = weightedTotal+parseInt(d.clientReferal)/10; 
        var res:any=[];
        res.push(total); 
        res.push(weightedTotal);
        return res;
        //return total+"("+weightedTotal+")";    
    }
    next(obj:any):void
    {
        if(obj.paginationMessage.length>0)
        {
            var temp = obj.paginationMessage.split(" of ");
            if(parseInt(temp[1])<=obj.pageNum)
                 return;
        }
         obj.pageNum = obj.pageNum+1; 
         if (obj.id==="Discovery")
            this.loadTablePage();
    }
    previous(obj:any):void
    {
       if(obj.pageNum==1)
        return;
       obj.pageNum = obj.pageNum-1; 
        this.loadTablePage();
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
    setDiscFilter(userId:any,statusId:any):void
    {
        //this.requirementId+"::"+localDiscoverers+"::"+this.searchText+"::"+localStatus+"::"+localClients+"::"+localRoles+"::"+this.top50+
        // "::"+this.minCtc+"::"+this.maxCtc+"::"+this.minExp+"::"+this.maxExp+"::"+localClientAnchors
        var filter:any = "-1::"+userId+"::::"+statusId+"::-1::-1::false::0::500::0::50::-1";
        localStorage.setItem("discFilter",filter);
        this.router.navigate(["recr/discoveries"],{queryParams:{startDate: this.createdOnFrom,endDate:this.createdOnTill}});
    }
    showReferedClients(userId:any):void
    {
      var url ='mainservice/framework2/forward?api=recruitmentservice/discovery/clientReferalsWith1stMandate?userId='+userId+',monthLike='+this.createdOnFrom;

      this.commonService.get(url).subscribe((data: any) => {
          if(data.message && data.message.length>0)
              this.commonService.showInfoMessage("Info","Clients are "+data.message);
      })
    }

    showFullScreen():void
    {
        var tableEle:any=null;
        if(!this.myData)
            tableEle = document.getElementById("bigTable");
        else
            tableEle = document.getElementById("smallTable");
        var ele:any=null;
        ele = document.getElementById("fullbody");
        ele.innerHTML = tableEle.innerHTML;
        this.fullscreen.show();
    }
}
