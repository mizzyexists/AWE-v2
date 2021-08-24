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
  notificationRequest: any;
  authRequest: any = [];
  authNotificationRequest: any = [];
  constructor(
    private httpClient: HttpClient,
  ){}

  getMyProfile(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/profile/getLoggedProfile.php`, profileRequestAuth);
  }

  getMyPic(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/profile/getLoggedProfileImage.php`, profileRequestAuth);
  }

  uploadAvatar(avatar: any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/profile/uploadAvatar.php`, avatar);
  }

  setAvatar(authAvatarData: any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/profile/setUserAvatar.php`, authAvatarData);
  }

  editMyProfile(profileData: any): Observable<any>{
    return this.httpClient.put<any>(`${this.PHP_API_SERVER}/profile/editLoggedProfile.php`, profileData);
  }

  getMyNotis(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/profile/getNotifications.php`, profileRequestAuth);
  }

  ackNoti(profileRequestAuth:any): Observable<any>{
    return this.httpClient.put<any>(`${this.PHP_API_SERVER}/profile/acknowledgeNotification.php`, profileRequestAuth);
  }

  clearNotis(profileRequestAuth:any): Observable<any>{
    return this.httpClient.put<any>(`${this.PHP_API_SERVER}/profile/clearNotifications.php`, profileRequestAuth);
  }

  deleteNotis(profileRequestAuth:any): Observable<any>{
    return this.httpClient.put<any>(`${this.PHP_API_SERVER}/profile/deleteNotifications.php`, profileRequestAuth);
  }

  createNoti(profileRequestAuth:any): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}/profile/createNotification.php`, profileRequestAuth);
  }

  generateNotification(requester_token: any, requester_username: any, target: any, title: any, message: any, slug: any): Subject<any>{
    this.authRequest[0] = requester_token;
    this.authRequest[1] = requester_username;
    let subject = new Subject();
    this.notificationRequest = {
      target: target,
      title: title,
      message: message,
      slug: slug
    };
    if(this.notificationRequest.message != ''){
      this.authNotificationRequest = [this.authRequest, this.notificationRequest];
      this.createNoti(this.authNotificationRequest).subscribe(res => {
        if(res.code == 1){
          subject.next(console.log(res.message));
        }
        else{
          subject.next(console.log(res.message));
        }
      });
    }else{
      subject.next(console.log("No notification body"));
    }
    return subject;
  }
}
