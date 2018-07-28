import { Injectable } from '@angular/core';
import {Song, SongsService} from './songs.service';
import {remote} from 'electron';
import * as fs from 'fs';


export class List {
  path: string;
  name: string;
  date: Date;
  songs: Song[] = [];


  constructor(path: string, name: string, date: Date) {
    this.path = path;
    this.name = name;
    this.date = date;
  }
}


@Injectable({
  providedIn: 'root'
})
export class ListsService {

  basePath = `${remote.app.getPath('documents')}/KerkKamp`;
  path = `${this.basePath}/Lists`;

  public lists: List[];

  constructor(private songService: SongsService) {
    this.reloadLists();
  }

  reloadLists(): List[] {
    this.lists = this.loadLists();
    return this.lists;
  }

  createBasePath() {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath);
    }
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
  }
  loadLists(): List[] {
    this.createBasePath();
    return fs.readdirSync(this.path).map(b => {
      return this.readList(this.path + '/' + b);
    });
  }

  readList(filePath: string): List {
    console.log(filePath);

    const songs = this.songService.songs;

    const content = fs.readFileSync(filePath).toString().split(/\r\n\t|\r\n|\r\t|\n/);
    const title = content[0]
    const date = new Date(content[1]);
    const list = new List(filePath, title, date);

    const songsStringsTrimmed = content.slice(2);
    list.songs = songsStringsTrimmed.map(x => songs.find(s => s.title === x.trim()) || null).filter(x => x !== null);

    return list;
  }

  saveList(list: List) {

    let content = list.name + '\r\n';
    const dateSeconds = Math.ceil(list.date.getTime() / 1000);
    content += `${list.date.toDateString()}\r\n`;
    list.songs.forEach(x => content += x.title + '\r\n');

    fs.writeFileSync(`${this.path}/${list.name}-${dateSeconds}.txt`, content);
  }

  removeList(list: List) {
    const dateSeconds = Math.ceil(list.date.getTime() / 1000);
    fs.unlinkSync(list.path);
  }

  find(name: string, date: string): List | null {
    return this.lists.find(x => x.name === name && x.date.getTime() === new Date(date).getTime()) || null;
  }
}
