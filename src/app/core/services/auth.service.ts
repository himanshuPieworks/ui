import { Injectable } from '@angular/core';
import { getFirebaseBackend } from '../../authUtils';
import { User } from '../models/auth.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalComponent } from "../../global-component";
import * as CryptoJS from 'crypto-js';
import { PieworksCommonService } from '../../common/pieworkscommon.service';

const AUTH_API = GlobalComponent.AUTH_API;

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  

@Injectable({ providedIn: 'root' })

/**
 * Auth-service Component
 */
export class AuthenticationService {

    user!: User;
    currentUserValue: any;

    private currentUserSubject: BehaviorSubject<User>;
    // public currentUser: Observable<User>;

    constructor(private http: HttpClient,private commonService: PieworksCommonService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
        // this.currentUser = this.currentUserSubject.asObservable();
     }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, first_name: string, password: string) {        
        // return getFirebaseBackend()!.registerUser(email, password).then((response: any) => {
        //     const user = response;
        //     return user;
        // });

        // Register Api
        return this.http.post(AUTH_API + 'signup', {
            email,
            first_name,
            password,
          }, httpOptions);
    }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(login:any,cb:any):any {
        //let login:any={};
        login["userrole"]=localStorage.getItem("role");
        if(!login["userrole"])
            login["userrole"] = "COMMUNITY MEMBER";
        //validate credentials and if success proceed to home page
        if(!login["tokenid"] && !login["linkedInCode"])
        {
            login.username = login.username.trim();
            login.password = CryptoJS.AES.encrypt(login.password, login.username).toString();  
        }
        this.commonService.showProcessingIcon();
        this.commonService.post("mainservice/auth/login",login).subscribe((data:any) => 
        {
            this.commonService.hideProcessingIcon();
            cb(data);
        })
        /*
        return this.http.post(AUTH_API + 'signin', {
            email,
            password
          }, httpOptions);
        */
    }

    /**
     * Returns the current user
     */
    public currentUser(): any {
        return getFirebaseBackend()!.getAuthenticatedUser();
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        // return getFirebaseBackend()!.logout();
       this.commonService.logout();
        this.currentUserSubject.next(null!);
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend()!.forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

}

