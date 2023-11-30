import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../Components/shared/confirm.service';  
import { FormsModule } from '@angular/forms';  
import { ApiCallService } from '../Components/Services/api-call.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AddressServiceService } from '../home/service/address-service.service';
import { AuthService } from '../Components/Services/auth.service';
 
@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
    animations: [
    trigger('slideDown', [
      state('void', style({ transform: 'translateY(-80%)', opacity: 0 })),
      state('*', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void => *', animate('500ms ease-in')),
      transition('* => void', animate('500ms ease-out'))
    ])
  ]
})
export class SettingComponent {  
  password: boolean = false;
  username:boolean = false; 
  setColor:boolean=false;
  emailverifieddata =false;
  selectedColorCombo: {id:number, darkColor: string, lightColor: string } | null = null;
  selectedTheme: any; 
  colorcombo:any;
  predefineTheme:any;
  formData: {
    username: string;
    password: string;
  } = {
    username: localStorage.getItem('UserName') || '', 
    password: '11111111', 
  }; 
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
  constructor(private confirmService: ConfirmService, private api:  ApiCallService,private sharedservice:AddressServiceService  ,public auth: AuthService) { }
  ngOnInit() {
  this.getResponse();  
  this.predefineTheme = localStorage.getItem('themeid');
  // this.sharedservice.SetColor$.subscribe(data => {
  //   this.colorcombo = this.colorCombinations.find(T => T.id == data); 
  //   this.selectColor(this.colorcombo);
  // });
  
  }
  VerifyEmail(con: string, req: number) {
    this.confirmService.confirm(con, req); 
  }
  selectColor(colorCombo: {id:number,  darkColor: string, lightColor: string }) { 
    document.documentElement.style.setProperty('--DBlue', colorCombo.darkColor);
    document.documentElement.style.setProperty('--LBlue', colorCombo.lightColor); 
    this.selectedColorCombo = colorCombo;
    localStorage.setItem('themeid',colorCombo.id.toString());
    this.setColor = true;
    this.sharedservice.setcolorId(colorCombo.id)
  }
  getResponse(){
    this.confirmService.getndata$.subscribe(data=>{ 
     if(parseInt(data)==3){
      this.password=true
     }
     else if(parseInt(data)==4){ 
      this.username=true;
     }
     else if(parseInt(data)==5)
     {
        this.emailverifieddata=true
     }
     else if(parseInt(data)==6)
     {
        this.emailverifieddata=false
     }
     else if(parseInt(data)==1){
      this.emailverifieddata=true
     }
    })
  }
 
  onSubmit() {
    let formdata
    if (this.password){
      formdata = { 
        id:localStorage.getItem('userId'),
        password: this.formData.password,
      }; 
    }else if(this.username){
      formdata = { 
        id:localStorage.getItem('userId'),
        username: this.formData.username,
      };
    }
    else{
      formdata = { 
        id:localStorage.getItem('userId'),
        themeid: this.selectedColorCombo?.id,
      };
    }
    this.api.UpdateUserInfo(formdata).subscribe(
      (response) => {
        console.log('Form data successfully posted:', response);
        this.setColor = false;
        this.password = false;
        this.username = false; 
     
      },
      (error) => {
        console.error('Error posting form data:', error);
      }
    );
 
  
  }

}