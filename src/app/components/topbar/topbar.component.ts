import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {filter} from 'rxjs/operators';
import {map, mergeMap} from 'rxjs/internal/operators';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  faChevronDown = faChevronDown;
  isLoggedIn = true;
  currentPage: any;

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router
  )
  { }

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
  }

  open(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
