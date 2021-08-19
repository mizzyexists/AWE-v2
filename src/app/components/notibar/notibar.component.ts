import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { faBell } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notibar',
  templateUrl: './notibar.component.html',
  styleUrls: ['./notibar.component.scss']
})
export class NotibarComponent implements OnInit {
  notiCount: any;
  notifications: any;
  faBell = faBell;
  notiRes: any = [];
  authRequest: any = [];
  isRead: any;
  notiIndex: any;
  constructor(
    private profileApi: ProfileService,
    private toastService: HotToastService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authRequest[0] = window.localStorage.getItem('jwt');
    this.authRequest[1] = window.localStorage.getItem('loggedUsername');
    this.profileApi.getMyNotis(this.authRequest).subscribe(res => {
      this.notiRes = res;
      if(this.notiRes.code == 1){
        this.notifications = this.notiRes.notifications;
        this.notiCount = this.notiRes.unread;
        if(this.notiCount > 99){
          this.notiCount = 99;
        }
      }
      else{
        this.toastService.error(this.notiRes.message);
      }
    }, err => {
      this.toastService.error("Unknown Error: "+ err);
    })
  }

  // Clear all notifications
  clearNotis(){
    if(this.notiCount > 0){
      for(let notification of this.notifications){
        this.notiIndex = this.notifications.findIndex(((noti: { noti_id: any; }) => noti.noti_id == notification.noti_id));
        this.notifications[this.notiIndex].readbyuser = 'true';
      }
      this.notiCount = 0;
      this.profileApi.clearNotis(this.authRequest).subscribe();
    }
  }

  // Navigate to page with passed slug
  navigateNoti(noti_id:any, slug: any){
    if(slug != ''){
      this.notiIndex = this.notifications.findIndex(((noti: { noti_id: any; }) => noti.noti_id == noti_id));
      if(this.notifications[this.notiIndex].readbyuser == 'false'){
        this.notifications[this.notiIndex].readbyuser = 'true';
        if(this.notiCount > 0){
          this.notiCount = this.notiCount - 1;
          this.authRequest[2] = this.notifications[this.notiIndex].noti_id;
          this.profileApi.ackNoti(this.authRequest).subscribe();
        }
      }
      this.router.navigate([slug]);
    }
    else{
      this.notiIndex = this.notifications.findIndex(((noti: { noti_id: any; }) => noti.noti_id == noti_id));
      if(this.notifications[this.notiIndex].readbyuser == 'false'){
        this.notifications[this.notiIndex].readbyuser = 'true';
        if(this.notiCount > 0){
          this.notiCount = this.notiCount - 1;
          this.authRequest[2] = this.notifications[this.notiIndex].noti_id;
          this.profileApi.ackNoti(this.authRequest).subscribe();
        }
      }
    }
  }

}
