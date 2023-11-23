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
import { ConfirmService } from './Components/shared/confirm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  selectedColorCombo: {id:number, darkColor: string, lightColor: string } | null = null;
  isLoading = this.loadingService.loading$;
  searchTerm:any
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  temp:any
 emailverified = localStorage.getItem('emailVerified')
  userImage = localStorage.getItem('avtar_Url');
  NotificationNumber=0
  SettingOpenend=false
  NoticicationOpened=false
  sidebarVisible2: boolean = false;
  userName=localStorage.getItem('UserName');
  colorcombo:any;
tempcolor = localStorage.getItem('themeid');
color = this.tempcolor !== null ? parseInt(this.tempcolor) : 0;
  colorCombinations = [
    { id:1, darkColor: '#663366', lightColor: '#CC99CC' },
    { id:2, darkColor: '#886633', lightColor: '#FFCC99' },
    { id:3, darkColor: 'rgb(32, 32, 32)', lightColor: 'rgb(148, 148, 148)' },
    { id:4, darkColor: '#883388', lightColor: '#FF99FF' },
    { id:5, darkColor: '#883333', lightColor: '#FF9999' },
    { id:6, darkColor: '#336633', lightColor: '#99FF99' },
    { id:7, darkColor: '#333388', lightColor: '#9999FF' },
    { id:8, darkColor: '#888833', lightColor: '#FFFF99' }
  ];
  constructor(private router: Router, public auth: AuthService,private loadingService:
     LoadingService,private sharedservice:AddressServiceService,private signalr:SignalrserviceService,private apicall:ApiService,private confirmservice:ConfirmService) { 
     }   
 
ngOnInit(){ 
  debugger
  if(this.emailverified=="true"){
    this.confirmservice.getdata("5")
  }
  this.sharedservice.SetColor$.subscribe(data => {
    this.colorcombo = this.colorCombinations.find(T => T.id == data);   
    this.selectColor(this.colorcombo);
  });
  this.sharedservice.setcolorId(this.color)

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
  refreshComponent() {
 
    this.NoticicationOpened = true;
    this.SettingOpenend = false;
  }
  selectColor(colorCombo: {id:number,  darkColor: string, lightColor: string }) { 
    document.documentElement.style.setProperty('--DBlue', colorCombo.darkColor);
    document.documentElement.style.setProperty('--LBlue', colorCombo.lightColor); 
    this.selectedColorCombo = colorCombo;
    localStorage.setItem('themeid',colorCombo.id.toString()); 
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
