import { Component } from '@angular/core';


@Component({
  selector: 'app-generic-compare-line-chart',
  templateUrl: './generic-compare-line-chart.component.html',
  styleUrls: ['./generic-compare-line-chart.component.scss']
})
export class GenericCompareLineChartComponent {
  lineWithDataLabelsChart: any;
  parentObj:any;
  globalColors:any=[];
    ngOnInit():void
    {
        this.globalColors = this.generateRandomColors(20,true);
        this._lineWithDataLabelsChart(JSON.stringify(this.globalColors));
    }
//  let lineColors:any=["#FF4560",""];
  getRandomColor(): string {
    const letters:any = '0123456789ABCDEF';
    var color:any = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
alternateLineStyle=true;
generateRandomColors(num: number = 10,sameColorTwice:boolean): string[] {
    this.alternateLineStyle = sameColorTwice;
    const colors: string[] = [];
    for (let i = 0; i < num; i++) {
        var temp = this.getRandomColor();
        colors.push(temp);
        if(sameColorTwice)
            colors.push(temp);
    }
    return colors;
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
        height: 480,
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
        text: 'Northstar Comparison graph',
        align: 'left',
        style: {
          fontWeight: 500,
        },
      },
      stroke: {
        width: 3,
        curve: "straight",
        dashArray: this.alternateLineStyle?[8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8,0, 8]:[] //to be filled dynamicaly
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
        position: 'bottom',
        horizontalAlign: 'right',
        floating: false,
//        offsetY: -25,
//        offsetX: -5
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