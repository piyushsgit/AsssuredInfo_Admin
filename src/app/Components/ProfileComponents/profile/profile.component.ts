import { Component, ViewEncapsulation } from '@angular/core';
import { ApiCallService } from '../../Services/api-call.service';
import { SignalrserviceService } from 'src/app/home/service/signalrservice.service';
import { ProfileredirectService } from '../../shared/profileredirect.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {
tempid = localStorage.getItem('userId');
userName=localStorage.getItem('UserName');
UserImage=localStorage.getItem('avtar_Url');
id = this.tempid !== null ? parseInt(this.tempid) : 0;
userId=this.id
tabChanges:number=1;
temp:any
UserData:any
follow=true;
FollowerData:any
obj:any
OwnProfile=true
Otherusername:any
  constructor(private ApiService:ApiCallService,private signalr:SignalrserviceService,
    private profileredirect:ProfileredirectService
    ,private route:ActivatedRoute){}
  
ngOnInit(){
  this.signalr.startConnection().subscribe(() => {
    console.log('Connection established');
    this.recieveFollowUnfollowRequest()
  });
  this.route.queryParams.subscribe(params => {
    if(params['View']!==undefined || null){
      if(this.userName===params['View']){
        this.OwnProfile=true
      }
      else{ this.OwnProfile=false }
      this.GetUserByUserName(params['View'])
    }
    else{
      
      this.OwnProfile=true
      this.GetUserById()
    }
  });
}
recieveFollowUnfollowRequest(){
  this.signalr.RecieveFollowRequest().subscribe({
    next:(data)=>{
      this.temp=data
      console.log("Recieve follow",this.temp);
      
    }
  })
}

GetUserById(){
    this.ApiService.GetUsersById(this.id).subscribe({
      next: (dataobj) => {
        this.temp=dataobj
        this.UserData=this.temp.data[0]
      },
      error:(e)=>{
        console.log(e);
      }
      });
  }

  GetUserByUserName(username:string){
    this.Otherusername=username
    this.ApiService.GetUserByUserNameandFollow(username,this.userId).subscribe({
      next: (dataobj) => {
        this.temp=dataobj
        this.UserData=this.temp.data[0]
        if(this.UserData.followResult===1)
        {
          this.follow=false
        }
        this.FollowerData=this.UserData
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
progressValue: number = 45;
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
  this.obj={
    FollowerId:this.userId,
    FollowingId:this.FollowerData.userId,
    Mode:1,
    Follower_Username :this.userName,
    Follower_avatar_url:this.UserImage
  }
   this.signalr.SendFollowRequest(this.obj)
   this.GetUserByUserName(this.Otherusername)
} 
UnFollowClick(){
  this.follow=true
  this.obj={
    FollowerId:this.userId,
    FollowingId:this.FollowerData.userId,
    Mode:2,
    Follower_Username :this.userName,
    Follower_avatar_url:this.UserImage
  }  
   this.signalr.SendFollowRequest(this.obj)
   this.GetUserByUserName(this.Otherusername)
}

GetFollowDetail(){
}

}
