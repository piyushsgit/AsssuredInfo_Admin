


import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { ApiCallService } from 'src/app/Components/Services/api-call.service';
import { ApicallService } from '../service/apicall.service';
import { AddressServiceService } from '../service/address-service.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home-article',
  templateUrl: './home-article.component.html',
  styleUrls: ['./home-article.component.css']
})
export class HomeArticleComponent {

  @ViewChild('carousel', { static: false }) carousel: any;
  slideConfig = { "slidesToShow": 4, "slidesToScroll": 4 };
  pageIndex = 1;
  AricleResult: any[] = [];
  @Input() images: string[]=[];
  activeIndex = 0; 
  isLoading = false;

  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  temp: any
  obj: any
  initialActiveSlideIndex: number = 0;
  UserAddresses: any
  primaryAddress: any
  temporayAddress: any
  isGreen: boolean = false;
  isRed: boolean = false;
  searchtext:any
  bookmarkStatus: { [key: string]: boolean } = {};
 constructor(private ApiService:ApiCallService,private homeapiserv:ApicallService
  ,private addressService: AddressServiceService, private dataService:AddressServiceService,
  private route:ActivatedRoute  ){
    
  }
  showComments: boolean[] = [];

  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      this.searchtext = params['searchText'];
      if(this.searchtext==undefined || null){
        this.GetUserAddrssById()
      }
      else{
        this.getArticleByAddress('Search')
      }
    });
   
  }
generateCarouselId(index: number): string {
  return 'myCarousel_' + index;
}
  toggleFullContent(item: any) {
    item.showFullContent = !item.showFullContent;
  }
  GetUserAddrssById() {
    this.addressService.selectedAddressId$.subscribe(addressId => {
      this.selectedAddressId = addressId;
      this.getArticleByAddress('primary')
    });
  }

 

  selectedAddressId: any 
  getArticleByAddress(addresstype:any){
    if(addresstype=='primary'){
       this.obj={
         addressId : this.selectedAddressId,
          searchText : '' ,
         pageSize : 10,
         pageIndex : 1,
          filter : 1
      }
    }
    if(addresstype=='Search'){
      this.obj = {
        addressId: null,
        searchText: this.searchtext,
        pageSize: 10,
        pageIndex: 1,
        filter: 1,
      };
   }
      this.homeapiserv.GetArticle(this.obj).subscribe({
        next:(dataobj)=>{
          this.temp=dataobj
          this.AricleResult=this.temp.data
          console.log(this.AricleResult);
          this.showComments = Array(this.AricleResult.length).fill(false);
          this.getArticleDetailLikeDislike()
        }
      })
 
  }
  onScroll() {
    
    const container = document.getElementById('paggi');
    if (container) {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight
      ) {
        if (!this.isLoading) {
          this.pageIndex++;
          this.getArticleByAddress('primary');
        }
      }
    }
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


  
 toggleCommentSection(index: number, id: any): void {
  this.showComments = this.showComments.map((showComment, i) => (i === index ? !showComment : false));
  this.addressService.setArticleId(id);
}


}
