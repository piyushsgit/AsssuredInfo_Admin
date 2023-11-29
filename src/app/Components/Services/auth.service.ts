 
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment'; 
import { Observable, shareReplay, tap } from 'rxjs';
import { User } from 'src/app/Models/user';
import { SignalrserviceService } from 'src/app/home/service/signalrservice.service';
import { ConfirmService } from '../shared/confirm.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient,private router:Router,private signalr:SignalrserviceService,private confirmserrvice:ConfirmService) { 
    
  }

  login(userNameOrEmail: string, password: string): Observable<any> {
    return this.http.post<User>('http://localhost:5105/User/Login', { userNameOrEmail, password })
      .pipe(
        tap((response: any) => {
          if(response.success){
            this.setSession(response);
          }
          
        }),
        shareReplay()
      );
  }  
 
  private setSession(authResult: any) {
    const expiresAt = new Date(authResult.data.tokenExpiryTime);
    localStorage.setItem('id_token', authResult.data.jwtToken);
    localStorage.setItem('expires_at', expiresAt.toString()||'0001-01-01T00:00:00');
    localStorage.setItem('UserName',authResult.data.userName)
    localStorage.setItem('userId', authResult.data.userId.toString());
    localStorage.setItem('email',authResult.data.email);
    localStorage.setItem('avtar_Url',authResult.data.avtar_Url);
    localStorage.setItem('themeid',authResult.data.themeid);
    localStorage.setItem('emailVerified',authResult.data.emailVerified);
    if(authResult.data.emailVerified==true){
      this.confirmserrvice.getdata("5")
    }
    else{
      this.confirmserrvice.getdata("6")
    }
 
  } 
logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem('avtar_Url');
    localStorage.removeItem('UserName');
    localStorage.removeItem('themeid');
    localStorage.removeItem('emailVerified');
    if(localStorage.getItem('emailVerified')=='true'){
      this.confirmserrvice.getdata("")
    }
    this.router.navigateByUrl('');
    this.signalr.closeConnection()
}

public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
} 
isLoggedOut() {
    return !this.isLoggedIn();
} 
getExpiration() {
    const expiration = localStorage.getItem("expires_at") ||''; 
    const expiresAt = new Date(expiration);  
    return moment(expiresAt);
} 
}
 

