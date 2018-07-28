import { Component, OnInit } from '@angular/core';
import {NbMenuItem} from '@nebular/theme';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent implements OnInit {


  menuItem: NbMenuItem[] = [
    {
      title: 'Home',
      link: '/'
    },
    {
      title: 'Songs',
      link: '/songs'
    },
    {
      title: 'Lists',
      link: '/list'
    },
    {
      title: 'Settings',
      link: '/settings'
    },
  ];

  constructor() { }
  ngOnInit() {
  }

}
