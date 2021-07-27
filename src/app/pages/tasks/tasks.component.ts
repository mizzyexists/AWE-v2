import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  constructor(private titleService:Title) {
    this.titleService.setTitle("AWE v2 - Tasks");
  }

  ngOnInit(): void {
  }

}
