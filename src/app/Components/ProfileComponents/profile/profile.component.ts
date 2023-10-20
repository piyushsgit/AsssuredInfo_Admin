import { Component, ViewEncapsulation } from '@angular/core';
import { ApiCallService } from '../../Services/api-call.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  tabChanges:number=1;
 temp:any
 UserData:any
 follow=true;
  constructor(private ApiService:ApiCallService){}
  
ngOnInit(){
  this.GetUserById()
}


GetUserById(){
    this.ApiService.GetUsersById(this.id).subscribe({
      next: (dataobj) => {
        this.temp=dataobj
        this.UserData=this.temp.data[0]
        console.log(this.UserData);
        
      },
      error:(e)=>{
        console.log(e);
      }
      });
  }

  PostClick(){
    this.tabChanges=1
    var about =document.getElementById('about') 
    about?.classList.remove("active")
    var about =document.getElementById('poll') 
    about?.classList.remove("active")
    var post=document.getElementById('post') 
    post?.classList.add("active")
  }
  PollClick(){
    this.tabChanges=2
    var about =document.getElementById('about') 
    about?.classList.remove("active")
    var about =document.getElementById('post') 
    about?.classList.remove("active")
    var post=document.getElementById('poll') 
    post?.classList.add("active")
  }
  AboutClick(){
    this.tabChanges=3
    var post=document.getElementById('post') 
    post?.classList.remove("active")
    var post=document.getElementById('poll') 
    post?.classList.remove("active")
    var about =document.getElementById('about') 
    about?.classList.add("active")
  }
  progressValue: number = 90; 

  getProgressColorClass(): string {
    if (this.progressValue < 40) {
      return 'backgroundlow'; 
    } else if (this.progressValue < 80) {
      return 'backgroundmedium'; 
    } else {
      return 'backgroundhigh'; 
    }
}

FollowClick(){
  this.follow=false
}
UnFollowClick(){
  this.follow=true
}

}
