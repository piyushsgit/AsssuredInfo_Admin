import { Component, ViewEncapsulation } from '@angular/core';
import { ApiCallService } from '../../Services/api-call.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {
   id=16
tabChanges:any=false;
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
  AboutClick(){
    this.tabChanges=true
    var post=document.getElementById('post') 
    post?.classList.remove("active")
    var about =document.getElementById('about') 
    about?.classList.add("active")
  }

  PostClick(){
    this.tabChanges=false
    var about =document.getElementById('about') 
    about?.classList.remove("active")
    var post=document.getElementById('post') 
    post?.classList.add("active")
  }
  progressValue: number = 67; 

  getProgressColorClass(): string {
    if (this.progressValue < 20) {
      return 'bg-danger'; 
    } else if (this.progressValue < 80) {
      return 'bg-warning'; 
    } else {
      return 'bg-success'; 
    }
}

FollowClick(){
  this.follow=false
}
UnFollowClick(){
  this.follow=true
}

}
