import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SpotifySearchService } from "./spotify.service";

@NgModule({
  imports:      [ BrowserModule, ReactiveFormsModule, HttpModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [SpotifySearchService]
})
export class AppModule { }
