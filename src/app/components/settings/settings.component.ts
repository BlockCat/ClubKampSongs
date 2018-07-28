import { Component, OnInit } from '@angular/core';
import {screen, shell } from 'electron';
import Display = Electron.Display;
import {SongsService} from '../../services/songs.service';
import {ListsService} from '../../services/lists.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  displays: Display[];
  selected: number;

  public mainSlideText: string;
  public mainSlideSubtext: string;

  constructor(private songService: SongsService, private listService: ListsService) { }

  ngOnInit() {
    this.displays = screen.getAllDisplays();
    this.displays.sort((a, b) => a.bounds.x - b.bounds.x);
    this.selected = +localStorage.getItem('display-select') || 0;
    this.mainSlideText = localStorage.getItem('main-slide-text') || 'Clubkamp 2018';
    this.mainSlideSubtext = localStorage.getItem('main-slide-subtext') || 'Welkom';
  }

  selectItem(selected: number) {
    this.selected = selected;
    localStorage.setItem('display-select', `${selected}`);
  }

  setMainSlideText(text: string) {
    this.mainSlideText = text;
    localStorage.setItem('main-slide-text', text);
  }

  setMainSlideSubtext(text: string) {
    this.mainSlideSubtext = text;
    localStorage.setItem('main-slide-subtext', text);
  }

  openListFolder() {
    shell.showItemInFolder(this.listService.path + '/');
  }

  openSongsFolder() {
    shell.showItemInFolder(this.songService.path + '/');
  }

}
