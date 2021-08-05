import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, Subject } from  'rxjs';
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
  authRequest: any = [];
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

  authenticateUser(): Subject<any>{
    let subject = new Subject();
    this.authRequest[0] = window.localStorage.getItem('jwt');
    this.authRequest[1] = window.localStorage.getItem('loggedUsername');
    if(this.authRequest[0] && this.authRequest[1]){
      this.authorize(this.authRequest).subscribe(res => {
        if(res.code == 1 && res.tokenValidity == true){
          this.jwtData = res.tokenPayload;
          this.jwtUsername = this.jwtData.username;
          this.isLoggedIn = true;
          subject.next(this.isLoggedIn);
        }
        else{
          this.toastService.error(res.message);
        }
      }, err => {
        this.toastService.error(err.statusText);
        this.isLoggedIn = false;
        subject.next(this.isLoggedIn);
      });
    }
    else{
      this.isLoggedIn = false;
      subject.next(this.isLoggedIn);
    }
    return subject;
  }
}
