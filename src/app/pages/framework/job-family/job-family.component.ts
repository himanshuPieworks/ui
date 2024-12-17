import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-job-family',
  templateUrl: './job-family.component.html',
  styleUrls: ['./job-family.component.scss'],
})
export class JobFamilyComponent implements OnInit {
  constructor(private route: ActivatedRoute,public commonService: PieworksCommonService) {}
  selectedQuarter = 1;
  selectedYear = new Date().getFullYear();
  quarterArray = [
    { id: 1, name: 'Q1' },
    { id: 2, name: 'Q2' },
    { id: 3, name: 'Q3' },
    { id: 4, name: 'Q4' },
  ];

  
  yearArray = [this.selectedYear];
  userId: any;
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.yearArray.push(this.selectedYear - 1);
    this.yearArray.push(this.selectedYear - 2);
    this.yearArray.push(this.selectedYear - 3);
    var quarter = Math.ceil((new Date().getMonth() + 1) / 3);
    var year = new Date().getFullYear();
    quarter = quarter - 1;
    if (quarter < 0) {
      year = year - 1;
      quarter = 4;
    }
    this.selectedQuarter = quarter;

    this.loadJobFamily();
    this.loadMyMembership();
  }
 
  // @Input() member:any;
  member: any = {};
  newContractAvailable = false;
  autoAcceptanceDate: any;
  isOwnAccount = false;
  loadMyMembership(): void {
    this.commonService
      .get(
        'mainservice/framework/members/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=0,1,2,3,4,5,6,7,8,9,10&acceptanceByAceMakerValues=0,1,2,3,4,5,6,7,8,9,10&userId=' +
          this.commonService.user.id +
          '&roleInCommunity=0,1'
      )
      .subscribe((data: any) => {
        var temp = data['dataArray'];
        
        this.member = temp[0];
        if (this.member.contractAcceptance === 'accepted') {
          this.newContractAvailable = true;
        }
        if (this.commonService.user.id == this.member.user.id) {
          this.isOwnAccount = true;
        }
        this.selectedJobFamilies  = "";
        var temp: any = [];
        if(this.member.jobFamilies)
            temp = this.member.jobFamilies.split(",");
        
        for(var i=0;i<this.jobFamilies.length;i++)//marking already selected jobFamilies from DB
        {
            console.log(this.jobFamilies[i]+" jobFamilies repo");
            for(var j=0;j<temp.length;j++)
            {
                console.log(temp[j]);
                if (this.jobFamilies[i].name == temp[j])
                {
                    this.jobFamilies[i].selected=true;
                    this.updateSelectedClubs(this.jobFamilies[i],false);
                    break;
                }
            }
        }
      });
  }


  // member: any = {};
  selectedJobFamilyArray:any=[];
  selectedJobFamily:any;
  editJobFamily:boolean =false;
  saveMember():void
  {
    this.member.jobFamilies  = this.selectedJobFamilies;
    this.commonService
      .post('mainservice/framework/communitymember', this.member)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
          this.selectedJobFamilyArray = [];
          this.loadMyMembership();
        if (data['result'] == 200) {
          this.commonService.showSuccessMessage(
            'Info',
            'Updated jobFamilies.'
          );
            this.editJobFamily = false;
        }
      });
  }

  questions: any;
  jobFamilies:any;
  requirement: any = {};


  loadJobFamily():void
  {
    var parentId = 0;
    var url =
        'mainservice/recruitment2/open/loadJobFamily?parentId=' + parentId;
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
          this.jobFamilies = data['dataArray'];
      })

  }




  selectedJobFamilies:any="";
 

  updateSelectedClubs(club:any,fromUi:boolean):void
  {
      setTimeout(()=>{
          this.selectedJobFamilyArray = [];
          
          if(club.selected)
          {
            if (!this.selectedJobFamilies || this.selectedJobFamilies.length==0)
              this.selectedJobFamilies = club.name;
            else
                  this.selectedJobFamilies = this.selectedJobFamilies+","+club.name;
            if(this.selectedJobFamilies)
                this.selectedJobFamilyArray = this.selectedJobFamilies.split(",");
          }
          else
          {
              if(this.selectedJobFamilies)
                this.selectedJobFamilyArray = this.selectedJobFamilies.split(",");
              for(var i=0;i<this.selectedJobFamilyArray.length;i++)
              {
                  if(this.selectedJobFamilyArray[i]==club.name)
                  {
                      this.selectedJobFamilyArray.splice(i,1);
                      break;
                  }
              }
              this.selectedJobFamilies="";
              for(var i=0;i<this.selectedJobFamilyArray.length;i++)
              {
                  if(this.selectedJobFamilies.length==0)
                  {
                      this.selectedJobFamilies = this.selectedJobFamilyArray[i];
                  }
                  else
                  {
                      this.selectedJobFamilies = this.selectedJobFamilies+","+this.selectedJobFamilyArray[i];
                  }
              }
          }
          console.log(this.selectedJobFamilyArray.length+" is the length "+this.selectedJobFamilies);
          if(this.selectedJobFamilyArray.length==3 && fromUi)
          {
              this.commonService.showInfoMessage("Info","You have reached maximum allowed jobFamilies ! ");
          }
      },200);
  }
}
