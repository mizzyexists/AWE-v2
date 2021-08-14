import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from  'rxjs';
import { ServerInfo } from '../models/serverinfo';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  serverInfo = ServerInfo;
  PHP_API_SERVER = this.serverInfo.rootURL;

  constructor(
    private httpClient: HttpClient,
  ){}

  getAppSettings(): Observable<any>{
    return this.httpClient.get<any>(`${this.PHP_API_SERVER}/application/getAppSettings.php`);
  }

  updateAppSettings(settingsAuthData:any): Observable<any>{
    return this.httpClient.put<any>(`${this.PHP_API_SERVER}/application/updateAppSettings.php`, settingsAuthData);
  }

  getActiveAlerts(): Observable<any>{
    return this.httpClient.get<any>(`${this.PHP_API_SERVER}/application/getActiveAlerts.php`);
  }

  addAlert(alertAuthData:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/application/addAlert.php`, alertAuthData);
  }

  editAlert(alertAuthData:any): Observable<any>{
    return this.httpClient.put<any>(`${this.PHP_API_SERVER}/application/editAlert.php`, alertAuthData);
  }

  removeAlert(alertAuthData:any): Observable<any>{
    return this.httpClient.delete<any>(`${this.PHP_API_SERVER}/application/removeAlert.php`, alertAuthData);
  }

}
