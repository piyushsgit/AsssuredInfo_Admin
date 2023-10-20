import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignalrserviceService {

  private hubConnection: HubConnection;
  private connectionEstablishedSubject = new BehaviorSubject<boolean>(false);
  connectionEstablished$ = this.connectionEstablishedSubject.asObservable();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5105/chatHub')
      .build();

    this.hubConnection.onclose((error) => {
      console.log('Connection closed:', error);
      this.connectionEstablishedSubject.next(false);
      this.startConnection().subscribe();
    });
  }

  startConnection(): Observable<void> {
    if (this.hubConnection.state === 'Connected') {
      console.log('Connection already established.');
      this.connectionEstablishedSubject.next(true);
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    } else {
      return new Observable<void>(observer => {
        this.hubConnection.start()
          .then(() => {
            console.log('Connection started');
            this.connectionEstablishedSubject.next(true);
            observer.next();
            observer.complete();
          })
          .catch((err: any) => {
            console.error('Error while starting connection: ' + err);
            observer.error(err);
          });
      });
    }
  }

  sendComment(commentModel: any): void {
    this.hubConnection.invoke('SendComment',commentModel);
  }

  receiveComment(): Observable<{ Comment: string, ArticleId: string,UserId: string,newstedComment_id: string,AvatarUrl: string,Username: string,OPERATION: string,Id:string,isDelete:string,likecomment:string}> {
    return new Observable<{ Comment: string, ArticleId: string,UserId: string,newstedComment_id: string,AvatarUrl: string,Username: string,OPERATION: string,Id:string ,isDelete:string,likecomment:string}>(observer => {
      this.hubConnection.on('ReceiveComment', (data: {  Comment: string, ArticleId: string,UserId: string,newstedComment_id: string,AvatarUrl: string,Username: string,OPERATION: string,Id:string,isDelete:string,likecomment:string}) => {
        console.log('Received data:', data);
        observer.next(data);
      });
    });
  }
  }


