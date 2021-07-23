import { Component, OnInit } from '@angular/core';
import { faBars, faChalkboard, faStickyNote } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  faBars = faBars;
  faChalkboard = faChalkboard;
  faStickyNote = faStickyNote;
  sidebarCollapsed = false;
  sidebarStatus = "";
  logoStatus = "";
  constructor(){
  }

  ngOnInit(){
  }

  toggleSidebar(){
    if(this.sidebarCollapsed == true){
      this.sidebarCollapsed = false;
      this.sidebarStatus = "";
      setTimeout(() => this.logoStatus = "", 200);
    }
    else{
      this.sidebarCollapsed = true;
      this.sidebarStatus = "sb-mini";
      this.logoStatus = "invis";
    }
  }
}
