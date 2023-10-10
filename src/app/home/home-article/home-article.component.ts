import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ApiCallService } from 'src/app/Components/Services/api-call.service';
import { ApicallService } from '../service/apicall.service';

@Component({
  selector: 'app-home-article',
  templateUrl: './home-article.component.html',
  styleUrls: ['./home-article.component.css']
})
export class HomeArticleComponent {

  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  temp:any
  obj:any
  UserAddresses:any
  primaryAddress:any
  temporayAddress:any
  AricleResult:any
  isGreen: boolean = false;
  isRed: boolean = false;

  bookmarkStatus: { [key: string]: boolean } = {};
 constructor(private ApiService:ApiCallService,private homeapiserv:ApicallService,private renderer: Renderer2, private el: ElementRef   ){}
 
  ngOnInit(){
   this.GetUserAddrssById()
   
  }
  toggleFullContent(item: any) {
    item.showFullContent = !item.showFullContent;
  }
  GetUserAddrssById() {
    this.ApiService.GetUsersAddressById(this.id).subscribe({
      next: (dataobj) => {
        this.temp = dataobj;
        this.UserAddresses = this.temp.data;
        this.primaryAddress = this.UserAddresses.find(
          (address: any) => address.isPrimary === true
        );
        this.temporayAddress = this.UserAddresses.filter((address: any) => address !== this.primaryAddress);
        this.getArticleByAddressid('primary')
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  getArticleByAddressid(addresstype:any){
    if(addresstype=='primary'){
       this.obj={
         addressId : this.primaryAddress.mainaddressid,
          searchText : '' ,
         pageSize : 10,
         pageIndex : 1,
          filter : 1
      }
    }
      this.homeapiserv.GetArticle(this.obj).subscribe({
        next:(dataobj)=>{
          this.temp=dataobj
          this.AricleResult=this.temp.data
          this.getArticleDetailLikeDislike()
        }
      })
  }

 
  toggleLike(item: any) {

    if (!item.isLiked) {
      item.likes++;
      if (item.isDisliked) {
        item.dislikes--;
        item.isDisliked = false;
      }
      this.obj={ 
        articleId : item.articleid,
        userId : this.id,
        like : true,
        operationType : 1
     }
    } else {
      item.likes--;
      this.obj={ 
        articleId : item.articleid,
        userId : this.id,
        like : false,
        operationType : 1
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
      this.obj={ 
        articleId : item.articleid,
         userId : this.id,
        dislike : true,
        operationType : 2
     }
    } else {
      item.dislikes--;
      this.obj={ 
        articleId : item.articleid,
         userId : this.id,
        dislike : false,
        operationType : 2
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

  // Function to generate unique keys for user and article combinations
  generateKey(userId: number, articleId: number): string {
    return `${userId}_${articleId}`;
  }
  // Function to toggle bookmark status for a specific user and article
  toggleBookmark( articleId: number,userId: number) {
    const key = this.generateKey(userId, articleId);
    this.bookmarkStatus[key] = !this.bookmarkStatus[key];
    const obj={ 
      articleId : articleId,
      userId : this.id,
      Bookmark : this.bookmarkStatus[key],
      operationType : 4
   }
   this.homeapiserv.ManageLikeDislike(obj).subscribe({
    next: (dataobj) => {
    },
    error: (e) => {
      console.log(e);
    },
  });
    
  }
 getArticleDetailLikeDislike(){
  const obj={ 
    userId : this.id,
    operationType : 3
 }
  this.homeapiserv.ManageLikeDislike(obj).subscribe({
    next: (dataobj) => {
     this.temp=dataobj
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
            article.isBookmark=item.bookmark;
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
