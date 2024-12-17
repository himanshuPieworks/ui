import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-post-offer-followups',
  templateUrl: './post-offer-followups.component.html',
  styleUrls: ['./post-offer-followups.component.scss'],
})
export class PostOfferFollowupsComponent implements OnInit {
  @Input() discovery: any;
  @Output() discoveryChange = new EventEmitter<any>();
  @Input() parentObj: any;
  followUp: any = {
    followUpOneResult: 'Select',
    followUpOneRemark: '',
    followUpTwoResult: 'Select',
    followUpTwoRemark: '',
    followUpThreeResult: 'Select',
    followUpThreeRemark: '',
    followUpFourResult: 'Select',
    followUpFourRemark: '',
    followUpFiveResult: 'Select',
    followUpFiveRemark: '',
    followUpSixResult: 'Select',
    followUpSixRemark: '',
    followUpSevenResult: 'Select',
    followUpSevenRemark: '',
    followUpEightResult: 'Select',
    followUpEightRemark: '',
    followUpNineResult: 'Select',
    followUpNineRemark: '',
  };
  constructor(public commonService: PieworksCommonService) {}
  today = new Date();
  followCase: any = 1;
  ngOnInit(): void {
    setTimeout(() => {
      this.getPostOfferFollowUp();
    }, 500);
  }
  getPostOfferFollowUp(): void {
    console.log(this.discovery);
    console.log(this.discoveryChange);
    if(!this.discovery)
    {
        return;
    }
    var url =
      'mainservice/recruitment/shortlisting/getPostOfferFollowUp/' +
      this.discovery.id;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.followCase = parseInt(data['message']);
        if (data['dataObject']) this.followUp = data['dataObject'];
        else
          this.followUp = {
            followUpOneResult: 'Select',
            followUpOneRemark: '',
            followUpTwoResult: 'Select',
            followUpTwoRemark: '',
            followUpThreeResult: 'Select',
            followUpThreeRemark: '',
            followUpFourResult: 'Select',
            followUpFourRemark: '',
            followUpFiveResult: 'Select',
            followUpFiveRemark: '',
            followUpSixResult: 'Select',
            followUpSixRemark: '',
            followUpSevenResult: 'Select',
            followUpSevenRemark: '',
            followUpEightResult: 'Select',
            followUpEightRemark: '',
            followUpNineResult: 'Select',
            followUpNineRemark: '',
          };
      }
    });
  }

  statusOptions = [
    { label: 'Select Status', value: 'Select' },
    { label: 'Not ok', value: '#ff6666', color: '#ff6666' },
    { label: 'Ok', value: '#ffff99', color: '#ffff99' },
    { label: 'All good', value: '#4fd6ad', color: '#4fd6ad' },
  ];
  save(num: any): void {
    if (
      !this.followUp['followUp' + num + 'Remark'] ||
      !this.followUp['followUp' + num + 'Result'] ||
      this.followUp['followUp' + num + 'Result'] == 'Select'
    ) {
      ('');
      this.commonService.showInfoMessage('Info', 'Please enter the details');
      return;
    }
    this.followUp.shortlistingId = this.discovery.id;
    this.commonService.showProcessingIcon();
    this.commonService
      .post(
        'mainservice/recruitment/shortlisting/postOfferFollowUp',
        this.followUp
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.commonService.showInfoMessage('Info', 'Updation successful.');
          this.getPostOfferFollowUp();
          if (this.parentObj && this.parentObj.callBackFunction)
            this.parentObj.callBackFunction();
        }
      });
  }
}
