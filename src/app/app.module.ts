import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NbCardModule, NbLayoutModule, NbMenuModule, NbSidebarModule, NbTabsetModule, NbThemeModule} from '@nebular/theme';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SongsComponent} from './components/songs/songs.component';
import { ListComponent } from './components/list/list.component';
import { CreateListComponent } from './components/create-list/create-list.component';
import { SongScreenComponent } from './components/song-screen/song-screen.component';
import { BaseLayoutComponent } from './components/base-layout/base-layout.component';
import { SlideComponent } from './components/song-screen/slide/slide.component';
import { FilterListComponent } from './components/home/filter-list/filter-list.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    SongsComponent,
    ListComponent,
    CreateListComponent,
    SongScreenComponent,
    BaseLayoutComponent,
    SlideComponent,
    FilterListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NbThemeModule.forRoot({name: 'default'}),
    NbLayoutModule,
    NbMenuModule.forRoot(),
    NbCardModule,
    NbTabsetModule,
    NbSidebarModule.forRoot(),
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
