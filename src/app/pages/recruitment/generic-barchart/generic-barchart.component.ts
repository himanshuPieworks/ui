import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import * as ApexCharts from 'apexcharts';
@Component({
  selector: 'app-generic-barchart',
  templateUrl: './generic-barchart.component.html',
  styleUrls: ['./generic-barchart.component.scss'],
})
export class GenericBarchartComponent implements OnInit {
  @Input('labels') labels: any;
  @Input('data') data: any;
  @ViewChild('barChart') barChart: any;
  constructor() {}

  ngOnInit(): void {}
  render(bargraphLabels: any, bargraphData: any, positions: any): void {
    this.basicBarChart.series = [{ name: '', data: bargraphData }];
    this.basicBarChart.xaxis = { categories: bargraphLabels };
    this.basicBarChart.parentObj = this.parentObj;
    this.basicBarChart.chart.height =
      bargraphData.length * 20 < 200 ? 200 : bargraphData.length * 20;
    this.positions = positions;
    window.scrollTo(0, 500);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
  }
  positions: any = [];

  // events
  public chartClicked(e: any, chartContext: any, config: any): void {
    //console.log(e.active[0].index);
    this.parentObj.clickedOnBar(e, this.parentObj);
  }

  parentObj: any;

  basicBarChart: any = {
    series: [
      {
        data: [380],
      },
    ],
    chart: {
      height: 650,
      type: 'bar',
      toolbar: {
        show: true,
      },
      events: {
        click: (event: any, chartContext: any, config: any) => {
          var index: number = config.dataPointIndex;
          this.parentObj.clickedOnBar(index, this.parentObj);
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        border: 0,
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff'],
      },
      formatter: (val: any, opt: any) => {
        //return opt.w.globals.labels[opt.dataPointIndex] + ":  " + this.positions[opt.dataPointIndex];
        if (
          !this.positions ||
          !this.positions[opt.dataPointIndex] ||
          this.positions[opt.dataPointIndex] == '1'
        )
          return '';
        return ' Positions :  ' + this.positions[opt.dataPointIndex];
      },
      offsetX: 0,
      dropShadow: {
        enabled: false,
      },
    },
    //      colors: colors,
    grid: {
      show: false,
    },
     tooltip: {
        custom: ( series:any, seriesIndex:any, dataPointIndex:any, w:any )=>{
            console.log(this.parentObj.infoArray.length+" is the length of infoArray");
          return '<div class="custom-tooltip">' +
                   '<span class="m-1">' +this.parentObj.infoArray[series.dataPointIndex].split("1 talents are").join("1 talent is") + '</span>' +
                 '</div>';
        }
      }

    //      xaxis: {
    //        categories: [
    //          "South Korea",
    //          "South Korea",
    //        ],
    //      },
  };
}
