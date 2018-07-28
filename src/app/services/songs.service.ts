import {Injectable} from '@angular/core';
import {remote} from 'electron';
import {createInterface} from 'readline';

import * as fs from 'fs';

export interface LinePart {
  text: string;
  times: number;
}
export interface Line {
  parts: LinePart[];
}
export interface Verse {
  times: number;
  lines: Line[];
}
export interface Song {
  title: string;
  group?: string;
  verses: Verse[];
}

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  basePath = `${remote.app.getPath('documents')}/KerkKamp`;
  path = `${this.basePath}/Songs`;

  public songs: Song[];

  constructor() {
    this.reloadSongs();
  }

  reloadSongs(): Song[] {
    this.songs = this.loadSongs();
    return this.songs;
  }

  createBasePath() {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath);
    }
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
  }

  loadSongs(): Song[] {
    this.createBasePath();
    return fs.readdirSync(this.path).map(b => {
      return this.readSong(this.path + '/' + b);
    });
  }

  readSong(filePath: string): Song {


    // Wrap content into <song></song> tags, to create a valid xml
    const content = fs
      .readFileSync(filePath)
      .toString()
      .split(/\r\n|\n/)
      .map(x => x.trim());
    return this.parse(content);
  }

  public parse(lines: string[]): Song {
    // Remove new lines from lines if they are there
    lines = lines.map(x => x.replace(/[\r\n]|---/, ''));
    // Split lines into groups split by empty lines.
    let split: string[][] = [[]];
    let index = 0;
    lines.forEach(element => {
      if (element === '') {
        index++;
        split[index] = [];
      }
      split[index].push(element);
    });
    split = split.filter(x => x.length > 0);
    const title = split[0][0].replace('title: ', '');
    const verses = split.slice(1).map(v => this.parseVerse(v)).filter(x => x.lines.length > 0);

    return {
      title: title,
      verses: verses
    };
  }

  private parseVerse(lines: string[]): Verse {

    return {
      times: 1,
      lines: lines.slice(0).filter(x => x !== '').map(l => this.parseLine(l))
    };
  }

  private parseLine(line: string): Line {
    const pattern = /(.+?)\(([0-9]+)x|x([0-9]+)\)/;

    let match = pattern.exec(line);
    let parts: LinePart[] = [];

    if (match != null) {
        parts.push({
          times: +match[2],
          text: match[1]
        });
      match = pattern.exec(line);
    }

    if (parts.length === 0) {
      parts = [{
        times: 1,
        text: line
      }];
    }

    return {
      parts: parts
    };
  }
}
