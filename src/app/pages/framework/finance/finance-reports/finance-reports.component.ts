import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {PieworksCommonService} from '../../../../common/pieworkscommon.service';

@Component({
  selector: 'app-finance-reports',
  templateUrl: './finance-reports.component.html',
  styleUrls: ['./finance-reports.component.scss']
})
export class FinanceReportsComponent {
    breadCrumbItems!: Array<{}>;
    constructor(private route: ActivatedRoute, public commonService: PieworksCommonService)
    {
        this.breadCrumbItems = [
        { label: 'Home', link: '/', active: false },
        { label: 'Manage', link: '/recr/manage', active: false },
        { label: 'Finance', link: '/recr/manage/finance', active: false },
        { label: 'Reports', active: true }
      ];
    }
    report:any="liabilities";
}
