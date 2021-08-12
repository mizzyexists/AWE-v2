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

  authenticateUser(authRequest: any): Subject<any>{
    let subject = new Subject();
    if(authRequest[0] && authRequest[1]){
      this.authorize(authRequest).subscribe(res => {
        if(res.code == 1 && res.tokenValidity == true){
          this.jwtData = res.tokenPayload;
          this.jwtUsername = this.jwtData.username;
          this.isLoggedIn = true;
          subject.next(this.isLoggedIn);
        }
        else{
          window.localStorage.removeItem('jwt');
          window.localStorage.removeItem('loggedUsername');
          this.toastService.error(res.message);
          this.isLoggedIn = false;
          subject.next(this.isLoggedIn);
        }
      }, err => {
        window.localStorage.removeItem('jwt');
        window.localStorage.removeItem('loggedUsername');
        this.toastService.error(err.statusText);
        this.isLoggedIn = false;
        subject.next(this.isLoggedIn);
      });
    }
    else{
      this.authorize(null).subscribe(_res => {
        // this.toastService.error(res.message);
        this.isLoggedIn = false;
        subject.next(this.isLoggedIn);
      }, err => {
        this.toastService.error("Unknown Error: "+ err);
        this.isLoggedIn = false;
        subject.next(this.isLoggedIn);
      });
    }
    return subject;
  }
}
