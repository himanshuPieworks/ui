import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss'],
})
export class UnsubscribeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {}

  emailId: any;
  reason: any = [
    'Not relevant',
    'Too many emails',
    'Found alternative',
    'Others',
  ];
  unsubscribe: any = {};
  unsubscribeDone: boolean = true;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.emailId = params['emailId'];
      this.getSubscriptionStatus();
    });
  }
  unsubscribeMail(): void {
    if(!this.emailId || !this.unsubscribe.reason)
      return;
    this.unsubscribe.emailId = this.emailId;
    this.commonService
      .post('mainservice/open/unSubscribeMail', this.unsubscribe)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.unsubscribeDone = false;
        }
      });
  }

  getSubscriptionStatus(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/open/getSubscribtion?emailId=' + this.emailId)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          if (data['dataObject'])
          {
             this.unsubscribeDone = false;
          }
        }
      });
  }
}
