import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { HomeArticleComponent } from './home-article/home-article.component';
import { HomepollComponent } from './homepoll/homepoll.component';
import { AuthGuard } from '../Components/Guard/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomepageComponent,
    HomeArticleComponent,
    HomepollComponent
  ],
  providers: [AuthGuard],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class HomeModule { }
