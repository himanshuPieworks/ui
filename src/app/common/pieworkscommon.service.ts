import { Injectable, EventEmitter, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { environment } from '../../environments/environment';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { catchError, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PieworksCommonService {
  urlPrefix = '';
  uiPrefix = '';
  dashView = 'CM';
  isTesting: any;
  env: any;
  selectedTab: any;
  processingIcon = true;
  clientOrgName:any;
  processingIconEvent: EventEmitter<boolean>;
  errMsgEvent: EventEmitter<string>;
  showConfirmEvent: EventEmitter<object>;
  showGeneralInputEvent: EventEmitter<object>;
  currentLocation: any;
  linkedInCode: any;
  constructor(
    private _location: Location,
    public http: HttpClient,
    public toastService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: SocialAuthService,
    private datePipe: DatePipe
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    this.linkedInCode = urlParams.get('code');
    setTimeout(() => {
      this.autoRedirect();
    }, 1000);

    if (localStorage.getItem('dashView'))
      this.dashView = localStorage.getItem('dashView') + '';
    this.processingIconEvent = new EventEmitter<boolean>();
    this.errMsgEvent = new EventEmitter<string>();
    this.showConfirmEvent = new EventEmitter<object>();
    this.showGeneralInputEvent = new EventEmitter<object>();
    this.parseUrlParams();
    this.env = environment;
    this.urlPrefix = environment['mainserviceUrl'];
    this.uiPrefix = environment['uiUrl'];
    this.isTesting = environment['isTesting'];
    if (this.isTesting == undefined) this.isTesting = true;
    this.checkMobileDevice();
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user') + '');
    }
    setTimeout(() => {
      this.loadAccessRights();
    }, 500);

    this.router.events.subscribe((val: any) => {
      if (val['url']) {
        if (this.currentLocation != val['url']) {
          if (this.enableAutoReloadOnVersionUpdate) {
            window.location.reload();
            this.enableAutoReloadOnVersionUpdate = false;
          }
          this.currentLocation = val['url'];
        }
      }
      // console.log(this.currentLocation );
    });
  }
  loadMyMembership(cb: any): void {
    if (localStorage.getItem('role') != 'COMMUNITY MEMBER') return;
    let communityId: any = '2';
    if (localStorage.getItem('communityId')) {
      communityId = localStorage.getItem('communityId');
    } else {
      localStorage.setItem('communityId', '2');
    }
    var url =
      'mainservice/framework/members/' +
      communityId +
      '?acceptanceByAceValues=0,1,2,3,4,5,6,7,8,9,10&acceptanceByAceMakerValues=0,1,2,3,4,5,6,7,8,9,10&userId=' +
      this.user.id +
      '&roleInCommunity=0,1';
    this.get(url).subscribe((data: any) => {
      if (cb) cb(data['dataArray'][0]);
    });
  }
  enableAutoReloadOnVersionUpdate: boolean = false;
  getPicUrl(url: any): string {
    if (!url) return 'assets/images/users/user-dummy-img.jpg';
    if (url.indexOf('assets') > -1 || url.indexOf('http') > -1) return url;
    return this.urlPrefix + url;
  }
  public rbac: any = {};
  user: any = {};
  clientIds: any = [];
  clientProfile: any;
  loadAccessRights(): void {
    if (!this.user.id) return;
    this.get(
      'mainservice/framework/rbac/roleFeatureMapping?userId=' + this.user.id
    ).subscribe((data: any) => {
      if (data['result'] === 200) {
        var roleFeatureMapping = data['dataArray'];
        for (var i = 0; i < roleFeatureMapping.length; i++) {
          this.rbac[roleFeatureMapping[i].featureName] = true;
        }
      }
    });
  }
  ago: any;
  second: any;
  hour: any;
  day: any;

  getTimeElapsed(startDate: any, endDate: Date = new Date()): string {
    const elapsedTimeMilliseconds = endDate.getTime() - startDate.getTime();
    const seconds = Math.floor(elapsedTimeMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
  }

  // Function to convert time to 12-hour format
  convertToAmPm(timeStr: string): string {
    // Splitting the time string into hours, minutes, and seconds
    const [hours, minutes, _] = timeStr.split(':');

    // Converting hours to integer
    const hoursInt = parseInt(hours, 10);

    // Determining if it's AM or PM
    const period = hoursInt < 12 ? 'AM' : 'PM';

    // Converting hours to 12-hour format
    let formattedHours = hoursInt % 12;
    if (formattedHours === 0) {
      formattedHours = 12; // 12 AM or 12 PM
    }

    // Creating the formatted time string
    const formattedTime = `${this.addLeadingZero(
      formattedHours
    )}:${this.addLeadingZero(parseInt(minutes, 10))} ${period}`;

    return formattedTime;
  }

  // Function to add leading zero if necessary
  addLeadingZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  formatDate(dateString: string): string {
    // Parse the input date string into a Date object
    const date = new Date(dateString);

    // Format the date as "1st April 2024"
    const formattedDate = this.datePipe.transform(date, 'd MMMM yyyy');

    return formattedDate || ''; // return formatted date or empty string if failed
  }

  convertToTitleCase(inputString: string): string {
    const words = inputString.split(' ');
    const titleCaseString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return titleCaseString;
  }

  showHelpContent(url: any): void {
    this.isLeftVisible = false;
    this.helpUrl = url;
  }
  hideHelpContent(): void {
    this.isLeftVisible = true;
    this.helpUrl = '';
  }
  isLeftVisible = true;
  helpUrl = '';
  isMobileDevice = false;
  ngOnDestroy() {
    console.log(
      'This is not working. ngOnDestroy for service not getting called.'
    );
  }
  checkMobileDevice() {
    if (navigator.userAgent.toLowerCase().indexOf('mobile') != -1)
      this.isMobileDevice = true;
    else this.isMobileDevice = false;
  }
  get(url: string): any {
    url = this.urlPrefix + url;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    if (
      localStorage.getItem('accesstoken') !== undefined &&
      localStorage.getItem('accesstoken') !== null
    ) {
      var accessToken = localStorage.getItem('accesstoken');
      httpOptions.headers = new HttpHeaders({
        Authorization: accessToken + '',
      });
    }
    return this.http.get(url, httpOptions);
  }
  getBlob(url: string) {
    url = this.urlPrefix + url;
    let headers = null;
    headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    if (
      localStorage.getItem('accesstoken') !== undefined &&
      localStorage.getItem('accesstoken') !== null
    ) {
      headers = new HttpHeaders({
        Authorization: localStorage.getItem('accesstoken') + '',
        Accept: 'text/html,application/xhtml+xml,application/xml',
        'Accept-Encoding': 'gzip, deflate, br',
      });
    }
    return this.http.get(url, { headers, responseType: 'blob' as 'json' });
    //return this.http.get(url,{ headers: headers,observe: 'response',responseType: 'blob' });
  }
  postBlob(url: string, jsondata: any) {
    url = this.urlPrefix + url;
    let headers = null;
    headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    if (
      localStorage.getItem('accesstoken') !== undefined &&
      localStorage.getItem('accesstoken') !== null
    ) {
      headers = new HttpHeaders({
        Authorization: localStorage.getItem('accesstoken') + '',
        Accept: 'text/html,application/xhtml+xml,application/xml',
        'Accept-Encoding': 'gzip, deflate, br',
      });
    }
    return this.http.post(url, jsondata, {
      headers,
      responseType: 'blob' as 'json',
    });
    //return this.http.get(url,{ headers: headers,observe: 'response',responseType: 'blob' });
  }
  post(url: string, jsondata: any): any {
    url = this.urlPrefix + url;
    let headers = null;
    headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    if (
      localStorage.getItem('accesstoken') !== undefined &&
      localStorage.getItem('accesstoken') !== null
    ) {
      headers = new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('accesstoken') + '',
      });
    }
    let options = { headers: headers };
    if (localStorage.getItem('accesstoken') !== null)
      return this.http.post(url, jsondata, options);
    else return this.http.post(url, jsondata);
  }

  // club Icon for event in talent login

  clubIcon(clubName: any): string {
    if (clubName == 'Tech Club') {
      return 'bi bi-globe2';
    } else if (clubName == 'Fit Club') {
      return 'ri-run-line';
    } else if (clubName == 'Art Club') {
      return 'bi bi-brush-fill';
    } else if (clubName == 'Book Club') {
      return 'bi bi-book-half';
    } else if (clubName == 'Music Club') {
      return 'bi bi-music-note-beamed';
    } else if (clubName == 'Gyaan Club') {
      return 'bi bi-mortarboard';
    } else if (clubName == 'Theatre') {
      return 'bi bi-film';
    } else {
      return 'bi bi-suit-club';
    }
  }

  post2(url: string, jsondata: any, header: any) {
    url = this.urlPrefix + url;
    return this.http.post(url, jsondata, header);
  }

  showProcessingIcon() {
    //this.showSuccessMessage("Update","Submiting request ");
  }
  hideProcessingIcon() {
    this.processingIcon = false;
    this.processingIconEvent.emit(this.processingIcon);
    //console.log("hiding processing icon");
  }
  id: any;
  count: any;
  urlAtTrackingTask = '';

  params: any;
  getParameterFromUrl(param: string) {
    return this.params[param];
  }
  private parseUrlParams() {
    this.route.queryParams.subscribe((params) => this.setParams(params));
  }
  private setParams(params: any) {
    this.params = params;
  }

  containsSpecialChar(param: string, excludeChars: string) {
    var special = [
      '`',
      '~',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '(',
      ')',
      '-',
      '_',
      '+',
      '=',
      '{',
      '}',
      '[',
      ']',
      ':',
      ';',
      "'",
      ',',
      '<',
      '.',
      '>',
      '\\',
      '?',
      '|',
      '!',
      '@',
    ];
    for (var i = 0; i < special.length; i++) {
      if (param.indexOf(special[i]) > -1) {
        if (excludeChars !== undefined && excludeChars.indexOf(special[i]) > -1)
          continue;
        else return true;
      }
    }
    return false;
  }
  removeSpecialChar(param: string, excludeChars: string, replaceWith: string) {
    var special = [
      ' ',
      '`',
      '"',
      '~',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '(',
      ')',
      '-',
      '_',
      '+',
      '=',
      '{',
      '}',
      '[',
      ']',
      ':',
      ';',
      "'",
      ',',
      '<',
      '.',
      '>',
      '\\',
      '?',
      '|',
      '!',
      '@',
    ];
    for (var i = 0; i < special.length; i++) {
      if (param.indexOf(special[i]) > -1) {
        if (excludeChars !== undefined && excludeChars.indexOf(special[i]) > -1)
          continue;
        else param = param.split(special[i]).join(replaceWith);
      }
    }
    return param;
  }
  mysqlFormat = 'yyyy-MM-dd hh:mm:ss';
  changeMysqlToNormalDate(mysqlDate: any) {
    if (mysqlDate === undefined || mysqlDate === null) return '';
    var temp = mysqlDate.split(' ')[0].split('-');
    return temp[2] + '-' + temp[1] + '-' + temp[0];
  }
  changeNormalToMysqlDate(normalDate: any) {
    if (normalDate === undefined || normalDate === null) return '';
    var temp = normalDate.split(' ')[0].split('-');
    return temp[2] + '-' + temp[1] + '-' + temp[0];
  }
  getFormatedDate(dateTime: any, format: any) {
    var hh = dateTime.getHours();
    var mm = dateTime.getMinutes();
    var ss = dateTime.getSeconds();
    var dd = dateTime.getDate();
    var month = dateTime.getMonth() + 1;
    if (dateTime.getDate() < 10) dd = '0' + dateTime.getDate();
    if (month < 10) month = '0' + month;
    if (dateTime.getHours() < 10) hh = '0' + dateTime.getHours();
    if (dateTime.getMinutes() < 10) mm = '0' + dateTime.getMinutes();
    if (dateTime.getSeconds() < 10) ss = '0' + dateTime.getSeconds();
    if (format === 'dd-MM-yyyy hh:mm:ss')
      return (
        dd +
        '-' +
        month +
        '-' +
        dateTime.getFullYear() +
        ' ' +
        hh +
        ':' +
        mm +
        ':' +
        ss
      );
    else if (format === 'dd-MM-yyyy')
      return dd + '-' + month + '-' + dateTime.getFullYear();
    else if (format === 'yyyy-MM-dd hh:mm:ss')
      return (
        dateTime.getFullYear() +
        '-' +
        month +
        '-' +
        dd +
        ' ' +
        hh +
        ':' +
        mm +
        ':' +
        ss
      );
    else if (format === 'yyyy-MM-dd')
      return dateTime.getFullYear() + '-' + month + '-' + dd;
    else if (format === 'MM-dd') return month + '-' + dd;
    else if (format === 'yyyy-MM') return dateTime.getFullYear() + '-' + month;
    else if (format === 'ddMMyyyy')
      return dd.toString() + month + dateTime.getFullYear().toString();
    else if (format === 'ddMMyyyyhhmmss')
      return (
        dd.toString() + month + dateTime.getFullYear().toString() + hh + mm + ss
      );
    else
      return (
        dateTime.getFullYear() +
        '-' +
        month +
        '-' +
        dd +
        ' ' +
        hh +
        ':' +
        mm +
        ':' +
        ss
      );
  }

  formatTimeToAMPM(inputDateTime: string): string {
    const date = new Date(inputDateTime);

    // Extract hours, minutes, and seconds
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Pad minutes with leading zero if needed
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Construct the time string
    const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

    return formattedTime;
  }

  showImageWindow(
    title: any,
    image: any,
    okCallBackFn: any,
    cancelCallBackFn: any
  ) {}
  showConfirmWindow(
    title: any,
    message: any,
    okCallBackFn: any,
    cancelCallBackFn: any
  ) {}
  showInfoMessage(title: any, message: any) {
    this.toastService.info(message, title, {
      positionClass: 'toast-top-center',
    });
  }
  showSuccessMessage(title: any, message: any) {
    this.toastService.success(message, title, {
      positionClass: 'toast-top-center',
    });
  }
  showErrorMessage(title: any, message: any) {
    this.toastService.error(message, title, {
      positionClass: 'toast-top-center',
      timeOut: 3000,
    });
  }
  toolTip: any;
  toolTipEvent: any;
  test = () => {
    this.closeToolTip(event);
  };
  showToolTip(message: any, event: any) {}
  closeToolTip(event: any): void {
    this.toolTip.close();
    event.target.removeEventListener('mouseout', this.test);
  }
  goBack(): void {
    this._location.back();
  }
  clearLocalStorage() {
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('usersname');
    // localStorage.removeItem('role');
    localStorage.removeItem('cookiesEnabled');
    localStorage.removeItem('userId');
    localStorage.removeItem('communityId');
    localStorage.removeItem('communityName');
    localStorage.removeItem('tokenid');
    localStorage.removeItem('candFilter');
    localStorage.removeItem('reqFilter');
    localStorage.removeItem('discFilter');
    localStorage.removeItem('googleCredential');
    localStorage.removeItem('redirectUrl');
    localStorage.removeItem('redirect');
    localStorage.removeItem('monthly_dashboard_filter');
    localStorage.removeItem('quarter_dashboard_filter');
    localStorage.removeItem('user');
    localStorage.removeItem('clientOrgName');
  }
  logout() {
    //            if(localStorage.getItem("tokenid")!==null)
    //            {
    this.showProcessingIcon();
    this.authService.signOut();
    this.post('mainservice/auth/logout', {}).subscribe((data: any) => {
      this.hideProcessingIcon();
      this.clearLocalStorage();
      this.authService.signOut();
      setTimeout(() => {
        this.router.navigate(['login']);
        window.location.reload();
      }, 1000);
    });
    //            }
    //            else
    //            {
    //                this.clearLocalStorage();
    //                this.router.navigate(["login"]);
    //            }
  }
  sendNotification(
    userIds: any,
    message: any,
    link: any,
    userrole: string,
    category: number,
    mailReqd: number,
    pushReqd: number = 0 // Default value
  ) {
    var randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < 10; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    var id = new Date().getTime() + result;
    var notification = {
      id: { userId: 0, id: id },
      message: message,
      seen: 0,
      logTime: this.getFormatedDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      link: link,
      userrole: userrole,
      category: category,
      mailReqd: mailReqd,
      pushNotification: pushReqd
    };
    this.post(
      'mainservice/framework/notification/open/save?userIds=' + userIds,
      notification
    ).subscribe((data: any) => {});
  }
  sendMail(
    recipientName: any,
    subject: any,
    message1: any,
    message2: any,
    toEmailId: any,
    ccEmailId: any,
    bccEmailId: any,
    link1: any,
    link2: any,
    link1Name: any,
    link2Name: any,
    senderEmailId: any
  ): void {
    //var mail = {arg1:recepientName,arg2:subject,arg3:message,arg4:toEmailId,arg5:ccEmailId,arg6:bccEmailId,arg7:link1,arg8:link2};
    var mail = {
      recipientName: recipientName,
      subject: subject,
      toEmailIds: toEmailId,
      ccEmailIds: ccEmailId,
      bccEmailIds: bccEmailId,
      message1: message1,
      message2: message2,
      link1: link1,
      link2: link2,
      link1Name: link1Name,
      link2Name: link2Name,
      senderEmailId: senderEmailId,
    };
    this.post(
      'mainservice/framework/generic/openresource/sendMail',
      mail
    ).subscribe((data: any) => {});
  }

  loadMyProfile(parentObj: any, callBackFunction: any): void {
    var url = 'mainservice/auth/myprofile';
    this.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        callBackFunction(data['dataObject'], parentObj);
      }
    });
  }
  encode(url: any): string {
    var temp = encodeURI(url);
    temp = temp.split('#').join('%23');
    return temp;
  }
  goTop(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  urlify(text: any, linkColor: any) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url: any) {
      return (
        '<a href="' +
        url +
        '" target="_new" style="color:' +
        linkColor +
        '">' +
        url +
        '</a>'
      );
    });
  }

  // when we want particular size of string and after that ...
  truncateString(inputString: string, maxLength: number): string {
    // console.log("Hi i am at truncateString")
    if (!inputString) return inputString;
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.substring(0, maxLength) + '...';
    }
  }

  getQuarterRange(year: any, quarter: any): any {
    var temp = [];
    var month = new Date().getMonth() + 1;
    var quarter = quarter;
    switch (quarter) {
      case 1:
        temp.push(year + '-01-01 00:00:00');
        temp.push(year + '-04-01 00:00:00');
        break;
      case 2:
        temp.push(year + '-04-01 00:00:00');
        temp.push(year + '-07-01 00:00:00');
        break;
      case 3:
        temp.push(year + '-07-01 00:00:00');
        temp.push(year + '-10-01 00:00:00');
        break;
      case 4:
        temp.push(year + '-10-01 00:00:00');
        year = year + 1;
        temp.push(year + '-01-01 00:00:00');
    }
    return temp;
  }
  generateRandomString(length: any): any {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  getDateXDaysAgo(numOfDays: any, date: any) {
    if (!date) return;
    const daysAgo = new Date(date.getTime());
    daysAgo.setDate(date.getDate() - numOfDays);
    return daysAgo;
  }
  getJsDateObject(dateString: any) {
    if (!dateString) return;
    var date = new Date();
    var temp = dateString.split(' ');
    var dateArr = temp[0].split('-');
    date.setFullYear(dateArr[0]);
    date.setMonth(parseInt(dateArr[1]) - 1);
    date.setDate(dateArr[2]);
    if (temp.length > 1) {
      var timeArr = temp[1].split(':');
      date.setHours(timeArr[0]);
      date.setMinutes(timeArr[1]);
      date.setSeconds(timeArr[2]);
    }
    return date;
  }
  compareDates(date1: Date, date2: Date) {
    if (date1.getTime() < date2.getTime()) return -1;
    if (date1.getTime() == date2.getTime()) return 0;
    if (date1.getTime() > date2.getTime()) return 1;
    return -2;
  }
  getStartingEndingDates(): any {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month == 12) {
      month = 0;
      year = year + 1;
    }
    var lastDay = new Date(year, month, 0);
    var arr = [];
    arr.push(firstDay);
    arr.push(lastDay);
    return arr;
  }


  getEmbedUrlYouTube(url: string): string {
    let videoId = '';
    let additionalParams = '';
  
    // Handle regular YouTube URLs
    if (url.includes('watch?v=')) {
      const parts = url.split('watch?v=');
      videoId = parts[1].split('&')[0];
      additionalParams = parts[1].split('&').slice(1).join('&');
    } 
    // Handle short YouTube URLs (e.g., youtu.be)
    else if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/');
      videoId = parts[1].split('?')[0];
      additionalParams = parts[1].split('?')[1] || '';
    } 
    // Handle YouTube Shorts URLs
    else if (url.includes('youtube.com/shorts/')) {
      const parts = url.split('/shorts/');
      videoId = parts[1].split('?')[0];
      additionalParams = parts[1].split('?')[1] || '';
    }
  
    // Construct the embed URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return additionalParams ? `${embedUrl}?${additionalParams}` : embedUrl;
  }

  getStartingEndingDatesOfMonthWithDate(date: Date): any {
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month == 12) {
      month = 0;
      year = year + 1;
    }
    var lastDay = new Date(year, month, 0);
    var arr = [];
    arr.push(firstDay);
    arr.push(lastDay);
    return arr;
  }

  getLastWeekDateRange(): any {
    var d = new Date();
    var to = d.setTime(
      d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000
    );
    var from = d.setTime(d.getTime() - 6 * 24 * 60 * 60 * 1000);
    var temp = [
      this.getFormatedDate(from, 'yyyy-MM-dd'),
      this.getFormatedDate(to, 'yyyy-MM-dd'),
    ];
    return temp;
  }

  getDaysBetween(fromDate: any, toDate: any): any {
    return Math.ceil(
      (toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)
    );
  }
  getMonthNameFromNumber(monthNum: any) {
    var arr = 'NA,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(',');
    return arr[monthNum];
  }
  navigateTo(url: string, queryParam: any): void {
    this.router.navigate([url], { queryParams: queryParam });

    if (this.router.url.split('?')[0] == url) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  public downloadAsPDF(content: any, count: any, cb: any, fileName: any) {
    //        this.generarPDF();
    var date = Math.random() * 100;
    let DATA: any = document.getElementById('printDiv');
    this.showProcessingIcon();
    html2canvas(DATA, { allowTaint: true }).then((canvas) => {
      try {
        let fileWidth = 210; //208
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png'); //('image/png');
        if (FILEURI.toString().length < 10 && count == 1) {
          count = count + 1;
          return this.downloadAsPDF(content, count, cb, fileName);
        }
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
        PDF.save(fileName + '-rspp.pdf');
        //document.getElementById('printDiv').innerHTML="";
        this.hideProcessingIcon();
        if (cb) cb();
      } catch (e) {
        this.showErrorMessage(
          'Error',
          "Couldn't show preview. Please try again."
        );
        this.hideProcessingIcon();
      }
    });
  }
  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  copyLink(val: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(val)
        .then(() => {
          this.showSuccessMessage('Copied',
            'Link copied to clipboard successfully!'
          )
          console.log('Text copied to clipboard successfully!');
        })
        .catch(err => {
          console.error('Failed to copy text to clipboard:', err);
        });
    } else {
      // Fallback for older browsers
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed'; // prevent scrolling to bottom
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      try {
        document.execCommand('copy');
        console.log('Text copied to clipboard successfully!');
      } catch (err) {
        console.error('Fallback: Failed to copy text to clipboard:', err);
      } finally {
        document.body.removeChild(selBox);
      }
    }
  }
  

  ageInMonths(dateInMysqlFormat: string): number {
    const birthDateObj = new Date(dateInMysqlFormat);
    const currentDate = new Date();
    // Calculate the difference in months
    const months =
      (currentDate.getFullYear() - birthDateObj.getFullYear()) * 12 +
      (currentDate.getMonth() - birthDateObj.getMonth());
    return months;
  }
  restrictToTwoDecimals(value: number): number {
    // Using toFixed to round to 2 decimal places
    const roundedValue = +value.toFixed(2);
    return roundedValue;
  }
  ceil(value: any): any {
    return Math.ceil(value);
  }
  getembedUrl(url: string): any {
    return url.split('watch?v=').join('embed/');
  }
  saveSocialPost(
    message: any,
    video: any,
    file: any,
    toUserId: any,
    postType: string,
    existingImgPath: any
  ): void {
    const formData: FormData = new FormData();
    if (message) {
      message = message.split('http').join(' http');
      var tokens = message.split(' ');
      for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].indexOf('youtube') > -1) {
          message = message.split(tokens[i]).join('');
          video = this.getembedUrl(tokens[i]);
        }
        //                else if (tokens[i].indexOf("http")>-1)
        //                {
        //                    message = message.split(tokens[i]).join("<a href='"+tokens[i]+"' target='new'>link</a>");
        //                }
      }
      formData.append('message', message);
    }
    if (video) formData.append('video', video);
    //if(this.post.id)
    //    formData.append('id', this.post.id);
    if (file) formData.append('image', file, file ? file.name : undefined);
    if (existingImgPath) formData.append('existingImgPath', existingImgPath);
    formData.append('createdById', this.user.id);
    formData.append('toUserId', toUserId);
    formData.append('postType', postType);

    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: localStorage.getItem('accesstoken') + '',
    });
    let options = { headers: headers };
    this.showProcessingIcon();
    this.post2(
      'mainservice/framework/socialPost/savePost',
      formData,
      options
    ).subscribe((data: any) => {
      this.hideProcessingIcon();
      if (data['result'] === 200) {
      }
    });
  }

  getLastMonthStartDate(): any {
    const currentDate = new Date();
    // Set the current date to the first day of the current month
    currentDate.setDate(1);
    // Subtract one day to get the last day of the previous month
    currentDate.setDate(currentDate.getDate() - 1);
    // Set the date to the first day of the previous month
    currentDate.setDate(1);
    return this.getFormatedDate(currentDate, this.mysqlFormat).split(' ')[0];
  }
  getCurrentMonthStartDate(): any {
    const currentDate = new Date();
    // Set the current date to the first day of the current month
    currentDate.setDate(1);
    return this.getFormatedDate(currentDate, this.mysqlFormat).split(' ')[0];
  }

  autoResizeTextArea(id: any) {
    setTimeout(() => {
      let textarea: any = '';
      textarea = document.getElementById(id);
      if (!textarea) {
        return;
      }
      textarea.style.height = 'auto'; // Reset height to auto to determine the actual height needed
      textarea.style.height = textarea.scrollHeight + 'px'; // Set height to the scrollHeight of the textarea
      textarea.style['overflow-y'] = 'hidden';
    }, 500);
  }

  // linkedIn
  redirectUrl: any;
  postTextStyle: any;
  sharedViaLinkedin(postText: string): void {
    localStorage.setItem('postString', postText);

    var linkedInCredentials = {
      clientId: '77iz34t71uso4r',
      //redirectUrl: this.commonService.uiPrefix.split("/#/")[0],
      redirectUrl: this.uiPrefix.split('/#/')[0].replace('/pieworksportal', ''),
      scope: 'openid profile email w_member_social', // r_basicprofile%20r_emailaddress%20w_member_social
    };

    localStorage.setItem('redirectUrl', window.location.href);

    window.location.href =
      'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=' +
      linkedInCredentials.clientId +
      '&scope=' +
      linkedInCredentials.scope +
      '&redirect_uri=' +
      linkedInCredentials.redirectUrl;
  }

  autoRedirect() {
    if (this.linkedInCode) {
      this.get(
        'mainservice/auth/verifyLinkedInCode?linkedInCode=' +
          this.linkedInCode +
          '&redirectUrl=' +
          this.uiPrefix.split('/#/')[0]
      ).subscribe((data: any) => {
        var user = data['dataObject']['dataObject'];
        var redirectUrl = localStorage.getItem('redirectUrl');
        if (redirectUrl) {
          this.navigateTo(redirectUrl.split('#')[1], undefined);
          localStorage.removeItem('redirectUrl');
          var postString = localStorage.getItem('postString');
          var postString1: any = postString?.toString();
          this.createPost(
            user.linkedInAccessToken,
            user.sub,
            postString1
          ).subscribe(
            (response: any) => {
              this.showSuccessMessage(
                'Post Successful',
                'Check Your LinkedIn :)'
              );
              localStorage.removeItem('postString');
              console.log('Post created successfully:', response);
            },
            (error: any) => {
              localStorage.removeItem('postString');
              console.error('Error creating post:', error);
            }
          );
        }
      });
    }
  }
  createPost(
    accessToken: string,
    personId: string,
    postText: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });

    const body = {
      author: `urn:li:person:${personId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: postText,
          },
          shareMediaCategory: 'NONE', // Adjust if you have media to share
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };
    return this.post(
      'mainservice/framework/socialPost/shareAsLinkedInPost?accessToken=' +
        accessToken,
      body
    );
  }
}
