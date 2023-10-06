import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiCallService } from 'src/app/Components/Services/api-call.service';

@Component({
  selector: 'app-homepoll',
  templateUrl: './homepoll.component.html',
  styleUrls: ['./homepoll.component.css']
})
export class HomepollComponent {
  constructor(private ApiService:ApiCallService){
  }
  temp:any
  options:any
  optionsPercentage:any
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  formattedPolls:any
  radioValues: string[][] = [];

ngOnInit(){
  this.GetPollsByuserId()
}
GetPollsByuserId() {
  this.ApiService.GetPollsByUserId(this.id).subscribe({
    next: (dataobj) => {
      this.temp = dataobj;
      const Polls=this.temp.data
      console.log(this.temp.data);
      this.formattedPolls = Polls.map((poll:any) => {
        this.options = [];
        this.optionsPercentage=[];
        for (let i = 1; i <= 4; i++) {
          const optionKey = `opt${i}`;
          const optionPercentageKey = `opt${i}Percentage` ;
          if (poll[optionKey] !== null) {
            this.options.push(poll[optionKey]);
            this.optionsPercentage.push(poll[optionPercentageKey])
          }
        }
        return {
          id: poll.pollId,
          createdOn: poll.createdOn,
          question: poll.question,
          options: this.options,
          fulladdress:poll.fulladdress,
          TotalParticipants:poll.totalParticipants,
          optionpercentage:this.optionsPercentage
        };
      });    
      console.log(this.formattedPolls);
    },
    error: (e:any) => {
      console.log(e);
    },
  });
}
onPollSubmit(index: number,item:any) {
  const index2 = item.options.indexOf(this.radioValues[index]);
  const obj={
    userId :this.id,
    PolltableId :item.id,
    OptionLike :(index2+1)
  }
  this.ApiService.PollSubmit(obj).subscribe({
    next: (dataobj) => {
      this.temp = dataobj;
      if(this.temp.success){
        alert("Post Succcesfullyy")
      }
      else{
        alert("something went wrrong")
      }
    },
    error: (e:any) => {
      console.log(e);
    },
  });
  console.log(obj);

}
progressValue: number = 10.56; 

getProgressColorClass(): string {
  if (this.progressValue < 20) {
    return 'backgroundlow'; 
  } else if (this.progressValue < 80) {
    return 'bg-warning'; 
  } else {
    return 'bg-success'; 
  }
}

}
