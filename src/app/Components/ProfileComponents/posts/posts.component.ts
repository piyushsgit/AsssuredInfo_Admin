import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallService } from '../../Services/api-call.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  temp:any
  article:any
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  constructor(private router:Router,private apicall:ApiCallService,private renderer: Renderer2){}
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
 
}
