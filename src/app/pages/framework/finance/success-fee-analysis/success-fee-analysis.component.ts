import {Component,ViewChild} from '@angular/core';
import {PieworksCommonService} from '../../../../common/pieworkscommon.service';

@Component({
  selector: 'app-success-fee-analysis',
  templateUrl: './success-fee-analysis.component.html',
  styleUrls: ['./success-fee-analysis.component.scss']
})
export class SuccessFeeAnalysisComponent {
    @ViewChild("pie") piechart:any;
constructor(public commonService: PieworksCommonService) {
        this.loadReport();
        this.years.push(new Date().getFullYear());
        this.years.push(new Date().getFullYear()-1);
        this.years.push(new Date().getFullYear()-2);
        this.years.push(new Date().getFullYear()-3);
        this.years.push(new Date().getFullYear()-4);
    }
    simplePieChart: any = {
      series: [0, 0],
      chart: {
        height: 300,
        type: "pie",
      },
      labels: ["Core Team", "Non Core Team"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      //colors: colors
    };
    data: any = [];message = "";startDate:any="";endDate:any="";
    months = [
    {name:'Jan',startDate:'01-01',endDate:'01-31'},
    {name:'Feb',startDate:'02-01',endDate:'02-28'},
    {name:'Mar',startDate:'03-01',endDate:'03-31'},
    {name:'Apr',startDate:'04-01',endDate:'04-30'},
    {name:'May',startDate:'05-01',endDate:'05-31'},
    {name:'Jun',startDate:'06-01',endDate:'06-30'},
    {name:'Jul',startDate:'07-01',endDate:'07-31'},
    {name:'Aug',startDate:'08-01',endDate:'08-31'},
    {name:'Sep',startDate:'09-01',endDate:'09-30'},
    {name:'Oct',startDate:'10-01',endDate:'10-31'},
    {name:'Nov',startDate:'11-01',endDate:'11-30'},
    {name:'Dec',startDate:'12-01',endDate:'12-31'},
    {name:'Jan-Mar',startDate:'01-01',endDate:'03-31'},
    {name:'Apr-Jun',startDate:'04-01',endDate:'06-30'},
    {name:'Jul-Sep',startDate:'07-01',endDate:'09-30'},
    {name:'Oct-Dec',startDate:'10-01',endDate:'12-31'}
    ];
    years:any=[];selectedMonth:any;selectedYear:any;considerOnlyYear:any=false;
    loadReport(): void {
        if(this.considerOnlyYear)
        {
            this.selectedMonth = undefined;
        } 
        if ((!this.considerOnlyYear && !this.selectedMonth) || !this.selectedYear)
        {
            return;
        }
        
        this.message = "Loading data ....";
        if(this.considerOnlyYear)
        {
            this.selectedMonth = undefined;
            this.startDate = this.selectedYear+"-01-01 00:00:00"
            this.endDate = this.selectedYear+"-12-31 00:00:00"
        }
        else
        {
            this.startDate = this.selectedYear+"-"+this.selectedMonth.startDate+" 00:00:00";//"2023-10-01 00:00:00";
            this.endDate = this.selectedYear+"-"+this.selectedMonth.endDate+" 00:00:00";//"2023-11-01 00:00:00";
        }
        this.data = [];
        var url = "mainservice/recruitment3/successFeeAnalysis?startDate="+this.startDate+"&endDate="+this.endDate+"&communityId=" + localStorage.getItem("communityId");
        this.commonService.get(url).subscribe((data: any) => {
            this.commonService.hideProcessingIcon();
            if (data['result'] === 200) {
                this.commonService.hideProcessingIcon();
                this.data = data["dataObject"];
                this.message= data["message"];
                this.simplePieChart.series=[parseInt(this.data[0]), parseInt(this.data[1])]; 
            }
        });
    }
    series:any=[];
}
