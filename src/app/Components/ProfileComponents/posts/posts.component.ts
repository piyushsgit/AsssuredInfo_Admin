import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallService } from '../../Services/api-call.service';
import { ApicallService } from 'src/app/home/service/apicall.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  temp:any
  AricleResult: any[] = [];
  article:any
  obj: any
  bookmarkStatus: { [key: string]: boolean } = {};
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  constructor(private router:Router,private apicall:ApiCallService, private homeapiserv: ApicallService){}
  ngOnInit(){
    this.getArticle();
  }

  getArticle(){
    this.apicall.GetArticleByUserId(this.id).subscribe({
      next:(dataObj)=>{
          this.temp=dataObj
          if(this.temp.success){
            this.article=this.temp.data
            console.log(this.article);
          }
      },
      error:(e)=>{
        console.log(e)
      }
    })
  }
  NewPosts(){
  this.router.navigate(['/newpost'])
  }
  toggleFullContent(item: any) {
    item.showFullContent = !item.showFullContent;
  }
  toggleLike(item: any) {

    if (!item.isLiked) {
      item.likes++;
      if (item.isDisliked) {
        item.dislikes--;
        item.isDisliked = false;
      }
      this.obj = {
        articleId: item.articleid,
        userId: this.id,
        like: true,
        operationType: 1
      }
    } else {
      item.likes--;
      this.obj = {
        articleId: item.articleid,
        userId: this.id,
        like: false,
        operationType: 1
      }
    }
    item.isLiked = !item.isLiked;

    this.homeapiserv.ManageLikeDislike(this.obj).subscribe({
      next: (dataobj) => {
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  toggleDislike(item: any) {
    if (!item.isDisliked) {
      item.dislikes++;
      if (item.isLiked) {
        item.likes--;
        item.isLiked = false;
      }
      this.obj = {
        articleId: item.articleid,
        userId: this.id,
        dislike: true,
        operationType: 2
      }
    } else {
      item.dislikes--;
      this.obj = {
        articleId: item.articleid,
        userId: this.id,
        dislike: false,
        operationType: 2
      }
    }
    item.isDisliked = !item.isDisliked;

    this.homeapiserv.ManageLikeDislike(this.obj).subscribe({
      next: (dataobj) => {
        console.log(dataobj)
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

 
  generateKey(userId: number, articleId: number): string {
    return `${userId}_${articleId}`;
  }
 
  toggleBookmark(articleId: number, userId: number) {
    const key = this.generateKey(userId, articleId);
    this.bookmarkStatus[key] = !this.bookmarkStatus[key];
    const obj = {
      articleId: articleId,
      userId: this.id,
      Bookmark: this.bookmarkStatus[key],
      operationType: 4
    }
    this.homeapiserv.ManageLikeDislike(obj).subscribe({
      next: (dataobj) => {
      },
      error: (e) => {
        console.log(e);
      },
    });

  }
  getArticleDetailLikeDislike() {
    const obj = {
      userId: this.id,
      operationType: 3
    }
    this.homeapiserv.ManageLikeDislike(obj).subscribe({
      next: (dataobj) => {
        this.temp = dataobj
        if (Array.isArray(this.temp.data)) {
          this.temp.data.forEach((item: any) => {
            for (const article of this.AricleResult) {
              if (article.articleid === item.articleId) {
                if (item.likes) {
                  article.isLiked = true;
                }
                if (item.dislike) {
                  article.isDisliked = true;
                }

                if (item.bookmark) {
                  const key = this.generateKey(this.id, item.articleId);
                  this.bookmarkStatus[key] = true;
                  article.isBookmark = item.bookmark;
                }
              }
            }

          });
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
 
}
