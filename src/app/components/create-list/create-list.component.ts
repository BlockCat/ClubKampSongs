import {Component, Input, OnInit} from '@angular/core';
import {Song, SongsService} from '../../services/songs.service';
import {faAngleDown, faAngleUp, faCrow, faTrash} from '@fortawesome/free-solid-svg-icons';
import {List, ListsService} from '../../services/lists.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss']
})
export class CreateListComponent implements OnInit {

  faUp = faAngleUp;
  faDown = faAngleDown;
  faRemove = faTrash;

  previousList: List;

  listName: string;

  songs: Song[];
  selectedSongs: Song[] = [];
  date: Date = null;

  constructor(private songService: SongsService, private listService: ListsService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      const name: string = params['name'];
      const list = this.listService.find(name, params['date']);

      if (list !== null) {
        this.listName = list.name;
        this.date = list.date;
        this.selectedSongs = list.songs;
      }

    });

    this.songs = this.songService.songs;
    this.songs.sort((a, b) => {
      const _a = a.title.toLowerCase();
      const _b = b.title.toLowerCase();
      if (_a > _b) {
        return 1;
      }
      if (_a < _b) {
        return -1;
      }
      return 0;
    });
  }

  saveList() {

    if (this.date === null || this.date === undefined) {
      this.date = new Date();
    }
    const filePath = `${__dirname}/KerKampLists/${this.listName}-${this.date.getTime()}`;
    const list = new List(filePath, this.listName, this.date);
    list.songs = this.selectedSongs;

    this.listService.saveList(list);
  }

  toRight(song: Song) {
    this.selectedSongs.push(song);
  }

  remove(index: number) {
    this.selectedSongs.splice(index, 1);
  }

  up(index: number) {
    if (index > 0) {
      const clickedSong = this.selectedSongs[index];
      const upperSong = this.selectedSongs[index - 1];
      this.selectedSongs[index - 1] = clickedSong;
      this.selectedSongs[index] = upperSong;
    }
  }

  down(index: number) {
    if (index < this.selectedSongs.length - 1) {
      const clickedSong = this.selectedSongs[index];
      const underSong = this.selectedSongs[index + 1];
      this.selectedSongs[index + 1] = clickedSong;
      this.selectedSongs[index] = underSong;
    }
  }
}
