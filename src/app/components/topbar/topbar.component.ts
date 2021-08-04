import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {filter} from 'rxjs/operators';
import {map, mergeMap} from 'rxjs/internal/operators';
import { AuthService } from 'src/app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  faChevronDown = faChevronDown;
  isLoggedIn: any = false;
  currentPage: any;
  authToken: any;
  jwtData: any;
  authCheck: any;
  authUser: any;
  jwtUsername: any;
  authRequest: any;
  authData: any;

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private toastService: HotToastService,
    private router: Router,
    private authApi: AuthService
  )
  {  }

  ngOnInit() {
    this.checkLoggedUser();
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
      mergeMap(route => route.data)
    )
    .subscribe(data => {
      this.currentPage = data;
      this.currentPage = this.currentPage.title;
    });
  }

  open(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  checkLoggedUser(){
    this.authToken = window.localStorage.getItem('jwt');
    this.authUser = window.localStorage.getItem('loggedUsername');
    this.authRequest = [this.authToken, this.authUser];
    if(this.authToken && this.authUser){
      this.authApi.authorize(this.authRequest).subscribe(res => {
        this.authData = res;
        if(this.authData.code == 1 && this.authData.tokenValidity == true){
          this.jwtData = this.authData.tokenPayload;
          this.jwtUsername = this.jwtData.username;
          this.isLoggedIn = true;
        }
        else{
          this.toastService.error(this.authData.message);
        }
      }, error => {
        this.toastService.error(error.statusText);
        console.log(this.authRequest);
      });
    }
    else{
      this.isLoggedIn = false;
    }
  }

  logout() {
    this.isLoggedIn = false;
    window.localStorage.removeItem('jwt');
    window.localStorage.removeItem('loggedUsername');
    this.toastService.warning('You have been logged out');
    setTimeout(() => window.location.href = './', 1500);
  }

}
