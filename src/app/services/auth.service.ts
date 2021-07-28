import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from  'rxjs';
import { UserData } from '../models/userdata';
import { ServerInfo } from '../models/serverinfo';
import { AuthData } from '../models/authdata';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  serverInfo = ServerInfo;
  PHP_API_SERVER = this.serverInfo.rootURL;
  constructor(
    private httpClient: HttpClient,
  ){}
  register(userData: UserData): Observable<UserData>{
    return this.httpClient.post<UserData>(`${this.PHP_API_SERVER}/auth/register.php`, userData);
  }
  login(loginData: any): Observable<UserData>{
    return this.httpClient.post<UserData>(`${this.PHP_API_SERVER}/auth/login.php`, loginData);
  }
  authorize(authData: any): Observable<AuthData>{
    return this.httpClient.post<AuthData>(`${this.PHP_API_SERVER}/auth/authorize.php`, authData);
  }
}
