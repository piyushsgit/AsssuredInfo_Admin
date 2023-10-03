import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment'; 
import { Observable, shareReplay, tap } from 'rxjs';
import { User } from 'src/app/Models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient,private router:Router) { 
    
  }

  login(userNameOrEmail: string, password: string): Observable<any> {
    return this.http.post<User>('http://localhost:5105/User/Login', { userNameOrEmail, password })
      .pipe(
        tap((response: any) => {
          this.setSession(response);
        }),
        shareReplay()
      );
  }  
  private setSession(authResult: any) {
    const providedDate = new Date(authResult.data.tokenExpiryTime);
    const currentDate = new Date();
    const timeDifference = providedDate.getTime() - currentDate.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);  
    const expiresAt = moment().add(secondsDifference, 'second');
    localStorage.setItem('id_token', authResult.data.jwtToken);
    localStorage.setItem("expires_at",secondsDifference.toString());
  }
  
logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.router.navigateByUrl('');
}

public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
}

isLoggedOut() {
    return !this.isLoggedIn();
}

getExpiration() {
    const expiration = localStorage.getItem("expires_at") ||'';
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
} 
}
 

