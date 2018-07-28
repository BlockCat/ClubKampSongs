import {Component, ElementRef, isDevMode, NgZone, OnInit, ViewChild} from '@angular/core';
import {screen, BrowserWindow, remote, shell} from 'electron';
import Display = Electron.Display;
import {List, ListsService} from '../../services/lists.service';
import * as url from 'url';
import {Song, SongsService} from '../../services/songs.service';
import {FilterListComponent} from './filter-list/filter-list.component';
import * as path from 'path';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('filterInput') filterInput: FilterListComponent;
  @ViewChild('listSelect') listSelect: ElementRef;

  public displays: Electron.Display[];
  public main: Electron.Display;

  public lists: List[];

  public isOpened: boolean;
  protected newWindow: BrowserWindow;

  public songs: Song[] = [];
  public selectedSongIndex = -1;
  private selectedListIndex = -1;

  public get listsFound(): boolean {
    return this.listService.lists.length === 0;
  }

  public get songsFound(): boolean {
    return this.songService.songs.length === 0;
  }

  constructor(private listService: ListsService, private zone: NgZone, public songService: SongsService) { }

  ngOnInit() {
    this.displays = screen.getAllDisplays();
    this.main = screen.getPrimaryDisplay();
    this.lists = this.listService.lists;
    this.isOpened = false;

    window.addEventListener('keyup', ev => {
      if (this.newWindow && !this.filterInput.focused) {
        this.newWindow.webContents.send('keyups', {key: ev.key});
      }
    });

    if (this.listService.lists.length === 0) {
      console.log('No lists found');
      this.listService.createBasePath();
    }

    if (this.songService.songs.length === 0) {
      console.log('No songs found');
      this.songService.createBasePath();
    }
  }

  openWindow() {
    if (!this.isOpened) {
      this.isOpened = true;

      if (this.newWindow) {
        this.newWindow.close();
      }

      const selectedScreenId = localStorage.getItem('display-select');
      let selectedScreen: Display;

      if (selectedScreenId === null) {
        selectedScreen = this.displays[0];
      } else {
        selectedScreen = this.displays.find(x => x.id === +selectedScreenId);
        if (selectedScreen === undefined) {
          selectedScreen = this.displays[0];
        }
      }

      this.newWindow = new remote.BrowserWindow({
        frame: false,
      });

      console.log(selectedScreen.bounds);
      this.newWindow.setBounds(selectedScreen.bounds);
      this.newWindow.on('closed', () => {
        this.zone.run(() => {
          console.log('Closed interaction');
          this.isOpened = false;
          this.newWindow = null;
          this.selectedListIndex = -1;
          this.songs = [];
        });
      });

      let songPath: string;
      if (isDevMode()) {
        songPath = url.format({
          pathname: 'localhost:4200/',
          protocol: 'http:',
          slashes: true,
          hash: '/songs/screen',
        });
      } else {
        songPath = url.format({
          pathname: path.join(__dirname, './index.html'),
          protocol: 'file:',
          slashes: true,
          hash: '/songs/screen'
        });
      }

      this.newWindow.loadURL(songPath);

      let selectedList;

      if (this.selectedListIndex === -1) {
        selectedList = null;
        this.songs = [];
      } else {
        selectedList = this.lists[this.selectedListIndex];
        this.songs = selectedList.songs;
      }

      this.newWindow.webContents.on('did-finish-load', () => {
        console.log('sending info');

        this.newWindow.webContents.send('load', selectedList);
      });

      remote.ipcMain.on('song-layout', (event, message) => {
        console.log('Received', message);
      });

      remote.ipcMain.on('song-selected', ((event, message) => {

        this.zone.run(() => {
          this.selectedSongIndex = message;
        });
        console.log('selected song received:', message);

      }).bind(this));

      // this.newWindow.webContents.openDevTools();
    }
  }

  onSelectInputChange(event: Event) {
    this.selectedListIndex = +(event.target as HTMLSelectElement).value;
    console.log(this.selectedListIndex);
  }

  setCustomSong(song: Song) {
    console.log('set custom song');
    this.newWindow.webContents.send('set-song', song);
  }
  setSongIndex(index: number) {
    this.newWindow.webContents.send('set-index', index);
    this.selectedSongIndex = index;
  }
  openSongsFolder() {
    shell.showItemInFolder(this.songService.path + '/');
  }

}
