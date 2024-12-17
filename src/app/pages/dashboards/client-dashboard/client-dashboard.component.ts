import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
})
export class ClientDashboardComponent {
  @ViewChild('clientHiringOverview') clientHiringOverview: any;

  constructor(
    private modalService: BsModalService,
    public commonService: PieworksCommonService,
    private router: Router
  ) {
    setTimeout(()=> { this.topBarData()},500)
   
  }

  clientTopBarData: any;
  topBarData() {
    let clientIds = this.commonService.clientIds
      .toString()
      .split(',')
      .join('-');
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/client/topBarDetails?clientIds=' +
      clientIds;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.clientTopBarData = data['dataObject'];
        console.log(this.clientTopBarData);
      }
    });
  }

  // all the clientIds 
  // getEmailIdOfClient() {
  //   const url = `mainservice/framework2/forward?api=recruitmentservice/client/approvedClientAccountDetail?emailId=${this.commonService.user.username}`;
  //   this.commonService.get(url).subscribe((data: any) => {
  //     if (data['result'] === 200) {
  //       // Set clientId from the API response

  //       for (var i = 0; i < data['dataArray'].length; i++) {
  //         this.commonService.clientIds.push(data['dataArray'][i].client.id);
  //       }
  //       console.log(this.commonService.clientIds);

  //       this.topBarData();

  //       this.clientHiringOverview.clientHiringOverview();
  //       // this.clientHiringOverview.clientActionable();
  //       // this.clientHiringOverview.clientOffered();
  //     }
  //   });
  // }
}
