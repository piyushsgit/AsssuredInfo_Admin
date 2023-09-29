import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ApiCallService } from '../../Services/api-call.service';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent {
  constructor(private fb: FormBuilder,private apicall:ApiCallService) {}
  myForm:any
  opt:number=1
  enable=true
  options:any
  id=27
  formattedPolls:any
  Optionsformated:any
  ngOnInit() {
    this.myForm = this.fb.group({
      question: '',
      opt1:'',
      opt2:'',
      isChecked:false,
      options: this.fb.array([]),
    });
    this.GetPollsByuserId()
  }

  get optionsFormArray() {
    return this.myForm.get('options') as FormArray;
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
   UserId :27,
   AddressId :5,
   Question:this.myForm.value.question,
   IsMultipleSelect:this.myForm.value.isChecked,
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
        console.log(this.temp.data);
         this.formattedPolls = Polls.map((poll:any) => {
          this.options = [];
          const optionLikes = [];
          for (let i = 1; i <= 4; i++) {
            const optionKey = `opt${i}`;
            const optionLikeKey = `opt${i}Like`;
            if (poll[optionKey] !== null) {
              this.options.push(poll[optionKey]);
              optionLikes.push(poll[optionKey]);
            }
          }
          return {
            id: poll.id,
            addressId: poll.addressId,
            createdOn: poll.createdOn,
            isMultipleSelect: poll.isMultipleSelect,
            question: poll.question,
            options: this.options,
            optionLikes: optionLikes,
          };
        });    
        console.log(this.formattedPolls);
        console.log(this.formattedPolls.options);
         
      },
      error: (e:any) => {
        console.log(e);
      },
    });
  }
}
