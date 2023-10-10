import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiCallService } from 'src/app/Components/Services/api-call.service';
import { ApicallService } from '../service/apicall.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-homepoll',
  templateUrl: './homepoll.component.html',
  styleUrls: ['./homepoll.component.css']
})
export class HomepollComponent {
  constructor(private ApiService:ApiCallService,private homeapiserv:ApicallService, private messageService: MessageService){
  }
  temp:any
  options:any
  optionsPercentage:any
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  formattedPolls:any
  radioValues: string[][] = [];
  UserAddresses:any
  primaryAddress:any
  temporayAddress:any
  obj:any
  PollResult:any
ngOnInit(){
  this.GetUserAddrssById()
}


isFormSubmitted: boolean = false;

GetUserAddrssById() {
  this.ApiService.GetUsersAddressById(this.id).subscribe({
    next: (dataobj) => {
      this.temp = dataobj;
      this.UserAddresses = this.temp.data;
      this.primaryAddress = this.UserAddresses.find(
        (address: any) => address.isPrimary === true
      );
      this.temporayAddress = this.UserAddresses.filter((address: any) => address !== this.primaryAddress);
      this.getPollByAddressid('primary')
    },
    error: (e) => {
      console.log(e);
    },
  });
}
getPollByAddressid(addresstype:any){
  if(addresstype=='primary'){
     this.obj={
       addressId : this.primaryAddress.mainaddressid,
        searchText : '' ,
       pageSize : 10,
       pageIndex : 1,
        filter : 1
    }
  }
    this.homeapiserv.Getpoll(this.obj).subscribe({
      next:(dataobj)=>{
        this.temp=dataobj
        console.log(this.temp.data);
        
        const Polls=this.temp.data
        this.formattedPolls = Polls.map((poll:any) => {
          this.options = [];
          this.optionsPercentage=[];
          for (let i = 1; i <= 4; i++) {
            const optionKey = `otp${i}`;
            const optionPercentageKey = `opt${i}Percentage` ;
            if (poll[optionKey] !== null) {
              this.options.push(poll[optionKey]);
              this.optionsPercentage.push(poll[optionPercentageKey])
            }
          }
          return {
            id: poll.id,
            createdOn: poll.createdon,
            question: poll.question,
            options: this.options,
            TotalParticipants:poll.totalParticipants,
            optionpercentage:this.optionsPercentage
          };
        });    
        console.log(this.formattedPolls);
        
      }
    })
}


onPollSubmit(index: number,item:any) {
debugger
  const index2 = item.options.indexOf(this.radioValues[index]);
  if(index2>=0){
  const obj={
    userId :this.id,
    PolltableId :item.id,
    OptionLike :(index2+1)
  }
  this.ApiService.PollSubmit(obj).subscribe({
    next: (dataobj) => {
      this.temp = dataobj;
      if(this.temp.success){
        this.messageService.add({ severity: 'success', summary: 'Poll Submiited', detail: '' });
       this.ngOnInit()
      }
      else{
        this.messageService.add({ severity: 'error', summary: 'Poll', detail: 'something went wrrong' });
      }
    },
    error: (e:any) => {
      console.log(e);
    },
  });
}
else{
  this.messageService.add({ severity: 'error', summary: 'Poll', detail: 'Please Select an Option' });
}
}
getProgressColorClass(progressValue:any): string {
  if (progressValue < 20) {
    return 'backgroundlow';  
  } else if (progressValue < 80) {
    return 'backgroundmedium'; 
  } else {
    return 'backgroundhigh'; 
  }
}



}
