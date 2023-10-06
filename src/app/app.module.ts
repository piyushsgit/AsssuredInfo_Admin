import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgFor, AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './Components/ProfileComponents/profile/profile.component';
import { AboutComponent } from './Components/ProfileComponents/about/about.component';
import { AddressComponent } from './Components/ProfileComponents/address/address.component';
import { HomeModule } from './home/home.module';
import { PostsComponent } from './Components/ProfileComponents/posts/posts.component';

import { PollsComponent } from './Components/ProfileComponents/polls/polls.component';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AboutComponent,
    AddressComponent,
    PostsComponent,
    PollsComponent,


    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule ,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe, 
    HttpClientModule,
    HomeModule,
    ToastModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
