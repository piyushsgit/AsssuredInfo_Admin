import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ApiCallService } from '../../Services/api-call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileredirectService } from '../../shared/profileredirect.service';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent {
  constructor(private fb: FormBuilder,private apicall:ApiCallService,private router:Router,
    private profileredirect:ProfileredirectService,private route:ActivatedRoute) {}
  myForm:any 
  opt:number=1 
  item: any
  enable=true 
  options:any
  optionsPercentage:any
  tempid = localStorage.getItem('userId');
  userName=localStorage.getItem('UserName');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  formattedPolls:any
  OwnProfile=true
  ngOnInit() {
    this.myForm = this.fb.group({
      question: '',
      opt1:'',
      opt2:'',
      options: this.fb.array([]),
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
        this.GetPollsByuserId()
      }
    });
  }
  NewPolls(){
    this.router.navigate(['newpoll'])
  }
  get optionsFormArray() {
    return this.myForm.get('options') as FormArray;
  }
  toggleResponseDiv(items:any) {
    items.showResponse = !items.showResponse;
    if(items.showResponse==false)
      items.Response='See';
    else
      items.Response='Hide'; 
  }
  GetUserByUserName(username:string){
    debugger
    this.apicall.GetUserByUserName(username).subscribe({
      next: (dataobj) => {
        debugger
        this.temp=dataobj
        this.id=this.temp.data[0].userId
        this.GetPollsByuserId()
      },
      error:(e)=>{
        console.log(e);
      }
      });
  }

  addOption() {
    if(this.opt<3){
      this.optionsFormArray.push(new FormControl(''));
      this.opt=this.opt+1
    }
    if(this.opt==3){
      this.enable=false
    }
  }
  removeoption(){
    if(this.opt>1){
      this.optionsFormArray.removeAt(0)
      this.opt=this.opt-1
    }
    if(this.opt<3){
      this.enable=true
    }
  }
  temp:any
  createPoll() {
   const obj={
   UserId :this.id,
   AddressId :5,
   Question:this.myForm.value.question,
   Opt1:this.myForm.value.opt1,
   Opt2:this.myForm.value.opt2,
   Opt3:this.myForm.value?.options[0],
   Opt4:this.myForm.value?.options[1]
   }
   if(obj.Opt3==undefined || obj.Opt4==undefined){
    obj.Opt3=null
    obj.Opt4=null
   }
   this.apicall.AddNewPolls(obj).subscribe({
    next: (dataobj) => {
      this.temp = dataobj;
      if(this.temp.success){
        alert("Poll post successfully Succcesfullyy")
        this.ngOnInit();
      }
      else{
        alert("something went wrrong")
      }
    },
    error: (e:any) => {
      console.log(e);
    },
  });
  }
  GetPollsByuserId() {
    this.apicall.GetPollsByUserId(this.id).subscribe({
      next: (dataobj) => {
        this.temp = dataobj;
        const Polls=this.temp.data
        console.log(Polls);
        
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
         
      },
      error: (e:any) => {
        console.log(e);
      },
    });
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
