import { Component, OnInit } from '@angular/core';
import {Song, SongsService} from '../../services/songs.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  public songs: Song[];

  constructor(private songService: SongsService) {
    this.songs = this.songService.songs;
  }

  ngOnInit() {
  }

  reloadSongs() {
    this.songs = this.songService.reloadSongs();
  }
}
