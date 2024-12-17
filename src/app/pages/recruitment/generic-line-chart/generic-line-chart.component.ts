import { Component } from '@angular/core';

@Component({
  selector: 'app-generic-line-chart',
  templateUrl: './generic-line-chart.component.html',
  styleUrls: ['./generic-line-chart.component.scss']
})
export class GenericLineChartComponent {
    
  lineWithDataLabelsChart: any;
  parentObj:any;
    ngOnInit():void
    {
    this._lineWithDataLabelsChart('["--tb-primary", "--tb-success" ,"--tb-info", "--tb-warning"]');
  }
   
  // Chart Colors Set
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  private generateDayWiseTimeSeries(baseval: number, count: number, yrange: { max: number; min: number; }): any[] {
    let i = 0;
    let series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  private generateDayWiseTimeSeriesline(baseval: any, count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }


  /**
 * Line with Data Labels
 */
  private _lineWithDataLabelsChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.lineWithDataLabelsChart = {
      chart: {
        height: 380,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      colors: colors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [3, 3],
        curve: 'straight'
      },
      series: [
//          {
//        name: "",
//        data: [26, 24, 32, 70, 33, 31, 90]
//      },
//      {
//        name: "Low - 2018",
//        data: [14, 11, 16, 12, 17, 13, 11]
//      }
      ],
      title: {
        text: 'Comparison graph',
        align: 'left',
        style: {
          fontWeight: 500,
        },
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'],
          opacity: 0.2
        },
        borderColor: '#f1f1f1'
      },
      markers: {
        size: 6
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        title: {
          text: 'Month'
        }
      },
      axisBorder: {
        show: true,
      },
      yaxis: {
        title: {
          text: 'Count'
        },
        axisBorder: {
          show: true,
        },
//        min: 5,
//        max: 40
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };

    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._lineWithDataLabelsChart('["--tb-primary", "--tb-success"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }
  positions: any = [];
    render(bargraphLabels: any, lineGraphSeries: any, positions: any): void {
        console.log(bargraphLabels);
    this.lineWithDataLabelsChart.series = lineGraphSeries;//[{ name: '', data: [1,2,4] }];
    this.lineWithDataLabelsChart.xaxis = { categories: bargraphLabels,title: {text: 'Month'} };
    this.lineWithDataLabelsChart.parentObj = this.parentObj;
//    this.lineWithDataLabelsChart.chart.height =
//      bargraphData.length * 20 < 200 ? 200 : bargraphData.length * 20;
    this.positions = positions;
  }
 
}
