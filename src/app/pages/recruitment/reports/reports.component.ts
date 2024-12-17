import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

    section:any=1;
    selectedReportName: any ="monthlyReport";
    breadCrumbItems:any = [
        { label: 'Home', link: '/', active: false },
        { label: 'Manage',link:'/recr/manage', active: false },
        { label: 'Reports', active: true }
      ];
    
}
