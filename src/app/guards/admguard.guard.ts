import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdmguardGuard implements CanActivate {
  isAllowed: any;
  userRole: any;
  authRequest: any = [];
  clientIPAddress = '';

  constructor(
    private authApi: AuthService,
    private toastService: HotToastService,
    private profileApi: ProfileService,
    private router: Router,
    private http:HttpClient
  ){}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Subject<any> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let subject = new Subject();
      this.authRequest[0] = window.localStorage.getItem('jwt');
      this.authRequest[1] = window.localStorage.getItem('loggedUsername');

      this.authApi.getMyRole(this.authRequest).subscribe(res => {
        this.userRole = res.role;
        if(this.userRole == 'admin' || this.userRole == 'super-admin'){
          subject.next(true);
        }else{
          this.toastService.error("You do not have permission to access that page.<br/><br/>Admins have been notified about this attempt.");
          var date = new Date().toLocaleString();
          this.http.get("https://api.ipify.org:443/?format=json").subscribe((res:any)=>{
            this.clientIPAddress = res.ip;
            this.profileApi.generateNotification(this.authRequest[0], this.authRequest[1], 'mizzy', '⚠️ Admin Access Attempted ⚠️', this.authRequest[1] + ' attempted to access the Admin Menu at ' + date + ', but is not an admin.<br/><br/>IP Address: '+this.clientIPAddress, '/');
            this.router.navigate(['/']);
            subject.next(false);
          }, err => {
            this.profileApi.generateNotification(this.authRequest[0], this.authRequest[1], 'mizzy', '⚠️ Admin Access Attempted ⚠️', this.authRequest[1] + ' attempted to access the Admin Menu at ' + date + ', but is not an admin.<br/><br/>IP Address: UNKNOWN', '/');
            this.router.navigate(['/']);
            subject.next(false);
          });
        }
      }, err => {
        console.log(err);
        subject.next(false);
      })
    return subject;
  }

}
