import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  constructor(private titleService:Title) {
    this.titleService.setTitle("AWE v2 - Clients");
  }

  ngOnInit(): void {
  }

}
