import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-recr-health-bar',
  templateUrl: './recr-health-bar.component.html',
  styleUrls: ['./recr-health-bar.component.scss']
})
export class RecrHealthBarComponent implements OnInit {

  constructor(public commonService: PieworksCommonService,public router: Router) {};
      // @ViewChild(BaseChartDirective) chart: Chart;
  //   doughnutChartType: ChartType = 'doughnut';
  //   @Input("communities") communities:any;
  //   doughnutChartLabels: any[] = ['CV uploads in current month', 'CVs selected in current month', 'No of joinees', "Deficient"];
  
  //   doughnutChartData:ChartDataset[] =
  //   [ 
  //     {
  //         label: 'CV uploads',//orange
  //         data: [0,0,0,0],//[60,0,0,5],
  //         borderRadius: 30,
  //     }, 
  //     {
  //         label: 'CVs selected',//blue
  //         data: [0,0,0,0],//[0,30,0,30 ],
  //         borderRadius: 30,
  //     } ,
  //     {
  //         label: 'No of Joinees',//pink
  //         data: [0,0,0,0],//[0,0,50,10 ],
  //         borderRadius: 30,
  //     }   
  //   ];
  
  //   doughnutChartOption: ChartOptions<'doughnut'> = {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     cutout: "30%",
  //     plugins :   { 
  //                     legend: 
  //                         {
  //                             display: false
  //                         },
  //                         title: 
  //                         {
  //                             text: 'Health Ring',
  //                             display: true,
  //                             font: {weight: 'bold',size: 20}
  //                         },
  //                         tooltip:
  //                         {
  //                             callbacks: 
  //                             {
  //                                 label: (context:any)=> {
  //                                     let label = context.label || '';
  //                                     if(label=="Deficient")
  //                                     {
  //                                         console.log(context.datasetIndex);
  //                                         switch(context.datasetIndex)
  //                                         {
  //                                             case 0:
  //                                                 label="Deficient on CV uploads for current month";
  //                                                 break;
  //                                             case 1:
  //                                                 label="Deficient on CVs selected for current month";
  //                                                 break;
  //                                             case 2:
  //                                                 label="Deficient on number of joinees since "+this.startingWindow+" to "+this.endingWindow;
  //                                                 break;
  //                                         }
  //                                     }
  //                                     return label+" : "+context.formattedValue;
  //                                 }
  //                             }
  //                         }
  //                 }
  // }   
  
    ngOnInit() {
      // this.doughnutChartData.forEach(ds => {
        
      //   if(ds.label=="CV uploads")//outer index=0
      //   {
      //     //ds.backgroundColor =      ['#FF0000', 'lightgrey', 'orange', "#360f0f", "yellow", "blue", "grey"];
      //     ds.backgroundColor =      ['#f696c2', '', '', "#f2e7e7", "yellow", "blue", "grey"];
      //     ds.hoverBackgroundColor = ["#9f466e", "", "", "#cec1c1","lightgrey", "grey", "lightgrey"];
      //   }
      //   else if(ds.label=='CVs selected')//middle  index=1
      //   {
      //     //ds.backgroundColor =      ['red', '#508fc8', 'green', "#050c13", "yellow", "blue", "grey"];
      //     ds.backgroundColor =      ['', '#508fc8', '', "#f2e7e7", "yellow", "blue", "grey"];
      //     ds.hoverBackgroundColor = ["", "blue", "", "#cec1c1","lightgrey", "grey", "lightgrey"];
      //   }
      //   else if(ds.label=='No of Joinees')//innder  index=2
      //   {
      //     //ds.backgroundColor =      ['#3bc49b', 'grey', '#3bc49b', "#061511", "yellow", "blue", "grey"];
      //     ds.backgroundColor =      ['', '', '#3bc49b', "#f2e7e7", "yellow", "blue", "grey"];
      //     ds.hoverBackgroundColor = ["", "", "#11470f", "#cec1c1","lightgrey", "grey", "lightgrey"];
      //   }
      // });
      // setTimeout(()=>{this.loadHealthBarData();},1000);
      
    }
  //   startingWindow:any;endingWindow:any;
  //     loadHealthBarData():void
  //     {
  //         var communityId=this.communities[0].id.communityId;
  //         var userIds = localStorage.getItem("userId");
  //         this.commonService.get("mainservice/recruitment2/recrHealthBoard?communityId="+communityId+"&userId="+userIds).subscribe((data:any) => 
  //         {
  //             this.doughnutChartData[0].data[0] = data["dataObject"].arg1;
  //             this.doughnutChartData[0].data[3] = data["dataObject"].arg2;
              
  //             this.doughnutChartData[1].data[1] = data["dataObject"].arg3;
  //             this.doughnutChartData[1].data[3] = data["dataObject"].arg4;
              
  //             this.doughnutChartData[2].data[2] = data["dataObject"].arg5;
  //             this.doughnutChartData[2].data[3] = data["dataObject"].arg6;
              
  //             this.doughnutChartLabels[2] = "No of joinees from "+data["dataObject"].arg7+" to "+data["dataObject"].arg8;
              
  //             this.chart.update();
  //             this.startingWindow = data["dataObject"].arg7;
  //             this.endingWindow = data["dataObject"].arg8;
              
  //         });
  //     }
  
  }
  