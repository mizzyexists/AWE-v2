import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent implements OnInit {

  versionNumber: any = "2.3.3";

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  open(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }


}
