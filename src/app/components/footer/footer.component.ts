import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  versionNumber: any = "2.1.0";
  constructor() { }

  ngOnInit(): void {
  }

}
