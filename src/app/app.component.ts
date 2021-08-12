import { Component, OnInit } from '@angular/core';
import { faBars, faChalkboard, faStickyNote, faProjectDiagram, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { HotToastService } from '@ngneat/hot-toast';
import { fromEvent, Observable, Subscription } from "rxjs";
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  faBars = faBars;
  faChalkboard = faChalkboard;
  faStickyNote = faStickyNote;
  faUserFriends = faUserFriends;
  faProjectDiagram = faProjectDiagram;
  sidebarCollapsed = false;
  logoCollapsed = false;
  showFullLink = true;
  sidebarStatus = "";
  authRequest: any = [];
  logoStatus = "";
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  isLoggedIn: any;

  constructor(
    private authApi: AuthService,
    private toastService: HotToastService
    ) {
      this.authRequest[0] = window.localStorage.getItem('jwt');
      this.authRequest[1] = window.localStorage.getItem('loggedUsername');
      this.authApi.authenticateUser(this.authRequest).subscribe(res => {
        this.isLoggedIn = res;
      }, err =>{
        this.toastService.error("AUTH ERROR: "+err);
      });
    if (document.body.offsetWidth <= 720 && this.sidebarCollapsed == false) {
      this.toggleSidebar()
    }
    if(window.localStorage.getItem('minisb') == 'true'){
      this.sidebarCollapsed = true;
      this.logoCollapsed = true;
      this.showFullLink = false;
      this.sidebarStatus = "sb-mini";
      this.logoStatus = "invis";
    }
    else{
      this.sidebarStatus = "";
      this.logoCollapsed = false;
      this.sidebarCollapsed = false;
      this.logoStatus = "";
      this.showFullLink = true;
    }
  }

  ngOnInit(){
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe( _evt => {
      if (document.body.offsetWidth <= 720 && this.sidebarCollapsed == false) {
        this.toggleSidebar()
      }
    })
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
}
  toggleSidebar(){
    if(this.sidebarCollapsed == true){
      this.sidebarStatus = "";
      this.logoCollapsed = false;
      setTimeout(() =>   this.sidebarCollapsed = false, 300);
      setTimeout(() => this.logoStatus = "", 100);
      setTimeout(() => this.showFullLink = true, 350);
      window.localStorage.setItem('minisb', 'false');
    }
    else{
      this.sidebarCollapsed = true;
      this.logoCollapsed = true;
      this.showFullLink = false;
      this.sidebarStatus = "sb-mini";
      this.logoStatus = "invis";
      window.localStorage.setItem('minisb', 'true');
    }
  }

}
