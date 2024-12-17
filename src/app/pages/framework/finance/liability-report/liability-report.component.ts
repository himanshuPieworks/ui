import {Component} from '@angular/core';
import {PieworksCommonService} from '../../../../common/pieworkscommon.service';

@Component({
    selector: 'app-liability-report',
    templateUrl: './liability-report.component.html',
    styleUrls: ['./liability-report.component.scss']
})
export class LiabilityReportComponent {
    constructor(public commonService: PieworksCommonService) {
        this.loadLiabilities();
    }
    data: any = [];message = "";
    loadLiabilities(): void {
        this.message = "Loading data ....";
        var url = "mainservice/finance/recruitment/liabilities?communityId=" + localStorage.getItem("communityId");
        this.commonService.get(url).subscribe((data: any) => {
            this.commonService.hideProcessingIcon();
            if (data['result'] === 200) {
                this.commonService.hideProcessingIcon();
                this.data = data["dataArray"];
                this.message= data["message"];
            }
        });
    }
}
