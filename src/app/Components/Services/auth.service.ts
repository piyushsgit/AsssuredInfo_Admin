 
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment'; 
import { Observable, shareReplay, tap } from 'rxjs';
import { User } from 'src/app/Models/user';
import { SignalrserviceService } from 'src/app/home/service/signalrservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient,private router:Router,private signalr:SignalrserviceService) { 
    
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
  // private setSession(authResult: any) {
    // const providedDate = new Date();
    // const currentDate = new Date();
    // const timeDifference = providedDate.getTime() - currentDate.getTime();
    // const secondsDifference = Math.floor(timeDifference / 1000);  
  //   const expiresAt = moment().add(authResult.data.tokenExpiryTime, 'second');
  //   localStorage.setItem('id_token', authResult.data.jwtToken);
  //   localStorage.setItem("expires_at", this.getExpiration expiresAt);
  // }
  private setSession(authResult: any) {
    const expiresAt = new Date(authResult.data.tokenExpiryTime);
    localStorage.setItem('id_token', authResult.data.jwtToken);
    localStorage.setItem('expires_at', expiresAt.toString()||'0001-01-01T00:00:00');
    localStorage.setItem('UserName',authResult.data.userName)
    localStorage.setItem('userId', authResult.data.userId.toString());
    localStorage.setItem('email',authResult.data.email)
    localStorage.setItem('avtar_Url',authResult.data.avtar_Url)
  } 
logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem('avtar_Url');
    localStorage.removeItem('UserName');
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
 

