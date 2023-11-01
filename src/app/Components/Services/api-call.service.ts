import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(private http: HttpClient) { }

  BaseUrl='http://localhost:5105/'

  GetUsersById(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.BaseUrl}User/GetUserBy_Id?id=${id}`)
  }
  GetUsersAddressById(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.BaseUrl}User/GetUserAddres_Id?id=${id}`)
  }
  GetDetailByPincode(Pincode: any): Observable<any[]> {
    return this.http.get<any[]>(`https://api.postalpincode.in/pincode/${Pincode}`)
  }
  AddnewAddress(obj: any) {
    return this.http.post(`${this.BaseUrl}User/AddnewAddress`, obj)
  }

  DeleteAddressById(id: any) {
    return this.http.delete(`${this.BaseUrl}User/DeleteAddressById?id=${id}`)
  }
  UpdateUserInfo(obj: any) {
    return this.http.post(`${this.BaseUrl}User/UpdateUserInfo`, obj)
  }
  updateuserAddess(obj: any) {
    return this.http.post(`${this.BaseUrl}User/updateuserAddess`, obj)
  }
  Registraion(obj: any) {
    return this.http.post(`${this.BaseUrl}User/Registration`, obj)
  }

  AddnewArticle(obj:any)
  {
   return this.http.post(`${this.BaseUrl}Posts/AddnewArticle`,obj)

  }

  GetArticleByUserId(id:any,operation:any,articleId?:any):Observable<any[]>
  { 
     var Url
    if(articleId==null){
      Url=`${this.BaseUrl}Posts/GetArticleById?id=${id}&operation=${operation}`
    }
    else{
      Url=`${this.BaseUrl}Posts/GetArticleById?id=${id}&operation=${operation}&articleId=${articleId}`
    }
   return this.http.get<any[]>(Url)
   
  }


  AddNewPolls(obj:any)
  {
   return this.http.post(`${this.BaseUrl}Posts/AddNewPolls`,obj)
  }
  GetPollsByUserId(id:any):Observable<any[]>
  {
   return this.http.get<any[]>(`${this.BaseUrl}Posts/GetpollbyuserId?id=${id}`)
  }

  PollSubmit(obj:any)
  {
   return this.http.post(`${this.BaseUrl}Posts/PollSubmit`,obj)
  }
 
  EmailVerification(obj:any)
  {
   return this.http.post(`${this.BaseUrl}User/SendOTP`,obj)
  }
  OtpVerification(obj:any)
  {
   return this.http.post(`${this.BaseUrl}User/CheckOTP`,obj)
  }
  
  
  GetUserByUserName(Username:any):Observable<any[]>
  {
   return this.http.get<any[]>(`${this.BaseUrl}User/GetUserByUsername?username=${Username}`)
  }
  GetUserByUserNameandFollow(Username:any,userid:any){
    return this.http.get<any[]>(`${this.BaseUrl}User/GetUserByUsername?username=${Username}&userid=${userid}`)
  }
}
