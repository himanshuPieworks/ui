import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  
  // set the currenr year
  year: number = new Date().getFullYear();

  constructor(public commonService: PieworksCommonService,private router: Router) { }

 

  activeItem: string = 'home';

  setActive(item: string) {
    this.activeItem = item;
  }
  @Output() settingsButtonClicked = new EventEmitter();
  @ViewChild('discover') discover: any;
  @ViewChild('discoverTalent') discoverTalent: any;
  handleCloseEvent() {
    // Close the modal or perform any other action
    this.discoverTalent.hide();
  }
  isOpenUrl: boolean = false;
  isAddTalent: boolean = false;
  showButtons = false;
  toggleButtons() {
    this.showButtons = !this.showButtons;
  }


  ngOnInit(): void {
    if (window.location.toString().indexOf('open') > -1) this.isOpenUrl = true;
  }
  referalLink: any = '';
  @ViewChild('floatingAddButton') floatingAddButton: any;
  showDiscoveryWindow(action: any): void {
    this.discoverTalent.show();
    this.discover.source = action;
    this.discover.initValues();
  }
  copyToClipboard() {
    this.commonService.loadMyProfile(this, (resultObj: any, parentRef: any) => {
      parentRef.referalLink =
        parentRef.commonService.uiPrefix +
        'auth/register?referalCode=' +
        resultObj.myReferalCode;
      parentRef.commonService.copyMessage(parentRef.referalLink);
      parentRef.commonService.showInfoMessage(
        'Copied',
        'Linked Coped. Please share it with your friends/acquaintances'
      );
    });
  }
  whatsappLink(): void {
    this.commonService.loadMyProfile(this, (resultObj: any, parentRef: any) => {
      parentRef.referalLink =
        parentRef.commonService.uiPrefix +
        'auth/register?referalCode=' +
        resultObj.myReferalCode;
      window.open(
        'https://api.whatsapp.com/send?text=' +
          this.commonService.encode(parentRef.referalLink),
        '_blank'
      );
    });
  }
  addProspect(): void {
    this.commonService.navigateTo('/recr/prospects', { action: 'add' });
    this.floatingAddButton.hide();
  }

  
  whatsappLinkForFuture(): void {
    const dateId = new Date().getTime();
    this.commonService.loadMyProfile(this, (resultObj: any, parentRef: any) => {
      parentRef.referalLink =
        parentRef.commonService.uiPrefix + 'recr/open/future/' +  dateId;
      window.open(
        'https://api.whatsapp.com/send?text=' +
          this.commonService.encode(parentRef.referalLink),
        '_blank'
      );
    });
  }

  copyLinkForFuture():void
  {
    const dateId = new Date().getTime();
    this.commonService.loadMyProfile(this, (resultObj: any, parentRef: any) => {
      parentRef.referalLink =
        parentRef.commonService.uiPrefix +'recr/open/future/' + dateId;
      parentRef.commonService.copyMessage(parentRef.referalLink);
      parentRef.commonService.showInfoMessage(
        'Copied',
        'Linked Coped. Please share it with your friends/acquaintances'
      );
    });
  }
}
