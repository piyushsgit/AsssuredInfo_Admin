import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
  }
 
  hide() {
    timer(1000).pipe(
      switchMap(() => {
        this.loadingSubject.next(false);
        return timer(0); 
      }), 
    ).subscribe();
  }
}
