import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) 
    {
        if(state.url.toString().indexOf("open")>-1)
            return true;
        if(localStorage.getItem('userId')||localStorage.getItem('usersname')) {
                return true;
            }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login'], { queryParamsHandling: 'preserve' });
        return false;
    }
}
