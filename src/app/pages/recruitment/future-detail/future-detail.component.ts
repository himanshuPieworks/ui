import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-future-detail',
  templateUrl: './future-detail.component.html',
  styleUrls: ['./future-detail.component.scss'],
})
export class FutureDetailComponent {
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    this.urlPrefix = this.commonService.urlPrefix;
    this.futureId = this.route.snapshot.paramMap.get('id');
    this.loadFuture();
  }
  futureId: any = '-1';
  urlPrefix = '';
  ngOnInit(): void {}
  breadCrumbItems = [
    { label: 'Home', link: '/', active: false },
    { label: 'Manage', link: '/recr/manage', active: false },
    { label: 'Talents', link: 'fw/ta/account', active: false },
    { label: 'Future Details', link: '/recr/future-detail', active: true },
  ];
  candidate: any = {};
  markAsValidated(confirmed: any): void {
    if (!confirmed) {
      this.commonService.showConfirmWindow(
        'Confirmation',
        'Are you sure, you want to mark ' +
          this.candidate.name +
          ' as validated ?',
        () => {
          this.markAsValidated(true);
        },
        undefined
      );
      return;
    }
    this.candidate.validated = 1;
    this.commonService
      .post('mainservice/recruitment/future/openresource/save', this.candidate)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
        } else {
          this.candidate.validated = 0;
          this.commonService.showErrorMessage('Error', data['message']);
        }
      });
  }
  loadFuture(): void {
    var url = 'mainservice/recruitment/future/get/' + this.futureId;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.candidate = data['dataObject'];
      }
    });
  }
}
