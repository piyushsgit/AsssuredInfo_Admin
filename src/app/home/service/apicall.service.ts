import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApicallService {

  constructor(private http:HttpClient) { }

  GetArticle(obj:any)
  {
   return this.http.post('http://localhost:5105/Posts/GetArticleOnHomePage',obj)
  }
  Getpoll(obj:any){
    return this.http.post('http://localhost:5105/Posts/GetPollsOnHomePage',obj)
  }
  ManageLikeDislike(obj:any){
    return this.http.post('http://localhost:5105/Posts/LikeDislike',obj)
  }
}
