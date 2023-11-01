import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../Service/api.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {

  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  temp:any
  notificationdata:any
  @Input() inputData!:string
 constructor(private apicall:ApiService){}

 ngOnInit(){
  this.GetNotification()
 }
  GetNotification()
  {
    const obj={
      operationType: 5,
     recieverId:this.id
    }
    this.apicall.GetNotification(obj).subscribe({
    next:(data)=>{
      this.temp=data
      debugger
      this.notificationdata=this.temp.data

    },error(err) {
      console.log(err);
    },
    })
  }
  ClearAll(){
    debugger
    const obj={
      operationType: 4,
     recieverId:this.id
    }
    this.apicall.GetNotification(obj).subscribe({
    next:(data)=>{
      this.notificationdata.length=0
    },error(err) {
      console.log(err);
    },
    })
  }
}
