import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from  'rxjs';
import { ServerInfo } from '../models/serverinfo';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  serverInfo = ServerInfo;
  PHP_API_SERVER = this.serverInfo.rootURL;

  constructor(
    private httpClient: HttpClient,
  ){}

  getMyProfile(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/profile/getLoggedProfile.php`, profileRequestAuth);
  }

  getMyPic(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/profile/getLoggedProfileImage.php`, profileRequestAuth);
  }

  editMyProfile(profileData: any): Observable<any>{
    return this.httpClient.put<any>(`${this.PHP_API_SERVER}/profile/editLoggedProfile.php`, profileData);
  }
}
