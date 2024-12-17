import { Component } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-earn',
  templateUrl: './earn.component.html',
  styleUrls: ['./earn.component.scss'],
})
export class EarnComponent {
  constructor(public commonService: PieworksCommonService) {
    this.loadRequirements();
  }

  mandates: any = [];

  loadRequirements(): void {
    var url =
      'mainservice/recruitment/open/requirements/2?clientAnchorIds=-1&pageNum=1&pageSize=12&statusId=2,3,8,9,10&creationMonth=&searchText=&onlyWithFeeds=false&client=&minLpa=1&maxLpa=200&havingPendingPositions=na&havingClosedPositions=na&includeOfferedCandidates=true&isRspp=no';

    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      var newBatch = data['dataArray'];

        for (var i = 0; i < newBatch.length; i++) {
          if (newBatch[i].activeFrom) {
            var dateParts = newBatch[i].activeFrom.split('-');
            if (dateParts.length < 3) continue;
            var d1 = new Date(); //this.requirement[i].activeFrom
            d1.setFullYear(
              parseInt(dateParts[0]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[2])
            );
            var d2 = new Date();
            var daysOld = Math.ceil(
              (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (daysOld > 1) newBatch[i].daysOld = daysOld + ' days ago';
            else newBatch[i].daysOld = daysOld + ' day ago';
            if (newBatch[i].status.id == 2 || newBatch[i].status.id == 3) {
              newBatch[i].colorCode = 'grey';
              if (daysOld >= 30 && daysOld < 60)
                newBatch[i]['colorCode'] = '#FFBF00';
              else if (daysOld >= 60) newBatch[i]['colorCode'] = 'red';
            }
          }
        }
        this.mandates = this.mandates.concat(newBatch);
    });
  }

  flooredPayout(projectedPayoutDiscoverer: any) {
    const asInteger = parseInt(projectedPayoutDiscoverer, 10); // Convert to integer
    return Math.floor(asInteger); // Apply floor to the integer value
  }

  formatToIndianCurrency(amount: number): string {
    if (amount !== null && amount !== undefined) {
      const amountString = amount.toString();
      const lastThree = amountString.substring(amountString.length - 3);
      const otherNumbers = amountString.substring(0, amountString.length - 3);
  
      if (otherNumbers !== '') {
        // Add commas after every two digits in the otherNumbers part
        const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        return formattedOtherNumbers + "," + lastThree;
      } else {
        return lastThree;
      }
    }
    return '';
  }
  
}
