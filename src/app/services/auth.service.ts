import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from  'rxjs';
import { ServerInfo } from '../models/serverinfo';
import { HotToastService } from '@ngneat/hot-toast';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  serverInfo = ServerInfo;
  PHP_API_SERVER = this.serverInfo.rootURL;

  authToken: any;
  jwtData: any;
  authUser: any;
  jwtUsername: any;
  authData: any;
  isLoggedIn: any;

  constructor(
    private httpClient: HttpClient,
    private toastService: HotToastService,
  ){}
  register(userData: any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/auth/register.php`, userData);
  }
  login(loginData: any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/auth/login.php`, loginData);
  }
  authorize(authData: any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/auth/authorize.php`, authData);
  }

  getMyRole(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/auth/getLoggedRole.php`, profileRequestAuth);
  }

  authenticateUser(authRequest: any): Subject<any>{
    let subject = new Subject();
    // Check for token auth data
    if(authRequest[0] && authRequest[1]){
      // If logged in
      this.authorize(authRequest).subscribe(res => {
        if(res.code == 1 && res.tokenValidity == true && res.tokenPayload.status == 'active'){
          // Extract data from token
          this.jwtData = res.tokenPayload;
          this.jwtUsername = this.jwtData.username;
          this.isLoggedIn = true;
          subject.next(this.isLoggedIn);
        }
        else{
          // Failed validity check
          window.localStorage.removeItem('jwt');
          window.localStorage.removeItem('loggedUsername');
          this.toastService.error(res.message);
          this.isLoggedIn = false;
          subject.next(this.isLoggedIn);
        }
      }, err => {
        // Catch unknown errors
        window.localStorage.removeItem('jwt');
        window.localStorage.removeItem('loggedUsername');
        this.toastService.error('An unknown error occured.');
        this.isLoggedIn = false;
        subject.next(this.isLoggedIn);
      });
    }
    else{
      // If not logged in
      this.authorize(null).subscribe(_res => {
        this.isLoggedIn = false;
        subject.next(this.isLoggedIn);
      }, err => {
        // Catch unknown errors
        this.toastService.error("Unknown Error: "+ err);
        this.isLoggedIn = false;
        subject.next(this.isLoggedIn);
      });
    }
    return subject;
  }
}
