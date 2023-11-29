import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileredirectService {

  constructor() { }

  private userIdSubject = new BehaviorSubject<number>(0);
  UserId$ = this.userIdSubject.asObservable();

  setUserId(userId: number): void {
    this.userIdSubject.next(userId);
  }
}
