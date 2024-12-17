import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import {
  delay,
  mergeMap,
  materialize,
  dematerialize,
  map,
  catchError,
} from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { PieworksCommonService } from '../common/pieworkscommon.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private commonService: PieworksCommonService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //return type was Observable<HttpEvent<any>>
    var location = window.location.toString();
    // console.log('Outside if : ', request.url);
    if (
      location.indexOf('open') > -1 ||
      request.url.indexOf('login') > -1 ||
      request.url.indexOf('signup') > -1 ||
      request.url.indexOf('open') > -1 ||
      request.url.indexOf('create-account') > -1 ||
      request.url.indexOf('activation') > -1 ||
      request.url.indexOf('assets') > -1
    ) {
    } else {
      if (this.authService.isUserLoggedIn()) {
        var grandAccess = false;
        var role = localStorage.getItem('role'); //Talent/COMMUNITY MEMBER/Client
        // console.log('Role detected as ' + role);
        if (role == 'Talent') {
          if (location.indexOf('/talent/') > -1) {
            grandAccess = true;
          }
        } else if (role == 'Client') {
          if (location.indexOf('fw/client/') > -1 ||location.indexOf('recr/earn') > -1 || location.indexOf('recr/wp') > -1) {
            grandAccess = true;
          }
        } else if (role == 'COMMUNITY MEMBER') {
          //   console.log('inside CM ' + location);
          if (
            // location.indexOf('fw/client/') == -1 &&
            location.indexOf('/talent/') == -1
          ) {
            // alert(this.commonService.user.confirmedUser);
            if (
              this.commonService.user.confirmedUser == undefined ||
              this.commonService.user.confirmedUser == 1 ||
              location.indexOf('/pieBank') != -1 ||
              location.indexOf('/earn') != -1 || location.indexOf('/learn') != -1 ||
              location.indexOf('/my-course') != -1
            )
              grandAccess = true;
          }
        }
        //console.log('grant access value is ' + grandAccess);
        if (
          !grandAccess &&
          location.indexOf('/home') == -1 &&
          location.indexOf('/fw/user/') == -1
        ) {
          console.log('Access denied, redirecting to home page');
          this.commonService.navigateTo('/', undefined);
        }
      } else {
        this.authService.navigateToLogin();
        //return;
      }
    }
    //withCredentials as true is giving CORS error
    const clonedRequest = request.clone({ withCredentials: false });

    return next.handle(clonedRequest).pipe(
      map((event: HttpEvent<any>) => {
        // console.log('event--->>>', event);
        if (event instanceof HttpResponse) {
          /* const sessionValidity = event.headers.get('SessionValidity');
                    const heradeVal= event.headers.get('Access-Control-Allow-Credentials');
                    console.log('Session Validity--->>>'+sessionValidity + ' Hd:Access-Control-Allow-Credentials ='+event.body);
                    if (sessionValidity === 'invalid') {
                        console.log('Session Validity--->>>'+sessionValidity);
                    }
                    */
          if (event.body.result == 401) {
            this.authService.navigateToLogin();
          }
        }
        if (
          localStorage.getItem('release_date_new') &&
          localStorage.getItem('release_date') &&
          localStorage.getItem('release_date') !=
            localStorage.getItem('release_date_new')
        ) {
          if (localStorage.getItem('release_date_new'))
            localStorage.setItem(
              'release_date',
              localStorage.getItem('release_date_new') + ''
            );
          window.location.reload();
        }
        return event;
      }),

      catchError((err: HttpErrorResponse) => {
        this.commonService.hideProcessingIcon();

        if (err.status == 0)
          console.log('Web Service Error ' + JSON.stringify(err));
        return throwError(err);
      })
    );
  }
}
