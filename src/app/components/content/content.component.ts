import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  host: { class: 'col-md-9 ml-sm-auto col-lg-10 pt-3 px-4', role: 'main' },
})
export class ContentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
