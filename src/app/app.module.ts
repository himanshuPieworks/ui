import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

// Page Route
import { AppRoutingModule } from './app-routing.module';
import { LayoutsModule } from './layouts/layouts.module'; 
import { ToastrModule } from 'ngx-toastr';

// Laguage
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// component
import { AppComponent } from './app.component';
import { AuthlayoutComponent } from './authlayout/authlayout.component';
import { AuthInterceptor } from './interceptor/AuthInterceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  BaseLoginProvider
} from '@abacritt/angularx-social-login';
import { ServiceWorkerModule } from '@angular/service-worker';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
} 

@NgModule({
  declarations: [
    AppComponent,
    AuthlayoutComponent,
  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutsModule,
    ToastrModule.forRoot(),
    TabsModule.forRoot(),
    SocialLoginModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
providers: [
  DatePipe,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '481154554495-ngjslk2vn9bg50tbc4peb5nr4nogl1qm.apps.googleusercontent.com', {oneTapEnabled:false, prompt:'consent'}
            )
          },
//          {
//            id: FacebookLoginProvider.PROVIDER_ID,
//            provider: new FacebookLoginProvider('clientId')
//          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
    ,
    {
     provide: HTTP_INTERCEPTORS,
     useClass: AuthInterceptor,
     multi : true    
     }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
