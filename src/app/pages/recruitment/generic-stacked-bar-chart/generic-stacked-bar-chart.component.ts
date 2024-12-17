import { Component } from '@angular/core';

@Component({
  selector: 'app-generic-stacked-bar-chart',
  templateUrl: './generic-stacked-bar-chart.component.html',
  styleUrls: ['./generic-stacked-bar-chart.component.scss'],
})
export class GenericStackedBarChartComponent {
  colors: any[] = [
    '#93fad0',
    '#8bf7cb',
    '#83f7c8',
    '#7cfcc8',
    '#72f7c1',
    '#69f5bc',
    '#62f5b9',
    '#5afab9',
    '#52f7b4',
    '#4bfab3',
    '#2af5a4',
    '#27e699',
    '#24d68f',
    '#21bf80',
    '#1eb076',
    '#1da16c',
    '#199161',
    '#168055',
    '#14704b',
    '#126b47',
  ];

  ngOnInit(): void {
    this._stackedBarChart([
      '#93fad0',
      '#8bf7cb',
      '#83f7c8',
      '#7cfcc8',
      '#72f7c1',
      '#69f5bc',
      '#62f5b9',
      '#5afab9',
      '#52f7b4',
      '#4bfab3',
      '#2af5a4',
      '#27e699',
      '#24d68f',
      '#21bf80',
      '#1eb076',
      '#1da16c',
      '#199161',
      '#168055',
      '#14704b',
      '#126b47',
    ]);
  }
  render(bargraphLabels: any, bargraphData: any): void {
    this.stackedBarChart.series = bargraphData;
    //this.stackedBarChart.series = this.stackedBarChart.series.reverse();
    console.log(
      'This is the length of series = ' + this.stackedBarChart.series.length
    );
    this.stackedBarChart.xaxis = { categories: bargraphLabels };
    // this.stackedBarChart.colors = this.colors.slice(
    //   0,
    //   this.stackedBarChart.series.length
    // );
    // console.log(
    //   'This is the length of colors = ' + this.stackedBarChart.colors.length
    // );
    this.stackedBarChart.parentObj = this.parentObj;
    this.stackedBarChart.chart.height =
      bargraphData[0]?.data.length * 30 < 200
        ? 400
        : bargraphData[0]?.data.length * 30;
    window.scrollTo(0, 500);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
  }
  stackedBarChart: any;
  parentObj: any;
  private _stackedBarChart(colors: any) {
    this.stackedBarChart = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
      },

      events: {
        click: (event: any, chartContext: any, config: any) => {
          var index: number = config.dataPointIndex;
          this.parentObj.clickedOnBar(index, this.parentObj);
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      title: {
        text: ' ', //heading for the graph
        style: {
          fontWeight: 600,
        },
      },
      xaxis: {
        categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
        labels: {
          formatter: function (val: any) {
            return val;
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
    };
  }
}
