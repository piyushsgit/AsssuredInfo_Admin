import { Component, ViewEncapsulation } from '@angular/core';
import { ApiCallService } from '../../Services/api-call.service';
import { SignalrserviceService } from 'src/app/home/service/signalrservice.service';
import { ProfileredirectService } from '../../shared/profileredirect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {
tempid = localStorage.getItem('userId');
userName=localStorage.getItem('UserName');
UserImage=localStorage.getItem('avtar_Url');
id = this.tempid !== null ? parseInt(this.tempid) : 0;
userId=this.id
tabChanges:number=1;
temp:any
UserData:any
follow=true;
FollowerData:any
FollowerDetail:any
obj:any
OwnProfile=true
Otherusername:any
followtype:any=false
  constructor(private ApiService:ApiCallService,private signalr:SignalrserviceService,
    private profileredirect:ProfileredirectService,private router:Router
    ,private route:ActivatedRoute,private messageService: MessageService){}
  
ngOnInit(){
  this.signalr.startConnection().subscribe(() => {
    console.log('Connection established');
    this.recieveFollowUnfollowRequest()
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
      this.GetUserById()
    }
  });
}
recieveFollowUnfollowRequest(){
  this.signalr.RecieveFollowRequest().subscribe({
    next:(data)=>{
      this.temp=data
      console.log("Recieve follow",this.temp);
      
    }
  })
}

GetUserById(){
    this.ApiService.GetUsersById(this.id).subscribe({
      next: (dataobj) => {
        this.temp=dataobj
        this.UserData=this.temp.data[0]
      },
      error:(e)=>{
        console.log(e);
      }
      });
  }

  GetUserByUserName(username:string){
    this.Otherusername=username
    this.ApiService.GetUserByUserNameandFollow(username,this.userId).subscribe({
      next: (dataobj) => {
        debugger
        this.temp=dataobj
        this.UserData=this.temp.data[0]
        if(this.UserData.followResult===1)
        {
          this.follow=false
        }
        this.FollowerData=this.UserData
      },
      error:(e)=>{
        console.log(e);
      }
      });
  }

  PostClick(){
    this.tabChanges=1
    var about =document.getElementById('about') 
    about?.classList.remove("active")
    var about =document.getElementById('poll') 
    about?.classList.remove("active")
    var bookmark =document.getElementById('bookmark') 
    bookmark?.classList.remove("active")
    var post=document.getElementById('post') 
    post?.classList.add("active")
  }
  PollClick(){
    this.tabChanges=2
    var about =document.getElementById('about') 
    about?.classList.remove("active")
    var about =document.getElementById('post') 
    about?.classList.remove("active")
    var bookmark =document.getElementById('bookmark') 
    bookmark?.classList.remove("active")
    var post=document.getElementById('poll') 
    post?.classList.add("active")
  }
AboutClick(){
    this.tabChanges=3
    var post=document.getElementById('post') 
    post?.classList.remove("active")
    var post=document.getElementById('poll') 
    post?.classList.remove("active")
    var bookmark =document.getElementById('bookmark') 
    bookmark?.classList.remove("active")
    var about =document.getElementById('about') 
    about?.classList.add("active")
  }
progressValue: number = 45;
  getProgressColorClass(): string {
    if (this.progressValue < 40) {
      return 'backgroundlow'; 
    } else if (this.progressValue < 80) {
      return 'backgroundmedium'; 
    } else {
      return 'backgroundhigh'; 
    }
}

FollowClick(){
  this.follow=false
  this.obj={
    FollowerId:this.userId,
    FollowingId:this.FollowerData.userId,
    Mode:1,
    Follower_Username :this.userName,
    Follower_avatar_url:this.UserImage
  }
   this.signalr.SendFollowRequest(this.obj)
   this.GetUserByUserName(this.Otherusername)
} 
UnFollowClick(){
  this.follow=true
  this.obj={
    FollowerId:this.userId,
    FollowingId:this.FollowerData.userId,
    Mode:2,
    Follower_Username :this.userName,
    Follower_avatar_url:this.UserImage
  }  
   this.signalr.SendFollowRequest(this.obj)
   this.GetUserByUserName(this.Otherusername)
}
 
GetFollowDetail(type:any){
  this.followtype=type
    const obj={
      Mode:3,
      userid:this.userId,
      type:type
    }
  this.ApiService.GetFollowerFollowing(obj).subscribe({
    next: (dataobj) => {
      this.temp=dataobj
     this.FollowerDetail=this.temp.data
     console.log(this.FollowerDetail);
     
    },
    error:(e)=>{
      console.log(e);
    }
    });
}
BookmarkClick(){
  this.tabChanges=4
  var post=document.getElementById('post') 
  post?.classList.remove("active")
  var post=document.getElementById('poll') 
  post?.classList.remove("active")
  var about =document.getElementById('about') 
  about?.classList.remove("active")
  var bookmark =document.getElementById('bookmark') 
  bookmark?.classList.add("active")
}

ProfileRedirect(Username:any)
{
this.router.navigate(['profile'],{
  queryParams: {
   View:Username
  }
})
}
public selectedImageIndex: number = -1;

public selectImage(index: number): void {
  this.selectedImageIndex = index;
}

avtar_url:any
avatarvalue(value:any){
  this.avtar_url=value 
}
UpdateAvtar(){
  if(this.avtar_url!==undefined || null ||''){
  const obj={
    id:this.userId,
    avtar_url:this.avtar_url
  }
    this.ApiService.UpdateUserInfo(obj).subscribe({
      next:(dataobj)=>{
        this.temp=dataobj
        if(this.temp.success){
          this.messageService.add({ severity: 'success', summary: 'Avatar updated Successfully', detail: '' });
          this.GetUserById()
        }
      },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Something went Wrong', detail: err });
        
      }
    })
}
else{
  this.messageService.add({ severity: 'error', summary: 'Please Select an avatar' });
}
}




image_links = [
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=826&t=st=1699353851~exp=1699354451~hmac=4b42798cb4b483af92534c3aa86e360f35df3a2d4cefd4bcd23a425e7b687fe8",
  "https://img.freepik.com/free-vector/head-man_1308-33466.jpg?w=740&t=st=1699353870~exp=1699354470~hmac=350ca9337e8520df34c78fbf266659e98382d67f530087e507201c73a75c5180",
  "https://img.freepik.com/free-vector/handsome-man_1308-85984.jpg?w=826&t=st=1699353893~exp=1699354493~hmac=e267feb57b14e43260fb2c6880a22ad99d24e17ad88ff2dd93a5aa45bc284b33",
  "https://img.freepik.com/free-photo/view-3d-confident-businessman_23-2150709932.jpg?t=st=1699351175~exp=1699354775~hmac=1a2a11813177628bea3fe8e0a6749feff14e8ff43361fc179185509e6651d622&w=826",
  "https://img.freepik.com/free-photo/3d-render-little-boy-with-glasses-tie-white-background_1142-32328.jpg?t=st=1699353929~exp=1699357529~hmac=549796a490445d3a98f0aca7f2295f67bcb352501fd0592cc4a5f4962baa176c&w=826",
  "https://img.freepik.com/premium-photo/person-wearing-glasses_500927-366.jpg?w=740",
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?w=826&t=st=1699354006~exp=1699354606~hmac=4eb2922caa08b7db502dbf08975117470429638b797bba01995ee52d94f27898",
  "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833572.jpg?w=826&t=st=1699354026~exp=1699354626~hmac=f62789e90b2ff6ce42853990afdcdf917636b699d3879bdc1bff84c559819f12",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436180.jpg?w=826&t=st=1699354043~exp=1699354643~hmac=ec8fc7dc4c9adfeb34a315e5afe35d1157ae0029793fc9d117f412dd902ced44",
  "https://img.freepik.com/free-psd/3d-rendering-boy-avatar-emoji_23-2150603406.jpg?w=826&t=st=1699354058~exp=1699354658~hmac=2209a3a5f05cef32feb66dc2c592fef8e887f63e762327dd2edc0e28c898cec8",
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671136.jpg?w=826&t=st=1699354069~exp=1699354669~hmac=e8aaa81224686267f10863f7ec8277b24987184b2b13e314a66d072ca107984f",
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671151.jpg?w=826&t=st=1699354079~exp=1699354679~hmac=37ef14d59fc86e92af4835c4141e21e420dc940c320f21422ea3104e004d6eac",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436178.jpg?w=826&t=st=1699354095~exp=1699354695~hmac=ce52075d6aa9f55a81528f994e6446ab057517a903ec2857460a9fc99de5c298",
  "https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611740.jpg?w=826&t=st=1699354110~exp=1699354710~hmac=bdb6069b492314df0bd2fe7b6062f05b8e4acc72370bd930c68434cc011c58d5",
  "https://img.freepik.com/free-photo/view-3d-shocked-man-with-mouth-wide-open_23-2150709970.jpg?t=st=1699354121~exp=1699357721~hmac=0b7d52cd488f67443f059344dc4f760cc1683e49d43b80319f901ff753597341&w=826",
  "https://img.freepik.com/free-photo/young-adult-caucasian-woman-outdoors-fashion-portrait-generative-ai_188544-7660.jpg?w=740&t=st=1699354140~exp=1699354740~hmac=9f71bd43ee0618271a05e9f287722c9030e4b80d65585b14269d1d7f46f8816a",
  "https://img.freepik.com/free-vector/jay-shri-ram-happy-hanuman-jayanti-festival-card-background_1035-26527.jpg?w=826&t=st=1699354153~exp=1699354753~hmac=e8142bd348874ec4ab86cbfb8cc4291b5554cca90633746c513e44cb0695aabe",
  "https://img.freepik.com/premium-photo/cartoon-character-with-blue-shirt-glasses_561641-2084.jpg?w=826",
  "https://img.freepik.com/premium-photo/cartoon-character-with-blue-shirt-glasses_561641-2088.jpg?w=826",
  "https://img.freepik.com/free-photo/view-smiling-3d-man-using-tablet_23-2150709866.jpg?t=st=1699354201~exp=1699357801~hmac=fb5e3f33dbead679841c8306a1d58e333420a3eef46e169402a53d619ad5b077&w=826",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-rainbow-sunglasses_23-2149436196.jpg?w=826&t=st=1699354218~exp=1699354818~hmac=305d9b7979a6cf681a5736b5134745bc143b79c4736a804d5825cd7bcd309c58",
  "https://img.freepik.com/premium-photo/illustration-happy-janmashtami-cute-baby-krishna-animated-cartoon-lord-krishna-generative-ai_837518-804.jpg?w=826",
  "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833536.jpg?w=826&t=st=1699354251~exp=1699354851~hmac=b99d56a133aa4413bb5f9187a211b369e94d7be69899d5fb8611f7a121af7f52",
  "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833580.jpg?w=826&t=st=1699354260~exp=1699354860~hmac=ef643b3bcfec6902c3ac1287b11e09b67c421cb139b3c22c57afdd22a4da82ca",
  "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833554.jpg?w=826&t=st=1699354287~exp=1699354887~hmac=eab7dead7a2bf75b4f38e4292e00d92175f946b5ae5113cd4d57a2e3330dadcf",
  "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833584.jpg?w=826&t=st=1699354299~exp=1699354899~hmac=ad799cb5b59534276e20c682a2050d8413ec5a2b99feffe74ac1d5f324751b78",
  "https://img.freepik.com/free-photo/portrait-woman-with-dark-skin-light-her-face_1340-37567.jpg?t=st=1699354312~exp=1699357912~hmac=24162993191aaba33ae74ecab26584037deec1b4ba55c3d4dcf1b9d5d882c231&w=740",
  "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833562.jpg?w=826&t=st=1699354327~exp=1699354927~hmac=083d4783bf275c96e53d4bb455edefdec7beedcded7f8768b9cfcbc5d1721701",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436189.jpg?w=826&t=st=1699354344~exp=1699354944~hmac=9168fd871a91674f873f9b5abe38c5e154fe872196dbfd9ecaa97c7370f822d7",
  "https://img.freepik.com/premium-photo/digital-art-selected_771335-49726.jpg?w=826",
  "https://img.freepik.com/free-vector/mysterious-mafia-man-wearing-hat_52683-34829.jpg?w=826&t=st=1699354376~exp=1699354976~hmac=364a688e24fc869b195e5786a78fcacdf0c7676cd8b266bab27f4a3d89a05d40",
  "https://img.freepik.com/free-photo/cartoon-character-with-handbag-sunglasses_71767-99.jpg?w=826&t=st=1699354392~exp=1699354992~hmac=b7c7d6b63c406f617835f06de5adb8c5ffd123513bb85ab1132b89fa2649cc06",
  "https://img.freepik.com/premium-photo/digital-art-selected_771703-4038.jpg?w=740",
  "https://img.freepik.com/premium-photo/cartoon-man_808092-4378.jpg?w=740",
  "https://img.freepik.com/free-photo/view-3d-happy-woman-with-mouth-wide-open_23-2150709950.jpg?t=st=1699352251~exp=1699355851~hmac=27bd8e92d8e9ab792b4eac95a0fa9463a34909f0bf84658c8ab90825beda47ff&w=826",
  "https://img.freepik.com/free-photo/girl-field-flowers_1340-40305.jpg?t=st=1699354447~exp=1699358047~hmac=2e32bb75b06cd1d228ccdc4f50a299c39775e935af98eab42f4b26cad72f046f&w=740",
  "https://img.freepik.com/free-photo/view-3d-woman_23-2150709984.jpg?t=st=1699354463~exp=1699358063~hmac=2a1d13e8b8cdc56ef66151be5a0786893a3beb79dc3e41c10beaf948c2181f35&w=826",
  "https://img.freepik.com/premium-photo/cartoon-character-with-headphones-that-says-i-m-little-girl_921810-3.jpg?w=826",
  "https://img.freepik.com/free-vector/jay-shri-ram-happy-hanuman-jayanti-festival-card-background_1035-26500.jpg?w=826&t=st=1699354498~exp=1699355098~hmac=15ae0308736820ece465d032f3a8afc7ad8b035ad233f9672992a6ab879b1c32",
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671153.jpg?w=826&t=st=1699354667~exp=1699355267~hmac=d2ccb508f1cc56824e981e27a81a0c871fc025369a8998314e0f67e77013b307",
  "https://img.freepik.com/free-photo/3d-illustration-cartoon-female-tourist-with-camera_1142-32317.jpg?t=st=1699354685~exp=1699358285~hmac=41218f2fc033c7c2899f6cc58bbf0b345a0e903fc921ebf52020a78a859cb737&w=826",
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671124.jpg?w=826&t=st=1699354702~exp=1699355302~hmac=1517c11f7f9124640bc232ada40dbc96b67bf3dc9e0a7912b609ece960245ccf	"
]

}
