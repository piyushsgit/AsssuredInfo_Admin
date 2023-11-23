import { Component } from '@angular/core';
 
import { ApiCallService } from 'src/app/Components/Services/api-call.service';
import { ApicallService } from '../service/apicall.service';
import { MessageService } from 'primeng/api';
import { AddressServiceService } from '../service/address-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-homepoll',
  templateUrl: './homepoll.component.html',
  styleUrls: ['./homepoll.component.css']
})
export class HomepollComponent {
  constructor(private ApiService:ApiCallService,private homeapiserv:ApicallService,
     private messageService: MessageService,private addressService:AddressServiceService,
     private route:ActivatedRoute){
  }
  temp:any
  options:any
  optionsPercentage:any
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  userid=this.id
  formattedPolls:any
  radioValues: string[][] = [];
  obj:any
  PollResult:any
  selectedAddressId:any
  searchtext:any
ngOnInit(){

  this.route.queryParams.subscribe(params => {
    this.searchtext = params['searchText'];
    if(this.searchtext==undefined || null){
      this.GetUserAddrssById()
    }
    else{
      this.getPollByAddress('Search')
    }
  });
}




GetUserAddrssById() {
  this.addressService.selectedAddressId$.subscribe(addressId => {
    this.selectedAddressId = addressId;
    this.getPollByAddress('primary')
  });
}
getPollByAddress(addresstype:any){
  if(addresstype=='primary'){
     this.obj={
       addressId : this.selectedAddressId,
        searchText : '',
       pageSize : 10,
       pageIndex : 1,
        filter : 1,
        userid:this.userid
    }
  }
  if(addresstype=='Search'){
    this.obj = {
      addressId: null,
      searchText: this.searchtext,
      pageSize: 10,
      pageIndex: 1,
      filter: 1,
      userid:this.userid
    };
 }
    this.homeapiserv.Getpoll(this.obj).subscribe({
      next:(dataobj)=>{
        this.temp=dataobj
        console.log("Polls data",this.temp.data); 
        const Polls=this.temp.data
        this.formattedPolls = Polls.map((poll:any) => {
          const selectedOption = poll.optionlike;


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
            optionpercentage:this.optionsPercentage,
            optionlike:poll.optionlike
          };
        });    
        console.log("formatted poll",this.formattedPolls);
        
      }
    })
}


onPollSubmit(index: number,item:any) {
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
getProgressColorClass(progressValue:number): string {
  if (progressValue < 40) {
    return 'backgroundlow';  
  } else if (progressValue < 80) {
    return 'backgroundmedium'; 
  } else {
    return 'backgroundhigh'; 
  }

}  

}


