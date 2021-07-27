import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private titleService:Title,
    private toastService: HotToastService
    )
  {
    this.titleService.setTitle("AWE v2 - Dashboard");
  }

  ngOnInit(): void {
  }

  testToast(){
    this.toastService.info('Hello World!');  
  }
}
