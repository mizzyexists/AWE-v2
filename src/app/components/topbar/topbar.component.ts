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
  isLoggedIn: any;
  currentPage: any;
  authToken: any;
  jwtData: any;
  authUser: any;
  jwtUsername: any;
  authRequest: any = [];
  authData: any;

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private toastService: HotToastService,
    private router: Router,
    private authApi: AuthService,
  )
  {
    this.authApi.authenticateUser().subscribe(res => {
      this.isLoggedIn = res;
    }, err =>{
      this.isLoggedIn = err;
    });
  }

  ngOnInit() {
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
    if(!this.currentPage){
      console.log()
      if(window.location.pathname == "/"){
        this.currentPage = "Dashboard";
      }
      else{
      this.currentPage = window.location.pathname;
      }
    }
  }

  open(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }


  logout() {
    this.isLoggedIn = false;
    window.localStorage.removeItem('jwt');
    window.localStorage.removeItem('loggedUsername');
    this.toastService.warning('You have been logged out');
    setTimeout(() => window.location.href = './', 1500);
  }

}
