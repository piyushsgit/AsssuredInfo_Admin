import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './Components/ProfileComponents/profile/profile.component';
import { AboutComponent } from './Components/ProfileComponents/about/about.component';
import { AddressComponent } from './Components/ProfileComponents/address/address.component';
import { HomeModule } from './home/home.module';
import { PostsComponent } from './Components/ProfileComponents/posts/posts.component';
import { PollsComponent } from './Components/ProfileComponents/polls/polls.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { SharedModule } from './Components/shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoaderComponent } from './Components/loader/loader.component';
import { LoaderInterceptor } from './Components/Services/loader-interceptor.service';

import { SafeHtmlPipe } from './safe-html.pipe';
import { SidebarModule } from 'primeng/sidebar';
import { NotificationComponent } from './notification/notification.component';
import { SettingComponent } from './setting/setting.component';

 



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
    LoaderComponent,
    SafeHtmlPipe
    


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    HttpClientModule,
    CommonModule,
    ToastModule,
    SharedModule,
    HomeModule,
    ConfirmDialogModule,
    FormsModule,
    CommonModule,
    SidebarModule,
    NotificationComponent,
    SettingComponent

  ],
  providers: [MessageService, ConfirmationService, {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
