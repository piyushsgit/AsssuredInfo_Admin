import { Component, ViewChild } from '@angular/core';
import { HomeArticleComponent } from '../home-article/home-article.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  @ViewChild(HomeArticleComponent) childComponent!: HomeArticleComponent; 
  onParentScroll() {
    this.childComponent.onScroll();
  }
}
