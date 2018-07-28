import {Component, Input, OnInit} from '@angular/core';
import {Song, SongsService} from '../../../services/songs.service';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss']
})
export class FilterListComponent implements OnInit {

  @Input('onSongClick') onSongClick: (song: Song) => any;

  public focused = false;
  private filter = '';

  constructor(private songService: SongsService) { }

  ngOnInit() {
  }


  SearchData(value: string) {
    this.filter = value;
  }

  getFilteredSongs(): Song[] {
    if (this.filter.length >= 1) {
      return this.songService.songs.filter(x => x.title.toLowerCase().startsWith(this.filter.toLowerCase()));
    } else {
      return this.songService.songs;
    }
  }

}
