import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-offer-action',
  templateUrl: './post-offer-action.component.html',
  styleUrls: ['./post-offer-action.component.scss'],
})
export class PostOfferActionComponent implements OnInit {
  @ViewChild('postOffer') postOffer: any;
  constructor(
    public router: Router,
    public commonService: PieworksCommonService
  ) {
    //this.discoveryIds = this.commonService.getParameterFromUrl("discoveryIds");
    this.loadPostOfferDiscoveryIds();
    this.commonService.showInfoMessage(
      'Pending task alert !!',
      ' Post offer tracking is pending for some of the discoveries? You can either complete it or skip maximum of 3 times.'
    );
  }

  ngOnInit(): void {}
  totalCandidates: any;
  status: any = '';
  statusArray: any = [];
  searchText: any = '';
  top50: any = false;
  minCtc: any = 0;
  maxCtc = 500;
  minExp = 0;
  maxExp = 50;
  selectedTag = '';
  discoveryIds: any;
  reqHandle: any;
  shortlisting: any = [];
  paginationMessage: any;
  block: any;
  tableView = true;
  selectedDiscovery: any;
  loadPostOfferDiscoveryIds(): void {
    this.commonService
      .get(
        'mainservice/recruitment3/forward?api=shortlisting/untrackedPostOfferDiscoveries?clientAnchorId=' +
          this.commonService.user.id
      )
      .subscribe((data: any) => {
        this.discoveryIds = '';
        if (data['result'] == 200) {
          var temp = data['dataArray'];
          for (var i = 0; i < temp.length; i++) {
            if (i == 0) this.discoveryIds = temp[i];
            else this.discoveryIds = this.discoveryIds + ',' + temp[i];
          }
          this.loadStatus();
        }
      });
  }
  loadStatus(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/recruitment/shortlisting/status')
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.statusArray = data['dataArray'];
          this.loadShortlistedCandidates(false);
        }
      });
  }
  loadShortlistedCandidates(filterChanged: any): void {
    var localStatus = this.status.toString();
    if (this.status.length === 0) {
      for (var i = 0; i < this.statusArray.length; i++)
        localStatus = localStatus + this.statusArray[i].id + ',';
      localStatus = localStatus.substring(0, localStatus.length - 1);
    }
    var localRoles = '-1';

    var localClients = '-1';

    var localDiscoverers = '-1';
    var localClientAnchors = '-1';

    var url =
      'mainservice/recruitment/shortlisting/shortlist/-1?pageNum=1&pageSize=' +
      10000;
    url =
      url +
      '&discovererIds=' +
      localDiscoverers +
      '&clientAnchorIds=' +
      localClientAnchors +
      '&searchText=' +
      this.searchText +
      '&status=' +
      localStatus +
      '&clientIds=' +
      localClients +
      '&roles=' +
      localRoles +
      '&top50=' +
      this.top50 +
      '&minCtc=' +
      this.minCtc +
      '&maxCtc=' +
      this.maxCtc +
      '&minExp=' +
      this.minExp +
      '&maxExp=' +
      this.maxExp +
      '&tag=' +
      this.selectedTag;
    if (this.discoveryIds != undefined)
      url = url + '&discoveryIds=' + this.discoveryIds;

    if (this.reqHandle) {
      this.reqHandle.unsubscribe();
    }
    this.commonService.showProcessingIcon();
    this.totalCandidates = 0;
    this.reqHandle = this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      this.shortlisting = [];
      if (data['result'] === 200) {
        this.block = false;
        var newBatch = data['dataArray'];
        this.shortlisting = this.shortlisting.concat(newBatch);
        this.paginationMessage = data['message'];
      }
      if (this.shortlisting.length == 0) {
        this.router.navigate(['home']);
      }
      this.totalCandidates = data['dataObject'];
      console.log('discoveries ' + this.totalCandidates);
      if (
        localStatus.split(',').length < 19 ||
        localClients != '-1' ||
        localRoles != '-1' ||
        localClientAnchors != '-1'
      ) {
        return;
      }
    });
  }
  skip(discovery: any): void {
    if (discovery.poSkipCounter >= 3) {
      this.commonService.showInfoMessage(
        'For ' + discovery.candidate.name,
        +',you have already reached maximum allowed skips. Please update the post framework details to proceed to the application.'
      );
      return;
    }

    Swal.fire({
      title: 'Confirmation required',
      text: 'You can skip maximum 3 times for a discovery. Are you sure you want to continue?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        for (var i = 0; i < this.shortlisting.length; i++) {
          if (this.shortlisting[i].id == discovery.id) {
            this.shortlisting.splice(i, 1);
            discovery.poSkipCounter = discovery.poSkipCounter + 1;
            this.updateDiscovery(discovery);
            break;
          }
        }
        if (this.shortlisting.length == 0) {
          localStorage.setItem(
            'poSkipingDate',
            this.commonService.getFormatedDate(new Date(), 'dd-MM-YYYY')
          );
          this.router.navigate(['/home']);
        }
      }
    });
    // this.commonService.showConfirmWindow(
    //   'Confirmation',
    //   'You can skip maximum 3 times for a discovery. Are you sure you want to continue?',
    //   () => {
    //     for (var i = 0; i < this.shortlisting.length; i++) {
    //       if (this.shortlisting[i].id == discovery.id) {
    //         this.shortlisting.splice(i, 1);
    //         discovery.poSkipCounter = discovery.poSkipCounter + 1;
    //         this.updateDiscovery(discovery);
    //         break;
    //       }
    //     }
    //     if (this.shortlisting.length == 0) {
    //       localStorage.setItem(
    //         'poSkipingDate',
    //         this.commonService.getFormatedDate(new Date(), 'dd-MM-YYYY')
    //       );
    //       this.router.navigate(['/home']);
    //     }
    //   },
    //   undefined
    // );
  }
  skipAll(): void {
    let reachedMaxLimit = false;

    Swal.fire({
      title: 'Confirmation required',
      text: 'You can skip maximum 3 times for a discovery. Are you sure you want to continue?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        for (var i = 0; i < this.shortlisting.length; ) {
          var discovery = this.shortlisting[i];
          if (discovery.poSkipCounter >= 3) {
            reachedMaxLimit = true;
            i++;
            continue;
          }
          this.shortlisting.splice(i, 1);
          discovery.poSkipCounter = discovery.poSkipCounter + 1;
          this.updateDiscovery(discovery);
        }
        if (reachedMaxLimit)
          this.commonService.showInfoMessage(
            'Skipped',
            'You have already skipped some of the entries maximum allowed times. Please complete those tasks to continue to the main application.'
          );
        if (this.shortlisting.length == 0) {
          localStorage.setItem(
            'poSkipingDate',
            this.commonService.getFormatedDate(new Date(), 'dd-MM-yyyy')
          );
          this.router.navigate(['/home']);

          setTimeout(() => { window.location.reload()},500);
        }
      }
    });
    // this.commonService.showConfirmWindow(
    //   'Confirmation',
    //   'You can skip maximum 3 times for a discovery. Are you sure you want to continue?',
    //   () => {
    //     for (var i = 0; i < this.shortlisting.length; ) {
    //       var discovery = this.shortlisting[i];
    //       if (discovery.poSkipCounter >= 3) {
    //         reachedMaxLimit = true;
    //         i++;
    //         continue;
    //       }
    //       this.shortlisting.splice(i, 1);
    //       discovery.poSkipCounter = discovery.poSkipCounter + 1;
    //       this.updateDiscovery(discovery);
    //     }
    //     if (reachedMaxLimit)
    //       this.commonService.showInfoMessage(
    //         'Skipped',
    //         'You have already skipped some of the entries maximum allowed times. Please complete those tasks to continue to the main application.'
    //       );
    //     if (this.shortlisting.length == 0) {
    //       localStorage.setItem(
    //         'poSkipingDate',
    //         this.commonService.getFormatedDate(new Date(), 'dd-MM-yyyy')
    //       );
    //       this.router.navigate(['home']);
    //     }
    //   },
    //   undefined
    // );
  }
  updateDiscovery(discovery: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/recruitment/shortlisting/shortlist', discovery)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
      });
  }

  complete(discovery: any): void {
    this.selectedDiscovery = discovery;
    this.postOffer.discovery = discovery;
    this.postOffer.parentObj = this;
    this.postOffer.getPostOfferFollowUp();
    this.tableView = false;
  }
  callBackFunction(): void {
    this.tableView = true;
    this.loadPostOfferDiscoveryIds();
    this.selectedDiscovery.poSkipCounter = 0;
    this.updateDiscovery(this.selectedDiscovery);
    this.commonService.goTop();
    //setTimeout(()=>{window.location.reload()},2000);
  }
}
