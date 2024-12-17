import {
  Component,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
  HostListener,
  OnInit,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EventService } from 'src/app/core/services/event.service';
import { LanguageService } from 'src/app/core/services/language.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { cartList } from './data';
import { PieworksCommonService } from '../../common/pieworkscommon.service';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from 'src/app/pages/framework/push-notification.service';
import { ConfettiService } from '../services/confetti.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit{
  @ViewChild('showClientViewClient') showClientViewClient: any;
  @ViewChild('showCompleteKyc') showCompleteKyc: any;
  isVisible = true;
  scrollThreshold = 200; // Set the scroll threshold to the desired value

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.commonService.isMobileDevice || this.isOpenUrl) {
      const scrollPosition =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      // Toggle visibility based on the scroll position
      this.isVisible = scrollPosition < this.scrollThreshold;
    } else {
      this.isVisible = true; // Ensure topbar is visible in non-mobile views
    }
  }

  country: any;
  selectedItem!: any;
  userId: any;
  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData: any;
  cartData: any;

  element: any;
  mode: string | undefined | null;

  total: any;
  subtotal: any = 0;
  totalsum: any;
  taxRate: any = 0.125;
  shippingRate: any = '65.00';
  discountRate: any = 0.15;
  discount: any;
  tax: any;
  showShine = false;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  @ViewChild('removeNotificationModal', { static: false })
  removeNotificationModal?: ModalDirective;
  @ViewChild('removeCartModal', { static: false })
  removeCartModal?: ModalDirective;
  deleteid: any;

  user: any = {};
  userImg: string = '';
  isOpenUrl = false;
  blastHandle: any;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventService: EventService,
    public languageService: LanguageService,
    private authService: AuthenticationService,
    private router: Router,
    public commonService: PieworksCommonService,
    public _cookiesService: CookieService,
    private swPush: SwPush,
    private pushNotificationService: PushNotificationService,
    private confettiService: ConfettiService
  ) {
    if (window.location.toString().indexOf('open') > -1) this.isOpenUrl = true;
    if (localStorage.getItem('user') != null) {
      this.user = JSON.parse(localStorage.getItem('user') + '');
      this.userImg = this.commonService.getPicUrl(this.user.profilepic);
    }
    this.loadNotifications();
    this.notificationsHandle = setInterval(() => {
      this.loadNotifications();
    }, 120000);
    if (commonService.user.userrole == 'COMMUNITY MEMBER') {
      this.showPostOfferWindow();
    }

    if (commonService.user.userrole == 'Client') this.getEmailIdOfClient();

    if (
      commonService.isMobileDevice &&
      this.commonService.user.userrole == 'COMMUNITY MEMBER'
    ) {
      this.loadMonthlyStats();
      this.loadMyMembership();

      setTimeout(() => {
        if (!this.member.memberSince) return;

        var fromDate: any = this.commonService.getDateXDaysAgo(30, new Date());
        var memberDate: any = this.commonService.getJsDateObject(
          this.member.memberSince
        );
        var daysLeft =
          30 - this.commonService.getDaysBetween(memberDate, new Date());

        if (
          this.monthlyStats.length < 5 &&
          this.member.memberSince &&
          this.commonService.compareDates(memberDate, fromDate) == 1
        ) {
          this.commonService.showInfoMessage(
            'Alert !!',
            'Please complete a minimum of 4 referral candidates across any of the opened mandates/positions in next ' +
              Math.round(daysLeft / 7) +
              ' week(s) to stay active on the community'
          );
        }
      }, 5000);
    }
    // this is for push notification.
    if(this.commonService.user && this.commonService.user.id)
    {
      this.onSubscribe();
      //  for celebration
      // this.celebrate();
      
      this.onBlastCelebration();
      this.blastHandle = setInterval(() => {
        this.onBlastCelebration();
      },30000)
    }

    
  }
  onSubscribe() {
    this.pushNotificationService.subscribeToNotifications().subscribe({
      next: (response) => {
        console.log('Subscription successful:', response);
      },
      error: (error) => {
        console.error('Subscription failed:', error);
      },
    });
  }

  blasts: any = [];
  blastMessage: any;
  isConfettiAnimation:any;
  titleForBlast:any;
  onBlastCelebration() {
    var url =
      'mainservice/framework2/forward?api=frameworkservice/notification/blasts/getByUserId/' +
      this.commonService.user.id;

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.blasts = data['dataArray'];

        for (const blast of this.blasts) {
         
          this.blastMessage = blast.message;
          this.isConfettiAnimation = blast.animation;
          this.titleForBlast = blast.title

          this.celebrate();
        }
      }
    });
  }
  celebrate(): void {
    this.swalForBlast();
    if(this.isConfettiAnimation)
      this.confettiService.launchSideConfetti();
  }

  swalForBlast() {
    Swal.fire({
      title: this.titleForBlast,
      text: this.blastMessage,
      showCloseButton: true,
      showConfirmButton: false,
      backdrop: false,
    });
  }
  

  kyc: string = '';
  checkKycStatus() {
    // kyc
    this.kyc = localStorage.getItem('kyc') || '';
    this.showCompleteKyc.show();
  }

  notificationsHandle: any;
  role: any;
  dashboardView: any;
  ngOnInit(): void {
    this.element = document.documentElement;
    this.role = localStorage.getItem('role');
    this.mode = localStorage.getItem('theme');
    this.dashboardView = localStorage.getItem('dashView');
    if (this.mode == null || this.mode == undefined) {
      this.changeMode('light');
    } else {
      this.changeMode(this.mode);
    }

    this.cartData = cartList;
    this.cartData.map((x: any) => {
      x['total'] = (x['qty'] * x['price']).toFixed(2);
      this.subtotal += parseFloat(x['total']);
    });
    this.subtotal = this.subtotal.toFixed(2);
    this.discount = (this.subtotal * this.discountRate).toFixed(2);
    this.tax = (this.subtotal * this.taxRate).toFixed(2);
    this.totalsum = (
      parseFloat(this.subtotal) +
      parseFloat(this.tax) +
      parseFloat(this.shippingRate) -
      parseFloat(this.discount)
    ).toFixed(2);

    this.userId = this.user.id;

    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter((x) => x.lang === this.cookieValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = 'assets/images/flags/us.svg';
      }
      this.countryName = 'English';
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
    if (this.commonService.user.userrole == 'COMMUNITY MEMBER')
      this.loadLast6MonthsNorthstar();

    // this.initScratchCard();
  }

  getEmailIdOfClient() {
    const url = `mainservice/framework2/forward?api=recruitmentservice/client/approvedClientAccountDetail?emailId=${this.commonService.user.username}`;
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        // Set clientId from the API response

        for (var i = 0; i < data['dataArray'].length; i++) {
          this.commonService.clientIds.push(data['dataArray'][i].client.id);
          this.commonService.clientProfile = data['dataArray'][i].client.icon;
          localStorage.setItem(
            'clientOrgName',
            data['dataArray'][i].companyName
          );
          this.commonService.user.confirmedUser = data['dataArray'][i].approved;
        }
      }
    });
  }

  // from here client view code ..

  selectClientView() {
    this.loadHiringOverview();
    this.showClientViewClient.show();
  }
  clientHiring: any;

  loadHiringOverview(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/discovery/clientAnchorHiringOverview?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.commonService.user.id +
      ',allCaData=' +
      false;

    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.clientHiring = data['dataObject'];

        console.log(this.clientHiring);
      } else console.error('Error in getting data');
    });
  }
  selectedClientId: any;
  selectedClients: any;
  clientSearch: any = '';
  // on client search
  onClientSearch(item: any) {
    this.clientSearch = item.term;
    this.loadHiringOverview();
  }

  // when client is already loaded locally then this method made it local searc
  clientLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }

  onClientSelect() {
    console.log('Selected clients:', this.selectedClients.id);
    // Handle the selected client objects
    this.getClientAnchorEmailIdOfClient();
  }

  getClientAnchorEmailIdOfClient() {
    const url = `mainservice/framework2/forward?api=recruitmentservice/client/approvedClientAccountDetail?emailId=${this.commonService.user.username}`;
    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        // Set clientId from the API response

        for (var i = 0; i < data['dataArray'].length; i++) {
          if (this.selectedClients.id == data['dataArray'][i].client.id) {
            this.commonService.clientIds.push(data['dataArray'][i].client.id);
          }
        }

        if (this.commonService.clientIds.length == 0) {
          console.log(
            'This is the length of : ',
            this.commonService.clientIds.length
          );
          this.saveClientAccountDetail();
        } else {
          this.commonService.dashView = 'Client';
          this.showClientViewClient.hide();
        }
      }
    });
  }

  selectedClient: any = {};
  saveClientAccountDetail() {
    let url = 'mainservice/recruitment/client/saveClientAccountDetail';
    this.selectedClient.approved = 1;
    this.selectedClient.companyName = this.selectedClients.name;
    this.selectedClient.designation = 'Client Anchor';
    this.selectedClient.client = this.selectedClients;
    this.selectedClient.user = this.commonService.user;

    this.commonService.post(url, this.selectedClient).subscribe((data: any) => {
      if (data['result'] == 200) {
        this.commonService.showSuccessMessage(
          'Saved',
          'Status Changed Successfully :)'
        );
        this.getClientAnchorEmailIdOfClient();
        this.selectedClient = {};
      }
    });
  }

  navigateToLink(notification: any): void {
    if (notification.link && notification.link.indexOf('http') > -1) {
      window.open(notification.link, '_blank');
    } else if (notification.link.indexOf('?') > -1) {
      let temp: any = notification.link.split('?');
      let temp1: any = temp[1].split('&');
      let queryParams: any = {};
      for (var i = 0; i < temp1.length; i++) {
        let temp2: any = temp1[i].split('=');
        queryParams[temp2[0]] = temp2[1];
      }
      this.commonService.navigateTo(temp[0], queryParams);
    } else {
      this.commonService.navigateTo(notification.link, undefined);
    }
  }

  hasPendingPostOfferTasks = false;
  showPostOfferWindow(): void {
    if (
      localStorage.getItem('poSkipingDate')?.toString() ==
      this.commonService.getFormatedDate(new Date(), 'dd-MM-yyyy')
    ) {
      return;
    }
    this.hasPendingPostOfferTasks = false;
    if (this.commonService.user.id) {
      this.commonService
        .get(
          'mainservice/recruitment3/forward?api=shortlisting/untrackedPostOfferDiscoveries?clientAnchorId=' +
            this.commonService.user.id
        )
        .subscribe((data: any) => {
          var discoveryIds;
          if (data['result'] == 200) {
            discoveryIds = data['dataArray'];
          }
          if (discoveryIds && discoveryIds.length > 0) {
            this.hasPendingPostOfferTasks = true;
          }
        });
    }
  }

  dashBoardView(): void {
    if (this.commonService.dashView == 'CA') {
      // location.reload();
      localStorage.setItem('dashView', 'CM');
      this.commonService.dashView = 'CM';
    } else {
      // location.reload();
      localStorage.setItem('dashView', 'CA');
      this.commonService.dashView = 'CA';
    }
  }
  windowScroll() {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      if (document.getElementById('back-to-top') as HTMLElement)
        (document.getElementById('back-to-top') as HTMLElement).style.display =
          'block';
      document.getElementById('page-topbar')?.classList.add('topbar-shadow');
    } else {
      if (document.getElementById('back-to-top') as HTMLElement)
        (document.getElementById('back-to-top') as HTMLElement).style.display =
          'none';
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow');
    }
  }

  convertToTitleCase(inputString: string): string {
    const words = inputString.split(' ');
    const titleCaseString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return titleCaseString;
  }

  // Increment Decrement Quantity
  qty: number = 0;
  increment(qty: any, i: any, id: any) {
    this.subtotal = 0;
    if (id == '0' && qty > 1) {
      qty--;
      this.cartData[i].qty = qty;
      this.cartData[i].total = (
        this.cartData[i].qty * this.cartData[i].price
      ).toFixed(2);
    }
    if (id == '1') {
      qty++;
      this.cartData[i].qty = qty;
      this.cartData[i].total = (
        this.cartData[i].qty * this.cartData[i].price
      ).toFixed(2);
    }

    this.cartData.map((x: any) => {
      this.subtotal += parseFloat(x['total']);
    });

    this.subtotal = this.subtotal.toFixed(2);
    this.discount = (this.subtotal * this.discountRate).toFixed(2);
    this.tax = (this.subtotal * this.taxRate).toFixed(2);
    this.totalsum = (
      parseFloat(this.subtotal) +
      parseFloat(this.tax) +
      parseFloat(this.shippingRate) -
      parseFloat(this.discount)
    ).toFixed(2);
  }

  removeCart(id: any) {
    this.removeCartModal?.show();
    this.deleteid = id;
  }

  confirmDelete() {
    this.removeCartModal?.hide();

    this.subtotal -= this.cartData[this.deleteid].total;
    this.subtotal = this.subtotal.toFixed(2);
    this.discount = (this.subtotal * this.discountRate).toFixed(2);
    this.tax = (this.subtotal * this.taxRate).toFixed(2);
    this.totalsum = (
      parseFloat(this.subtotal) +
      parseFloat(this.tax) +
      parseFloat(this.shippingRate) -
      parseFloat(this.discount)
    ).toFixed(2);
    this.cartData.splice(this.deleteid, 1);
  }

  /**
   * Topbar Light-Dark Mode Change
   */

  changeMode(mode: string) {
    this.mode = mode;
    localStorage.setItem('theme', mode);
    document.documentElement.setAttribute('data-bs-theme', mode);
    document.documentElement.setAttribute('data-sidebar', mode);
    document.documentElement.setAttribute('data-topbar', mode);
  }

  /***
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Española', flag: 'assets/images/flags/spain.svg', lang: 'sp' },
    { text: 'Deutsche', flag: 'assets/images/flags/germany.svg', lang: 'gr' },
    { text: 'Italiana', flag: 'assets/images/flags/italy.svg', lang: 'it' },
    { text: 'русский', flag: 'assets/images/flags/russia.svg', lang: 'ru' },
    { text: '中国人', flag: 'assets/images/flags/china.svg', lang: 'ch' },
    { text: 'français', flag: 'assets/images/flags/french.svg', lang: 'fr' },
    { text: 'Arabic', flag: 'assets/images/flags/ae.svg', lang: 'ar' },
  ];

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open');
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  // Search Topbar
  Search() {
    var searchOptions = document.getElementById(
      'search-close-options'
    ) as HTMLAreaElement;
    var dropdown = document.getElementById(
      'search-dropdown'
    ) as HTMLAreaElement;
    var input: any,
      filter: any,
      ul: any,
      li: any,
      a: any | undefined,
      i: any,
      txtValue: any;
    input = document.getElementById('search-options') as HTMLAreaElement;
    filter = input.value.toUpperCase();
    var inputLength = filter.length;

    if (inputLength > 0) {
      dropdown.classList.add('show');
      searchOptions.classList.remove('d-none');
      var inputVal = input.value.toUpperCase();
      var notifyItem = document.getElementsByClassName('notify-item');

      Array.from(notifyItem).forEach(function (element: any) {
        var notifiTxt = '';
        if (element.querySelector('h6')) {
          var spantext = element
            .getElementsByTagName('span')[0]
            .innerText.toLowerCase();
          var name = element.querySelector('h6').innerText.toLowerCase();
          if (name.includes(inputVal)) {
            notifiTxt = name;
          } else {
            notifiTxt = spantext;
          }
        } else if (element.getElementsByTagName('span')) {
          notifiTxt = element
            .getElementsByTagName('span')[0]
            .innerText.toLowerCase();
        }
        if (notifiTxt)
          element.style.display = notifiTxt.includes(inputVal)
            ? 'block'
            : 'none';
      });
    } else {
      dropdown.classList.remove('show');
      searchOptions.classList.add('d-none');
    }
  }

  /**
   * Search Close Btn
   */
  closeBtn() {
    var searchOptions = document.getElementById(
      'search-close-options'
    ) as HTMLAreaElement;
    var dropdown = document.getElementById(
      'search-dropdown'
    ) as HTMLAreaElement;
    var searchInputReponsive = document.getElementById(
      'search-options'
    ) as HTMLInputElement;
    dropdown.classList.remove('show');
    searchOptions.classList.add('d-none');
    searchInputReponsive.value = '';
  }

  /**
   * Logout the user
   */
  logout() {
    this.authService.logout();
    // if (environment.defaultauth === 'firebase') {
    //   this.authService.logout();
    // } else {
    //   this.authFackservice.logout();
    // }
    this.router.navigate(['/auth/login']);
  }

  selectedCommunityId = 2;
  unbilledItems: any;
  loadDiscoveriesForPayout(): void {
    var startingDate = this.commonService.getFormatedDate(
      this.commonService.getDateXDaysAgo(365, new Date()),
      'yyyy-MM-dd'
    );
    var endingDate = this.commonService.getFormatedDate(
      new Date(),
      'yyyy-MM-dd'
    );
    this.commonService
      .get(
        'mainservice/finance/recruitment/discoveriesForMemberPayout?correctionDueToPenalty=' +
          this.correctionDueToPenalty +
          '&communityId=' +
          this.selectedCommunityId +
          '&userId=' +
          this.commonService.user.id +
          '&startingDate=' +
          startingDate +
          '&endingDate=' +
          endingDate +
          ' 23:59:59'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.unbilledItems = [];
        if (data['result'] === 200) {
          this.unbilledItems = data['dataArray'];
          this.calculateTotal();
        }
      });
  }
  correctionDueToPenalty = 0;
  penaltyDetails = [];
  loadLast6MonthsNorthstar(): void {
    if (!this.commonService.user.id) return;
    var tempDateDays = this.commonService.getDateXDaysAgo(35, new Date());
    var tempDates = this.commonService.getStartingEndingDatesOfMonthWithDate(
      tempDateDays ? tempDateDays : new Date()
    );
    let startDate = tempDates[0];
    let endDate = tempDates[1];
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/recruitment/shortlisting/penaltyDetails/2?userId=' +
          this.commonService.user.id +
          '&createdOnFrom=' +
          this.commonService.getFormatedDate(startDate, 'yyyy-MM-dd') +
          ' 00:00:00&createdOnTill=' +
          this.commonService.getFormatedDate(endDate, 'yyyy-MM-dd') +
          ' 00:00:00&pageNum=1&pageSize=100&weeksPassed=5'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.correctionDueToPenalty = data['dataObject'];
          this.penaltyDetails = data['dataArray'];
          this.loadDiscoveriesForPayout();
        }
      });
  }
  totalPayout: any = 0;
  maturedPayout: any = 0;
  escrowAmt: any = 0;
  maturePayoutAfterPenalty: any;
  netTotal: any;
  calculateTotal(): void {
    this.totalPayout = 0;
    this.escrowAmt = 0;
    this.maturedPayout = 0;
    this.maturePayoutAfterPenalty = 0;
    this.netTotal = 0;
    for (var i = 0; i < this.unbilledItems.length; i++) {
      var disc = this.unbilledItems[i];
      this.totalPayout = this.totalPayout + this.unbilledItems[i].total;
      this.escrowAmt = this.escrowAmt + disc.escrowAmount;
      this.maturedPayout = this.maturedPayout + disc.maturedAmount;
      //this.maturePayoutAfterPenalty = (this.maturedPayout * this.correctionDueToPenalty/100) - (disc.discovery.commitChocolates+disc.discovery.chocolatesEligible)*500;
      //this.netTotal = this.maturePayoutAfterPenalty - this.maturePayoutAfterPenalty*10/100;
      this.netTotal = this.maturedPayout - (this.maturedPayout * 10) / 100;
      this.netTotal = Math.round(this.netTotal);
    }
  }

  newNotifications1 = 0;
  newNotifications2 = 0;
  newNotifications3 = 0;
  newNotifications4 = 0;
  notifications: any = [{ message: 'No notifications available' }];
  newVersionAvailable = false;
  releaseDate: any = '';
  loadNotifications(): void {
    if (!this.commonService.user.id) return;
    if (window.location.toString().indexOf('open') > -1) return;
    if (!localStorage.getItem('role')) return;
    var url =
      'mainservice/framework/notification/getByUserId/' +
      this.commonService.user.id +
      '?pageNum=1&pageSize=10&userrole=' +
      localStorage.getItem('role');
    //        this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      //            this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        var temp = data['dataObject'].split('#');
        this.newNotifications1 =
          parseInt(temp[0]) + parseInt(temp[1]) + parseInt(temp[2]);
        this.newNotifications2 = parseInt(temp[1]);
        this.newNotifications3 = parseInt(temp[2]);
        this.newNotifications4 = parseInt(temp[3]);
        this.notifications = data['dataArray'];
        if (this.notifications.length === 0)
          this.notifications = [{ message: 'No notifications available' }];
        this.releaseDate = data['message'];
        //                localStorage.setItem("release_date_new",this.releaseDate);
        if (
          localStorage.getItem('release_date') == null ||
          localStorage.getItem('release_date') == undefined
        ) {
          localStorage.setItem('release_date', this.releaseDate);
        } else if (
          localStorage.getItem('release_date')?.toString() != data['message']
        ) {
          this.newVersionAvailable = true;
          localStorage.setItem('release_date_new', data['message']);
          this.commonService.enableAutoReloadOnVersionUpdate = true;
        }
        this.newNotifications1 = 0;
        for (var i = 0; i < this.notifications.length; i++) {
          if (this.notifications[i].seen == 0) this.newNotifications1++;
          if (
            this.notifications[i].category == 4 &&
            this.notifications[i].seen == 0
          ) {
            // this.commonService.showSuccessMessage("Update",this.notifications[i].message);
            this.showPiecoinAnimation();
            this.updateNotificationAsSeen(this.notifications[i], false);
          }
        }
      }
    });
  }
  showAnimation: boolean = false;
  showPiecoinAnimation(): void {
    this.showAnimation = true;
    setTimeout(() => {
      this.showAnimation = false;
    }, 2000);
  }
  updateAllNotificationAsSeen(category: any): void {
    this.commonService
      .get(
        'mainservice/framework/notification/markAllAsRead?userId=' +
          this.commonService.user.id +
          '&category=' +
          category
      )
      .subscribe((data: any) => {
        this.loadNotifications();
      });
  }
  updateNotificationAsSeen(notification: any, openLink: boolean): void {
    if (notification.seen == 0) {
      switch (notification.category) {
        case 1:
          this.newNotifications1--;
          break;
        case 2:
          this.newNotifications2--;
          break;
        case 3:
          this.newNotifications3--;
          break;
        case 4:
          this.newNotifications4--;
          break;
      }
    }
    notification.seen = 1;
    this.commonService
      .post(
        'mainservice/framework/notification/open/save?userIds=' +
          this.commonService.user.id,
        notification
      )
      .subscribe((data: any) => {
        this.loadNotifications();
        if (openLink) {
          if (notification.link && notification.link.indexOf('http') != -1)
            window.open(notification.link, '_blank');
          else this.router.navigate([notification.link]);
        }
      });
  }

  startDate: any = this.commonService
    .getFormatedDate(
      this.commonService.getDateXDaysAgo(180, new Date()),
      this.commonService.mysqlFormat
    )
    .split(' ')[0];
  endDate: any = this.commonService
    .getFormatedDate(new Date(), this.commonService.mysqlFormat)
    .split(' ')[0];

  monthlyStats: any;
  loadMonthlyStats(): void {
    this.commonService.showProcessingIcon();
    var url =
      'mainservice/recruitment/shortlisting/shortlist/-1?pageNum=1&pageSize=1000&discovererIds=' +
      this.commonService.user.id +
      '&clientAnchorIds=-1&searchText=&status=-1&clientIds=-1&roles=-1&top50=false&minCtc=0&maxCtc=500&minExp=0&maxExp=50&tag=';
    +'&startDate=' + this.startDate + '&endDate=' + this.endDate;

    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.monthlyStats = data['dataArray'];

        this.countInterview();
      } else console.error('Error in getting data');
    });
  }

  numberOfS2C: any = 0;
  interested: any = 0;
  interviewWlp: any = 0;
  offerSent: any = 0;
  countInterview(): void {
    for (let i = 0; i < this.monthlyStats.length; i++) {
      if (
        this.monthlyStats[i].requirement.status.id != 2 &&
        this.monthlyStats[i].requirement.status.id != 3 &&
        this.monthlyStats[i].requirement.status.id != 8
      ) {
        continue;
      }
      if (this.monthlyStats[i].status.id == 2) {
        this.interested++;
      } else if (this.monthlyStats[i].status.id == 6) {
        this.numberOfS2C++;
      } else if (this.monthlyStats[i].status.id == 8) {
        this.interviewWlp++;
      } else if (this.monthlyStats[i].status.id == 10) {
        this.offerSent++;
      }
    }
  }

  member: any;
  loadMyMembership(): void {
    if (this.member) return;
    this.commonService
      .get(
        'mainservice/framework/members/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=0,1,2,3,4,5,6,7,8,9,10&acceptanceByAceMakerValues=0,1,2,3,4,5,6,7,8,9,10&userId=' +
          this.commonService.user.id +
          '&roleInCommunity=0,1'
      )
      .subscribe((data: any) => {
        this.member = data['dataArray'][0];

        if (this.member.acceptanceByAceMaker == 11) {
          this.commonService.showErrorMessage(
            'Alert !!',
            'You have been withheld from discrete information on the platform, kindly connect with the Community Manager Mr. Anush Karthikeyan at anush@pieworks.in and understand how you can rejoin'
          );
        }
      });
  }
  navigateToDiscoveries(action: any): void {
    let userIds = this.member.buddies + ',' + this.commonService.user.id;
    if (this.member.buddyType == 'CO-BUDDY')
      userIds = this.commonService.user.id;
    let startDate = this.commonService.getCurrentMonthStartDate();
    let endDate = this.commonService
      .getFormatedDate(new Date(), this.commonService.mysqlFormat)
      .split(' ')[0];
    let discIds = '';
    if (this.commonService.user.confirmedUser == 1) {
      switch (action) {
        case 'northStar':
          localStorage.setItem(
            'discFilter',
            '-1::' +
              userIds +
              '::::21,6,19,22,5,8,7,9,11,18,23,10,13,15,24,12,14,16,17,20::-1::-1::false::0::500::0::50::-1::' +
              startDate +
              '::' +
              endDate +
              '::false'
          );
          this.commonService.navigateTo('recr/discoveries', {});
          break;
        case 'interviewWip':
          discIds = '';
          for (let i = 0; i < this.monthlyStats.length; i++) {
            if (
              this.monthlyStats[i].requirement.status.id != 2 &&
              this.monthlyStats[i].requirement.status.id != 3 &&
              this.monthlyStats[i].requirement.status.id != 8
            ) {
              continue;
            }
            if (this.monthlyStats[i].status.id == 8) {
              if (discIds.length == 0) discIds = this.monthlyStats[i].id;
              else discIds = discIds + ',' + this.monthlyStats[i].id;
            }
          }
          if (discIds.length != 0)
            this.commonService.navigateTo('recr/discoveries', {
              discoveryIds: discIds,
            });
          break;
        case 's2c':
          discIds = '';
          for (let i = 0; i < this.monthlyStats.length; i++) {
            if (
              this.monthlyStats[i].requirement.status.id != 2 &&
              this.monthlyStats[i].requirement.status.id != 3 &&
              this.monthlyStats[i].requirement.status.id != 8
            ) {
              continue;
            }
            if (this.monthlyStats[i].status.id == 6) {
              if (discIds.length == 0) discIds = this.monthlyStats[i].id;
              else discIds = discIds + ',' + this.monthlyStats[i].id;
            }
          }
          if (discIds.length != 0)
            this.commonService.navigateTo('recr/discoveries', {
              discoveryIds: discIds,
            });
          break;
        case 'interested':
          discIds = '';
          for (let i = 0; i < this.monthlyStats.length; i++) {
            if (
              this.monthlyStats[i].requirement.status.id != 2 &&
              this.monthlyStats[i].requirement.status.id != 3 &&
              this.monthlyStats[i].requirement.status.id != 8
            ) {
              continue;
            }
            if (this.monthlyStats[i].status.id == 2) {
              if (discIds.length == 0) discIds = this.monthlyStats[i].id;
              else discIds = discIds + ',' + this.monthlyStats[i].id;
            }
          }
          if (discIds.length != 0)
            this.commonService.navigateTo('recr/discoveries', {
              discoveryIds: discIds,
            });
          break;
        case 'offerSent':
          discIds = '';
          for (let i = 0; i < this.monthlyStats.length; i++) {
            if (
              this.monthlyStats[i].requirement.status.id != 2 &&
              this.monthlyStats[i].requirement.status.id != 3 &&
              this.monthlyStats[i].requirement.status.id != 8
            ) {
              continue;
            }
            if (this.monthlyStats[i].status.id == 10) {
              if (discIds.length == 0) discIds = this.monthlyStats[i].id;
              else discIds = discIds + ',' + this.monthlyStats[i].id;
            }
          }
          if (discIds.length != 0)
            this.commonService.navigateTo('recr/discoveries', {
              discoveryIds: discIds,
            });
          break;
      }
    }
  }
}
