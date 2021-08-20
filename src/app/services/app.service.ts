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

}
