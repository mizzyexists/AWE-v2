import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from  'rxjs';
import { ServerInfo } from '../models/serverinfo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  serverInfo = ServerInfo;
  PHP_API_SERVER = this.serverInfo.rootURL;
  constructor(
    private httpClient: HttpClient,
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
  
}
