import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsComponent} from './components/settings/settings.component';
import {SongsComponent} from './components/songs/songs.component';
import {ListComponent} from './components/list/list.component';
import {CreateListComponent} from './components/create-list/create-list.component';
import {SongScreenComponent} from './components/song-screen/song-screen.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'songs',
    component: SongsComponent
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'list/edit',
    component: CreateListComponent
  },
  {
    path: 'songs/screen',
    component: SongScreenComponent
  }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
