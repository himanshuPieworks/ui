import { Component, Input } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-candidate-dipstick-report',
  templateUrl: './candidate-dipstick-report.component.html',
  styleUrls: ['./candidate-dipstick-report.component.scss'],
})
export class CandidateDipstickReportComponent {
  @Input() parentObj: any;

  endDate: any;
  startDate: any;
  constructor(public commonService: PieworksCommonService) {
    this.endDate = this.commonService
        .getFormatedDate(new Date(), this.commonService.mysqlFormat)
        .split(' ')[0];
    // this.endDate = this.parentObj.endDate;
    this.startDate = this.commonService
      .getFormatedDate(
        this.commonService.getDateXDaysAgo(
          new Date().getDate() - 1,
          new Date()
        ),
        this.commonService.mysqlFormat
      )
      .split(' ')[0];

    this.getCandidateData();
  }

  paginationMessage = '';
  pageNum = 1;
  pageSize = 1;
  totalPages = 0;
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
    this.getCandidateData();
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
    this.getCandidateData();
  }
  first(): void {
    this.pageNum = 1;
    this.getCandidateData();
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
    this.getCandidateData();
  }

  myData: any = [];
  clientId: any = -1;
  talentName: any = '';

  getCandidateData() {
    var url =
      'mainservice/dipstick/getSticksReport?pageNum=' +
      this.pageNum +
      '&pageSize=' +
      this.pageSize +
      '&startDate=' +
      this.startDate +
      '&endDate=' +
      this.endDate +
      '&clientId=' +
      this.clientId +
      '&talentName=' +
      this.talentName;

    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.myData = data['dataArray'];
        this.totalPages = data['dataObject'];
        this.paginationMessage = data['message'];
        // setTimeout(() => {
        //   this.loadCandidate(this.myData[0].discoveryId);
        // }, 300);
      }
    });
  }

  getStyle(weightage: number) {
    let leftPercentage: string;

    switch (weightage) {
      case 1:
        leftPercentage = '25%';
        break;
      case 2:
        leftPercentage = '50%';
        break;
      case 3:
        leftPercentage = '75%';
        break;
      // 97% == 100% because of css
      case 4:
        leftPercentage = '97%';
        break;
      default:
        leftPercentage = '0%';
        break;
    }

    return {
      left: leftPercentage,
    };
  }

  remarks: any;
  public downloadPDF(): void {
    const element = document.getElementById('content-to-convert');

    if (element) {
      html2canvas(element).then((canvas) => {
        const imgWidth = 210; // A4 size width in mm
        const pageHeight = 295; // A4 size height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // If the content is taller than the page height, we need to scale it down
        const heightLeft = imgHeight > pageHeight ? imgHeight - pageHeight : 0;

        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          0,
          imgWidth,
          imgHeight
        );

        // If content overflows the page, we scale it to fit on one page
        if (heightLeft > 0) {
          const scaleFactor = pageHeight / imgHeight;
          const scaledWidth = imgWidth * scaleFactor;
          const scaledHeight = imgHeight * scaleFactor;
          pdf.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            0,
            0,
            scaledWidth,
            scaledHeight
          );
        } else {
          pdf.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            0,
            0,
            imgWidth,
            imgHeight
          );
        }

        pdf.save('download.pdf');
      });
    }
  }

  // Average of individual section
  calculateIndividualAverage(Q1: number, Q2: number, Q3: number): number {
    const average = (Q1 + Q2 + Q3) / 3;
    return Math.round(average);
  }

  // calculate Individual overall average
  calculateWeightedIndividualOverallAverage(
    weight1: number,
    multiplier1: number,
    weight2: number,
    multiplier2: number,
    weight3: number,
    multiplier3: number
  ): number {
    const value1 = (weight1 * multiplier1) / 100;
    const value2 = (weight2 * multiplier2) / 100;
    const value3 = (weight3 * multiplier3) / 100;

    const sum = value1 + value2 + value3;
    const average = sum / 3;
    const result = average * 100;

    return Math.round(result);
  }
}
