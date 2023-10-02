import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment'; 
import { Observable, shareReplay, tap } from 'rxjs';
import { User } from 'src/app/Models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(userNameOrEmail: string, password: string): Observable<any> {
    return this.http.post<User>('http://localhost:5105/User/Login', { userNameOrEmail, password })
      .pipe(
        tap((response: any) => {
          this.setSession(response);
        }),
        shareReplay()
      );
  }  
private setSession(authResult:any) {
    const expiresAt = moment().add(authResult.expiresIn,'second'); 
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
}          

logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
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
 

