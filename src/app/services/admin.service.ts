import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from  'rxjs';
import { ServerInfo } from '../models/serverinfo';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  serverInfo = ServerInfo;
  PHP_API_SERVER = this.serverInfo.rootURL;

  constructor(
    private httpClient: HttpClient,
  ) { }

  adminCreateNotification(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/admin/createNotification.php`, profileRequestAuth);
  }

  adminCreateUser(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/admin/adminCreateUser.php`, profileRequestAuth);
  }

  adminPromoteUser(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/admin/adminPromoteUser.php`, profileRequestAuth);
  }

  adminDemoteUser(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/admin/adminDemoteUser.php`, profileRequestAuth);
  }

  adminGetActiveAlerts(): Observable<any>{
    return this.httpClient.get<any>(`${this.PHP_API_SERVER}/application/getActiveAlerts.php`);
  }

  adminCreateAlert(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/application/addAlert.php`, profileRequestAuth);
  }

  adminEditAlert(alertAuthData:any): Observable<any>{
    return this.httpClient.put<any>(`${this.PHP_API_SERVER}/application/editAlert.php`, alertAuthData);
  }

  adminRemoveAlert(alertAuthData:any): Observable<any>{
    return this.httpClient.put<any>(`${this.PHP_API_SERVER}/application/deleteAlert.php`, alertAuthData);
  }

  adminUpdateAppSettings(settingsAuthData:any): Observable<any>{
    return this.httpClient.put<any>(`${this.PHP_API_SERVER}/application/updateAppSettings.php`, settingsAuthData);
  }

}
