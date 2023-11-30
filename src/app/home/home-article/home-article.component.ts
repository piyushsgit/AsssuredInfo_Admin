


import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { ApiCallService } from 'src/app/Components/Services/api-call.service';
import { ApicallService } from '../service/apicall.service';
import { AddressServiceService } from '../service/address-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileredirectService } from 'src/app/Components/shared/profileredirect.service';
import { SignalrserviceService } from '../service/signalrservice.service';
// './home-article.component.css'

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
  @Input() UserProfile!: string;
  @Input() bookmark: boolean=false;
  @Input() UserName!:string
  isLoading = false;
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  Userid=this.id
  temp: any
  obj: any
  toggle=false
  initialActiveSlideIndex: number = 0;
  UserAddresses: any
  primaryAddress: any
  temporayAddress: any
  isGreen: boolean = false;
  isRed: boolean = false;
  searchtext:any
  bookmarkStatus: { [key: string]: boolean } = {};
  constructor(private ApiService:ApiCallService,private homeapiserv:ApicallService
  ,private addressService: AddressServiceService, private profileredirect:ProfileredirectService,
  private route:ActivatedRoute ,private router:Router,private signalr:SignalrserviceService ){
  }
  showComments: boolean[] = [];
  
  ngOnInit(){
   if(this.UserName){
    this.GetUserByUserName(this.UserName)
   }
   else if(this.bookmark){
    this.getArticleByAddress('bookmark')
   }
  else{
    this.route.queryParams.subscribe(params => {
      this.searchtext = params['searchText'];
      if(this.UserProfile!=='ShowArticle'){
        if(this.searchtext==undefined || null){
          this.GetUserAddrssById()
        }
        else{
          debugger
          this.getArticleByAddress('Search')
        }
      }
    });
    if(this.UserProfile=='ShowArticle'){
      this.getArticleByUserid()
    }
  }
  this.recieveLikeNotification()
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

  GetUserByUserName(username:string){
    this.ApiService.GetUserByUserName(username).subscribe({
      next: (dataobj) => {
        this.temp=dataobj
        this.id=this.temp.data[0].userId
        this.getArticleByUserid()
      
      },
      error:(e)=>{
        console.log(e);
      }
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
   if(addresstype=='bookmark'){
    this.obj = {
      addressId: null,
      userid:this.Userid,
      pageSize: 10,
      pageIndex: 1,
      filter: 3,
    };
   }
      this.homeapiserv.GetArticle(this.obj).subscribe({
        next:(dataobj)=>{
          this.temp=dataobj
          this.AricleResult=this.temp.data
          console.log("Article Result",this.AricleResult);
          this.showComments = Array(this.AricleResult.length).fill(false);
          this.getArticleDetailLikeDislike()
        }
      })
 
  }
  onScroll() {
    const container = document.getElementById('paggi');
   
    if (container) {
      if (
        container.scrollTop + container.clientHeight >= container.scrollHeight
      ) {
        if (!this.isLoading && this.searchtext==undefined||null) {
          this.pageIndex++;
          this.getArticleByAddress('primary');
        }
        else{
          this.getArticleByAddress('Search');
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
        this.toggle=true
      }
      this.obj = {
        articleId: item.articleid,
        articleUserId:item.userId,
        userId: this.Userid,
        like: true,
        operationType: 1,
        toggle:this.toggle
      }
    } else {
      item.likes--;
      this.obj = {
        articleId: item.articleid,
        articleUserId:item.userId,
        userId: this.Userid,
        like: false,
        operationType: 1,
        toggle:this.toggle
      }
    }
    item.isLiked = !item.isLiked;
    this.signalr.SendLikeDislike(this.obj)
    this.toggle=false
  }

  toggleDislike(item: any) {
    if (!item.isDisliked) {
      item.dislikes++;
      if (item.isLiked) {
        item.likes--;
        item.isLiked = false;
        this.toggle=true
      }
      this.obj = {
        articleId: item.articleid,
        userId: this.Userid,
        dislike: true,
        operationType: 2,
        toggle:this.toggle
      }
    } else {
      item.dislikes--;
      this.obj = {
        articleId: item.articleid,
        userId: this.Userid,
        dislike: false,
        operationType: 2,
        toggle:this.toggle
        
      }
    }
    item.isDisliked = !item.isDisliked;
    this.signalr.SendLikeDislike(this.obj)
    this.toggle=false
  }

 
  generateKey(userId: number, articleId: number): string {
    return `${userId}_${articleId}`;
  }
 
  toggleBookmark(articleId: number, userId: number) {
    const key = this.generateKey(userId, articleId);
    this.bookmarkStatus[key] = !this.bookmarkStatus[key];
    const obj = {
      articleId: articleId,
      userId: this.Userid,
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
      userId: this.Userid,
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

// if UserPost is openned
getArticleByUserid(){  
  this.ApiService.GetArticleByUserId(this.id,1,null).subscribe({
    next:(dataObj)=>{
        this.temp=dataObj
        if(this.temp.success){
          this.AricleResult=this.temp.data
          this.showComments = Array(this.AricleResult.length).fill(false);
           this.getArticleDetailLikeDislike()
        }
    },
    error:(e)=>{
      console.log(e)
    }
  })
}

DeleteArticle(articleId:any){
  this.ApiService.GetArticleByUserId(this.Userid,2,articleId).subscribe({
    next:(dataObj)=>{
        this.temp=dataObj
        if(this.temp.success){
          this.getArticleByUserid()
        }
    },
    error:(e)=>{
      console.log(e)
    }
  })
}
ProfileRedirect(Username:any)
{
this.router.navigate(['profile'],{
  queryParams: {
   View:Username
  }
})
}

recieveLikeNotification(){
  this.signalr.RecieveLikeDislike().subscribe({
    next:(data)=>{
      this.temp=data
      if (this.temp.userId!=this.Userid) { 
       const item=this.AricleResult.find((x:any)=>x.articleid==this.temp.articleId) 
        
      if(this.temp.like==true && this.temp.toggle==false){
        item.likes++;
      }
      else if(this.temp.like==true && this.temp.toggle==true){
        item.likes++;
        item.dislikes--;
      }
      else if (this.temp.like==false){
        item.likes--;
      }
      else if(this.temp.dislike==true && this.temp.toggle==false){
        item.dislikes++;
      }
      else if(this.temp.dislike==true && this.temp.toggle==true){
        item.dislikes++;
        item.likes--;
      }
      else if (this.temp.dislike==false){
        item.dislikes--;
      }
    }
    }
  })
}


}
