import {Component, Input, OnInit} from '@angular/core';
import {Verse} from '../../../services/songs.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements OnInit {

  @Input('verse') verse: Verse;

  constructor() {}

  ngOnInit() {
    console.log(this.verse);
  }

}
