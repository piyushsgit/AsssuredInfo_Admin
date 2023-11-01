import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from '../../Services/api-call.service';
import { ApicallService } from 'src/app/home/service/apicall.service';
import { ProfileredirectService } from '../../shared/profileredirect.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {

  postOpened='ShowArticle'
  OwnProfile=true
  Username:any
  userName=localStorage.getItem('UserName');
  constructor(private router:Router,private profileredirect:ProfileredirectService,private route:ActivatedRoute){}
  
 ngOnInit(){
  this.route.queryParams.subscribe(params => {
    if(params['View']!==undefined || null){
      if(this.userName===params['View']){
        this.OwnProfile=true
      }
      else{ this.OwnProfile=false }
      this.Username=params['View']
    }
    else{
      this.OwnProfile=true
      this.Username=null
    }
  });
 }
   
  NewPosts(){
  this.router.navigate(['/newpost'])
  }
 
 
}
