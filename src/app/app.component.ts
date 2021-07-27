import { Component, OnInit } from '@angular/core';
import { faBars, faChalkboard, faStickyNote, faProjectDiagram, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { fromEvent, Observable, Subscription } from "rxjs";
import { Title } from "@angular/platform-browser";

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
  logoStatus = "";
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  constructor() {
    if (document.body.offsetWidth <= 720 && this.sidebarCollapsed == false) {
      this.toggleSidebar()
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
    this.resizeSubscription$.unsubscribe()
}
  toggleSidebar(){
    if(this.sidebarCollapsed == true){
      this.sidebarStatus = "";
      this.logoCollapsed = false;
      setTimeout(() =>   this.sidebarCollapsed = false, 300);
      setTimeout(() => this.logoStatus = "", 100);
      setTimeout(() => this.showFullLink = true, 350);
    }
    else{
      this.sidebarCollapsed = true;
      this.logoCollapsed = true;
      this.showFullLink = false;
      this.sidebarStatus = "sb-mini";
      this.logoStatus = "invis";
    }
  }
}
