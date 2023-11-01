import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignalrserviceService {

  private hubConnection: HubConnection;
  private connectionEstablishedSubject = new BehaviorSubject<boolean>(false);
  connectionEstablished$ = this.connectionEstablishedSubject.asObservable();
 temp:any
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
            const connectionId = this.hubConnection.connectionId;
            console.log("Connection ID: " + connectionId);
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
    this.hubConnection.invoke('ManageComment',commentModel);
  }

  receiveComment(): Observable<{ Comment: string, ArticleId: string,UserId: string,newstedComment_id: string,AvatarUrl: string,Username: string,OPERATION: string,Id:string,isDelete:string,likecomment:string}> {
    return new Observable<{ Comment: string, ArticleId: string,UserId: string,newstedComment_id: string,AvatarUrl: string,Username: string,OPERATION: string,Id:string ,isDelete:string,likecomment:string}>(observer => {
      this.hubConnection.on('ReceiveComment', (data: {  Comment: string, ArticleId: string,UserId: string,newstedComment_id: string,AvatarUrl: string,Username: string,OPERATION: string,Id:string,isDelete:string,likecomment:string}) => {
        observer.next(data);
      });
    });
  }

  SendFollowRequest(Obj:any)
  {
    this.hubConnection.invoke('MaanageFollow',Obj);
  }
  UserId = localStorage.getItem("userId");

  RecieveFollowRequest(): Observable<{ FollowerId: string, FollowingId: string, Mode: string, Follower_Username: string, Follower_avatar_url: string }> {
    return new Observable<{ FollowerId: string, FollowingId: string, Mode: string, Follower_Username: string, Follower_avatar_url: string }>(observer => {
      this.hubConnection.on('RecieveFollowRequest', (data: { FollowerId: string, FollowingId: string, Mode: string, Follower_Username: string, Follower_avatar_url: string }) => {
        debugger
       this.temp=data
        if (this.temp.followingId== this.UserId) {   
          observer.next(data);
        }
      });
    });
  }
  SendLikeDislike(Obj:any)
  {
    this.hubConnection.invoke('MaanageLikeDislike',Obj);
  }

  RecieveLikeDislike(): Observable<{ ArticleUserId: string, Like: string,Dislike:string,ArticleId:string,UserId:string,Toggle:string}> {
    return new Observable<{  ArticleUserId: string, Like: string,Dislike:string,ArticleId:string,UserId:string,Toggle:string}>(observer => {
      this.hubConnection.on('RecieveLikeNotification', (data: { ArticleUserId: string, Like: string,Dislike:string,ArticleId:string ,UserId:string,Toggle:string}) => {
        debugger
          observer.next(data);
      });
    });
  }
        
  closeConnection(): void {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      this.hubConnection.stop()
        .then(() => {
          console.log('Connection closed successfully.');
        })
        .catch(error => {
          console.error('Error while closing connection: ' + error);
        });
    }
  }
  }


