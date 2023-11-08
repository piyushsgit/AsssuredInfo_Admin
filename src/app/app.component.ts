import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AuthService } from './Components/Services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from './Components/Services/loading.service';
import { AddressServiceService } from './home/service/address-service.service';
import { HomepageComponent } from './home/homepage/homepage.component';
import { SignalrserviceService } from './home/service/signalrservice.service';
import { SidebarModule } from 'primeng/sidebar';
import { ApiService } from './Service/api.service';
import { NotificationComponent } from './notification/notification.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  isLoading = this.loadingService.loading$;
  searchTerm:any
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  temp:any
  userImage = localStorage.getItem('avtar_Url');
  NotificationNumber=0
  SettingOpenend=false
  NoticicationOpened=false
  sidebarVisible2: boolean = false;
  userName=localStorage.getItem('UserName');
  constructor(private router: Router, public auth: AuthService,private loadingService:
     LoadingService,private dataServices:AddressServiceService ,private signalr:SignalrserviceService,private apicall:ApiService) {}   

ngOnInit(){
  this.signalr.startConnection().subscribe(() => {
    console.log('Connection established');
    this.recieveFollowUnfollowRequest()
    this.recieveLikeNotification()
  });
  this.GetNotificationCount()
}
  shouldShowNavbar(): boolean { 
    const currentRoute = this.router.url;
    return currentRoute !== '/' && currentRoute !== '/Register' ;
   
  }
  // this.router.navigate(['/homepage'], {
  //   queryParams: {
  //     searchText: this.searchTerm
  //   }
  // });
  SearchAddress(){
    if(this.searchTerm=='' || undefined || null){
    this.router.navigate(['/homepage'])
  }
  else{
    this.router.navigate(['/homepage'], {
      queryParams: {
        searchText: this.searchTerm
      }
    });
    this.searchTerm=''
  }
  }
  recieveFollowUnfollowRequest(){
    this.signalr.RecieveFollowRequest().subscribe({
      next:(data)=>{
        debugger
        this.temp=data
        if(this.temp.mode==1){
          this.NotificationNumber++;
        }
      }
    })
  }
  @ViewChild(NotificationComponent) childComponent!: NotificationComponent;
  NotificationClick(){
    this.NoticicationOpened=true
    this.SettingOpenend=false
    this.sidebarVisible2=true
    this.NotificationNumber=0
    if(this.childComponent){
      this.childComponent.GetNotification()
    }
  }
  settingclick(){
    this.SettingOpenend=true
    this.NoticicationOpened=false
    this.sidebarVisible2=true
  }
  recieveLikeNotification(){
    this.signalr.RecieveLikeDislike().subscribe({
      next:(data)=>{
        this.temp=data
        if (this.temp.articleUserId== this.id &&this.temp.userId!=this.id) {   
        if(this.temp.like==true){
          this.NotificationNumber++;
        }
      }
      }
    })
  }

 


  GetNotificationCount(){
    const obj2={
      operationType: 2,
     recieverId:this.id
    }
    this.apicall.GetNotification(obj2).subscribe({
    next:(data)=>{
      this.temp=data
      this.NotificationNumber=this.temp.data[0].notificationNumber
    },error(err) {
      console.log(err);
    },
  })
  }
  



}
