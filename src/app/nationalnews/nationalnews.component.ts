import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../Service/api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-nationalnews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nationalnews.component.html',
  styleUrls: ['./nationalnews.component.css'],
})
export class NationalnewsComponent {
  temp: any;
  news: any;
  constructor(
    private apiservice: ApiService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.GetNationalArticle();
  }

  GetNationalArticle() {
    this.apiservice.GetNationalArticle().subscribe({
      next: (dataobj) => {
        this.temp = dataobj;
        this.news = this.temp.articles;
        this.moreAnchorTag();
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
  moreAnchorTag() {
    this.news.forEach((item: any) => {
      if (item.content != null) {
        const lastCharsIndex = item.content.lastIndexOf(']');
        if (
          lastCharsIndex !== -1 &&
          lastCharsIndex === item.content.length - 1
        ) {
          const indexofstring = item.content.length - 16;
          const contentBeforeChars = item.content.substring(0, indexofstring);
          const readMoreLink = `<a href="${item.url}">Read More</a>`;
          const updatedContent = `${contentBeforeChars}${readMoreLink}`;

          item.content = updatedContent;
        }
      }
    });
  }
}
