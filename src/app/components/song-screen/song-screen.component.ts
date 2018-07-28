import {Component, OnDestroy, OnInit} from '@angular/core';
import { ipcRenderer } from 'electron';
import {Song, Verse} from '../../services/songs.service';

@Component({
  selector: 'app-song-screen',
  templateUrl: './song-screen.component.html',
  styleUrls: ['./song-screen.component.scss']
})
export class SongScreenComponent implements OnInit, OnDestroy {

  paused = false;

  songIndex = -1;
  songs: Song[] = [];

  songTitle = '';
  verseIndex = 0;
  verses: Verse[][] = [];
  public mainSlideText: string;
  public mainSlideSubtext: string;


  constructor() { }

  ngOnDestroy() {

  }


  ngOnInit() {
    this.mainSlideText = localStorage.getItem('main-slide-text') || 'Clubkamp 2018';
    this.mainSlideSubtext = localStorage.getItem('main-slide-subtext') || 'Welkom';
    window.addEventListener('keyup', this.handleKeyUp.bind(this), true);

    ipcRenderer.once('load', (event, message) => {
      if (message) {
        this.songs = message.songs;

      } else {
        this.songs = [];
      }
      console.log('Loaded');
    });

    ipcRenderer.on('set-index', (event, message) => {
      this.paused = false;
      this.verseIndex = 0;
      this.songIndex = message;
      this.songTitle = this.songs[this.songIndex].title;
      this.verses = this.getSlidesSong(this.songs[this.songIndex]);
      console.log('set', message);
    });

    ipcRenderer.on('set-song', (event, message) => {
      this.paused = false;
      this.songIndex = this.songIndex === -1 ? 0 : this.songIndex;
      this.verseIndex = 0;
      this.songTitle = message.title;
      this.verses = this.getSlidesSong(message);
    });

    ipcRenderer.on('keyups', (event, message) => {
      console.log(message);
      this.handleKeyUp(message);
    });

  }

  private handleKeyUp(ev: WindowEventMap['keyup']) {
    console.log(ev.key);
    switch (ev.key) {
      case 'Escape':
        window.close();
        break;
      case 'PageUp':
      case 'ArrowLeft':
        console.log('left');
        this.previousSlide();
        break;
      case 'PageDown':
      case 'ArrowRight':
        console.log('right');
        this.nextSlide();
        break;
      case 'b':
        this.paused = !this.paused;
        break;
    }
  }

  nextSlide() {


    if (this.verseIndex + 1 >= this.verses.length) {
      // If the slides for the current song run out
      // go to the next song if possible
      if (this.songIndex + 1 >= this.songs.length) {
        this.songIndex = this.songs.length - 1;
        this.paused = true;
      } else {

        if (this.paused === true) {
          this.paused = false;
          return;
        }


        // Go to the next song and generate new slides
        this.songIndex++;
        if (this.songs[this.songIndex]) {
          this.verseIndex = 0;
          this.verses = this.getSlidesSong(this.songs[this.songIndex]);
          this.songTitle = this.songs[this.songIndex].title;
          ipcRenderer.send('song-selected', this.songIndex);
        }
      }

    } else {
      this.verseIndex++;
    }
  }

  previousSlide() {
    if (this.paused === true) {
      this.paused = false;
      return;
    }

    if (this.verseIndex === 0) {
      if (this.songIndex - 1 < 0) {
        this.songIndex = -1;
      } else {
        this.songIndex--;
      }
      ipcRenderer.send('song-selected', this.songIndex);
      if (this.songs[this.songIndex]) {
        this.songTitle = this.songs[this.songIndex].title;
        this.verses = this.getSlidesSong(this.songs[this.songIndex]);
        this.verseIndex = this.verses.length - 1;
      }
    } else {
      this.verseIndex--;

    }
  }

  // Basically the slides
  // the first 'slide' can only contain 6 slides max, but has to have at least one verse
  // The other 'slides' can have max 10 lines, but each slide has to have at least one verse
  private getSlidesSong(song: Song): Verse[][] {
    const verses: Verse[][] = [];
    let maxLines = 7;
    let currentSlide: Verse[] = [];

    song.verses.forEach(x => {
      if (currentSlide.length === 0) {
        currentSlide.push(x);
      } else {
        const lines: number = currentSlide.map(y => y.lines.length).reduce((p: number, v) => p + v);
        if (lines + x.lines.length + currentSlide.length >= maxLines) {
          verses.push(currentSlide);
          currentSlide = [x];
          maxLines = 10;
        } else {
          currentSlide.push(x);
        }
      }
    });
    verses.push(currentSlide);
    return verses;
  }
}
