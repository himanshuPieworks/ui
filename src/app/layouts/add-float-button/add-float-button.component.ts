import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventService } from 'src/app/core/services/event.service';
import {
  DATA_PRELOADER,
  LAYOUT_MODE,
  LAYOUT_POSITION,
  LAYOUT_THEME,
  LAYOUT_VERTICAL,
  LAYOUT_WIDTH,
  SIDEBAR_COLOR,
  SIDEBAR_IMAGE,
  SIDEBAR_SIZE,
  SIDEBAR_VIEW,
  TOPBAR,
} from '../layout.model';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-add-float-button',
  templateUrl: './add-float-button.component.html',
  styleUrls: ['./add-float-button.component.scss'],
})
export class AddFloatButtonComponent {
  rightsidebar: any;
  layout: string | undefined;
  theme: string | undefined;
  mode: string | undefined;
  width: string | undefined;
  position: string | undefined;
  topbar: string | undefined;
  size: string | undefined;
  sidebarView: string | undefined;
  sidebar: string | undefined;
  attribute: any;
  sidebarImage: any;
  sidebarVisibility: any;
  preLoader: any;
  grd: any;

  @Output() settingsButtonClicked = new EventEmitter();
  @ViewChild('discover') discover: any;
  @ViewChild('discoverTalent') discoverTalent: any;
  handleCloseEvent() {
    // Close the modal or perform any other action
    this.discoverTalent.hide();
  }
  isOpenUrl: boolean = false;
  isAddTalent: boolean = false;
  // @ViewChild('offcanvasExample', { static: false }) offcanvasExample?: NgxAsideComponent;

  constructor(
    public commonService: PieworksCommonService,
    private eventService: EventService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // this.layout = LAYOUT_VERTICAL;
    // this.theme = LAYOUT_THEME;
    // this.mode = LAYOUT_MODE;
    // this.width = LAYOUT_WIDTH;
    // this.position = LAYOUT_POSITION;
    // this.topbar = TOPBAR;
    // this.size = SIDEBAR_SIZE;
    // this.sidebarView = SIDEBAR_VIEW;
    // this.sidebar = SIDEBAR_COLOR;
    // this.sidebarImage = SIDEBAR_IMAGE;
    // this.preLoader = DATA_PRELOADER;
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
        parentRef.commonService.uiPrefix + 'recr/open/future/' + dateId;
      window.open(
        'https://api.whatsapp.com/send?text=' +
          this.commonService.encode(parentRef.referalLink),
        '_blank'
      );
    });
  }

  copyLinkForFuture(): void {
    const dateId = new Date().getTime();
    this.commonService.loadMyProfile(this, (resultObj: any, parentRef: any) => {
      parentRef.referalLink =
        parentRef.commonService.uiPrefix +
        'recr/open/future/' +
        dateId +
        '?referalCode=' +
        resultObj.myReferalCode;
      parentRef.commonService.copyMessage(parentRef.referalLink);
      parentRef.commonService.showInfoMessage(
        'Copied',
        'Linked Coped. Please share it with your friends/acquaintances'
      );
    });
  }

  routeFutureForm() {
    this.commonService.loadMyProfile(this, (resultObj: any, parentRef: any) => {
      this.commonService.navigateTo('recr/future-form', {
        referalCode: resultObj.myReferalCode,
      });
    });
  }
}
