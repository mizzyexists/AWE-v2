import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faBell, faChevronDown, faInfo } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {filter} from 'rxjs/operators';
import {map, mergeMap} from 'rxjs/internal/operators';
import { AuthService } from 'src/app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ProfileService } from '../../services/profile.service';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  faChevronDown = faChevronDown;
  faInfo = faInfo;
  isLoggedIn: any;
  currentPage: any;
  authUser: any;
  authRequest: any = [];
  profilePic: any;
  userRole: any;
  maintenanceMode: any;

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private toastService: HotToastService,
    private router: Router,
    private authApi: AuthService,
    private profileApi: ProfileService,
    private appApi: AppService
  )
  {
    // Authenticate logged in user
    this.authRequest[0] = window.localStorage.getItem('jwt');
    this.authRequest[1] = window.localStorage.getItem('loggedUsername');
    this.authApi.authenticateUser(this.authRequest).subscribe(res => {
      this.isLoggedIn = res;
    }, err =>{
      this.isLoggedIn = err;
    });

    // Get user avatar
    this.profileApi.getMyPic(this.authRequest).subscribe(res => {
      this.profilePic = res.image;
    }, err => {
      this.toastService.error("Unknown Error: "+ err);
    });

    // Get user permissions role
    this.authApi.getMyRole(this.authRequest).subscribe(res => {
      this.userRole = res.role;
    }, err => {
      this.toastService.error("Unknown Error: "+ err);
    });

    // Get title of navigated page for top bar
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd),
      map(() => {
        let route: any = this.activatedRoute.firstChild;
        let child = route;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
            route = child;
          } else {
            child = null;
          }
        }
        return route;
      }),
      mergeMap(route => route.data),
    )
    .subscribe(data => {
      this.currentPage = data;
      this.currentPage = this.currentPage.title;
    })

    // Fallback for navigated page title if browser is refreshed
    if(!this.currentPage){
      this.authRequest = window.localStorage.getItem('jwt');
      if(window.location.pathname == "/" && this.authRequest){
        this.currentPage = "Dashboard";
      }
      else if(window.location.pathname == "/" && !this.authRequest){
        this.currentPage = "Angular Web Engine";
      }
      else{
      this.currentPage = window.location.pathname;
      }
    }

    // Check if Maintenance Mode is active
    this.appApi.getAppSettings().subscribe(res => {
      this.maintenanceMode = res[0]['setting_value'];
    }, (err: any) =>{
      console.log(err);
    });
  }

  ngOnInit() {

  }

  // Modal service
  open(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // Logout user and delete authentication token data
  logout() {
    this.isLoggedIn = false;
    window.localStorage.removeItem('jwt');
    window.localStorage.removeItem('loggedUsername');
    this.toastService.warning('You have been logged out');
    setTimeout(() => window.location.href = './', 1500);
  }

}
