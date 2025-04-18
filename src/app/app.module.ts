import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NetworkComponent } from './home/network/network.component';
import { InfoSlideComponent } from './home/info-slide/info-slide.component';

@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    InfoSlideComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
