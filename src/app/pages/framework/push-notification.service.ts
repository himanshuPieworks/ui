import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  // Replace with your own VAPID public key

  readonly VAPID_PUBLIC_KEY =
    'BJYMVLVeuFJ05px_tJ08f4DjtST9IqWfW2ZfCd_bD54Z3bBCKgYNVCzMuJpKyZtuXdCrVH0Nshev5YUT2m993UI';

  constructor(private swPush: SwPush, private http: HttpClient,public commonService: PieworksCommonService,) {}

  /**
   * Request subscription to push notifications.
   */
  subscribeToNotifications(): Observable<any> {
    return new Observable((observer) => {
      this.swPush
        .requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY,
        })
        .then((subscription) => {
          // Send the subscription object to the backend to store it
          console.log('This is the Subscription :',subscription)
          this.sendSubscriptionToBackend(subscription).subscribe({
            next: (response) => {
              console.log('This is the notification Response :',response)
              observer.next(response);
            },
            error: (error) => {
              observer.error(error);
            },
          });
        })
        .catch(err => {
          console.error('Subscription error:', err);
          observer.error(err);
        });
    });
  }

  /**
   * Send the push subscription object to the backend server
   * to save it for future notifications.
   */
  private sendSubscriptionToBackend(
    subscription: PushSubscription
  ): Observable<any> {
    // Replace with your actual backend URL for storing subscriptions mainservice/framework/notification
    const backendUrl = 'mainservice/framework/notification/pushnotification/subscribe';

    return this.commonService.post(backendUrl, subscription);
    
  }
}
