import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocialPostComponent } from './social-post/social-post.component';

@NgModule({
  declarations: [
    AppComponent,
    SocialPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule // FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
