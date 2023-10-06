import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(private http: HttpClient) { }

  GetUsersById(id: any): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5105/User/GetUserBy_Id?id=${id}`)
  }
  GetUsersAddressById(id: any): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5105/User/GetUserAddres_Id?id=${id}`)
  }
  GetDetailByPincode(Pincode: any): Observable<any[]> {
    return this.http.get<any[]>(`https://api.postalpincode.in/pincode/${Pincode}`)
  }
  AddnewAddress(obj: any) {
    return this.http.post('http://localhost:5105/User/AddnewAddress', obj)
  }

  DeleteAddressById(id: any) {
    return this.http.delete(`http://localhost:5105/User/DeleteAddressById?id=${id}`)
  }
  UpdateUserInfo(obj: any) {
    return this.http.post('http://localhost:5105/User/UpdateUserInfo', obj)
  }
  updateuserAddess(obj: any) {
    return this.http.post('http://localhost:5105/User/updateuserAddess', obj)
  }
  Registraion(obj: any) {
    return this.http.post('http://localhost:5105/User/Registration', obj)
  }
  AddnewArticle(obj:any)
  {
   return this.http.post('http://localhost:5105/Posts/AddnewArticle',obj)
  }

  GetArticleByUserId(id:any):Observable<any[]>
  {
   return this.http.get<any[]>(`http://localhost:5105/Posts/GetArticleById?id=${id}`)
  }
  AddNewPolls(obj:any)
  {
   return this.http.post('http://localhost:5105/Posts/AddNewPolls',obj)
  }
  GetPollsByUserId(id:any):Observable<any[]>
  {
   return this.http.get<any[]>(`http://localhost:5105/Posts/GetpollbyuserId?id=${id}`)
  }
  PollSubmit(obj:any)
  {
   return this.http.post('http://localhost:5105/Posts/PollSubmit',obj)
  }
}


