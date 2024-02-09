import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  GetNationalArticle(): Observable<any[]> 
  {
   return this.http.get<any>('https://newsapi.org/v2/top-headlines?country=in&apiKey=4049b04a911d4d2fa7b76a9bc7c6d5f5')
  }
  GetNotification(Obj:any):Observable<any[]>{
    const headers = new HttpHeaders().set('Skip-Loader', 'true');
    return this.http.post<any>('http://localhost:5105/Follow/ManageNotification',Obj,{headers})
  }
  
}
