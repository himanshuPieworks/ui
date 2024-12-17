import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PieworksCommonService } from '../common/pieworkscommon.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
  loginErrorMsg = 'Error! Please Try Later';
    
  constructor(private commonService: PieworksCommonService, private router: Router) {
    
    }

   isUserLoggedIn() {
    let user = localStorage.getItem('usersname');
    return !(user === null);
   }	

    logout() {
        this.commonService.logout();
    }

    navigateToLogin() {   
      this.commonService.clearLocalStorage();
      this.commonService.navigateTo("/auth/login",undefined);
    }

}  