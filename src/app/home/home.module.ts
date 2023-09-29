import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { HomeArticleComponent } from './home-article/home-article.component';
import { HomepollComponent } from './homepoll/homepoll.component';


@NgModule({
  declarations: [
    HomepageComponent,
    HomeArticleComponent,
    HomepollComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
