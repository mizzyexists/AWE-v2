import { Component, OnInit } from '@angular/core';
import { faGithub, faGitlab, faTwitter } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  faTwitter = faTwitter;
  faGithub = faGithub;
  faGitlab = faGitlab;
  
  constructor() { }

  ngOnInit(): void {
  }

}
