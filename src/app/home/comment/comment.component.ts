import { Component } from '@angular/core';
import { SignalrserviceService } from '../service/signalrservice.service';
import { ApicallService } from '../service/apicall.service';
import { AddressServiceService } from '../service/address-service.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent {
  isActive: boolean = false;
  userImage = localStorage.getItem('avtar_Url');
  newComment: any;
  articleId: any;
  temp: any;
  Replyusername: any
  ReplyComment: any;
  Replysection = false;
  nestedComment_id = null
  PageIndex = 1
  isViewReply: { [key: number]: boolean } = {};
  ReplyPageIndex = 1
  commentid: any
  comments: { [articleId: number]: any[] } = {};
  Replycomments: { [CommentId: number]: any[] } = {};
  tempid = localStorage.getItem('userId');
  id = this.tempid !== null ? parseInt(this.tempid) : 0;
  constructor(
    private signalRService: SignalrserviceService,
    private homeapiserv: ApicallService,
    private addresServoce: AddressServiceService
  ) { }
  ngOnInit() {
    this.signalRService.startConnection().subscribe(() => {
      console.log('Connection established');
      this.receiveComments();
    });
    this.addresServoce.articleId$.subscribe((id) => {
      this.articleId = id;
      if (!this.comments[this.articleId]) {
        this.comments[this.articleId] = [];
      }
    });
    this.LoadComments();
    this.loadLikesofCommentByUser()
  }

  private receiveComments(): void {
    this.signalRService.receiveComment().subscribe((comment: any) => {
      switch (comment.operation) {
        case 1:
          this.handleAddComment(comment);
          break;
        case 3:
          this.handleDeleteComment(comment);
          break;
        case 5:
          this.handleLikeComment(comment);
          break;
        default:
          console.log('Unknown operation:', comment.operation);
          break;
      }
    });
  }
  
  private handleAddComment(comment: any): void {
    if (comment.newstedComment_id === null) {
      this.addTopLevelComment(comment);
    } else {
      this.addReplyComment(comment);
    }
  }
  
  private addTopLevelComment(comment: any): void {
    if (!this.comments[comment.articleId]) {
      this.comments[comment.articleId] = [];
    }
    this.comments[comment.articleId].splice(0, 0, comment);
  }
  
  private addReplyComment(comment: any): void {
    if (!this.Replycomments[comment.newstedComment_id]) {
      this.Replycomments[comment.newstedComment_id] = [];
    }
    if (this.isViewReply[comment.newstedComment_id]) {
      this.Replycomments[comment.newstedComment_id].push(comment);
      const commentToUpdate = this.comments[this.articleId].find((c) => c.id === comment.newstedCommentId);
      commentToUpdate.totalReply++;
    } else {
      this.ViewReply(comment.newstedComment_id);
    }
  }
  
  private handleDeleteComment(comment: any): void {
    if (comment.newstedComment_id === null) {
      this.deleteTopLevelComment(comment);
    } else {
      this.deleteReplyComment(comment);
    }
  }
  
  private deleteTopLevelComment(comment: any): void {
    const topLevelComment = this.findComment(this.comments[this.articleId], comment.id);
    this.removeComment(topLevelComment, this.comments[this.articleId]);
  }
  
  private deleteReplyComment(comment: any): void {
    const replyComment = this.findComment(this.Replycomments[comment.newstedComment_id], comment.id);
    this.removeComment(replyComment, this.Replycomments[comment.newstedComment_id]);
    const commentToUpdate = this.findComment(this.comments[this.articleId], comment.newstedCommentId);
    commentToUpdate.totalReply--;
  }
  
  private handleLikeComment(comment: any): void {
    const button = document.querySelector(`#like${comment.id}`);
    if (comment.likecomment) {
      comment.totalLikes++;
    } else {
      comment.totalLikes--;
    }
  }
  
  private findComment(commentsArray: any[], commentId: number): any {
    return commentsArray.find((c) => c.id === commentId);
  }
  
  private removeComment(comment: any, commentsArray: any[]): void {
    const index = commentsArray.indexOf(comment);
    if (index !== -1) {
      commentsArray.splice(index, 1);
    } else {
      console.log('Comment not found');
    }
  }
  
  

  LoadComments() {
    const commentModel = {
      ArticleId: this.articleId,
      UserId: this.id,
      OPERATION: 2,
      PageIndex: this.PageIndex
    };
    this.homeapiserv.AddComment(commentModel).subscribe({
      next: (dataobj) => {
        console.log(dataobj);
        this.temp = dataobj;     
        if (this.temp.data.length != 0) {
          this.temp.data.forEach((item: any) => {
            item.time = this.timeAgo(new Date(item.time));
            this.comments[this.articleId].push(item);
            for (const articleId in this.comments) {
              if (this.comments.hasOwnProperty(articleId)) {
                this.isViewReply[articleId] = false;
              }
            }
          });
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  toggleButtonState(): void {
    this.isActive = !this.isActive;
  }
  addComment() {

    if (this.newComment.trim() !== '') {
      const commentModel = {
        Comment: this.newComment,
        ArticleId: this.articleId,
        UserId: this.id,
        AvatarUrl: this.userImage || '',
        Username: localStorage.getItem('UserName') || '',
        newstedComment_id: this.nestedComment_id,
        Time: new Date(),
        OPERATION: 1,
      };
      console.log(commentModel);
      this.signalRService.sendComment(commentModel);
      this.newComment = '';
      this.nestedComment_id = null
      this.Replysection = false
    }
  }
  timeAgo(date: any) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
      return interval + ' year' + (interval === 1 ? '' : 's') + ' ago';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + ' month' + (interval === 1 ? '' : 's') + ' ago';
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + ' day' + (interval === 1 ? '' : 's') + ' ago';
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + ' hour' + (interval === 1 ? '' : 's') + ' ago';
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + ' minute' + (interval === 1 ? '' : 's') + ' ago';
    }
    return (
      Math.floor(seconds) + ' second' + (seconds === 1 ? '' : 's') + ' ago'
    );
  }


  DeleteComment(id: any,maincommentId:any) {
    let value=maincommentId
   
    const commentModel = {
      Id: id,
      OPERATION: 3,
      isDelete: true,
      newstedComment_id: value
    };
    console.log(commentModel)
    this.signalRService.sendComment(commentModel);
  }

  Replyclick(id: any, comment: any, UserName: any) {
    this.nestedComment_id = id
    this.ReplyComment = comment;
    this.Replysection = true
    this.Replyusername = UserName
  }
  closeReplySection() {
    this.Replysection = false;
    this.nestedComment_id=null
  }
  ViewMore() {
    this.PageIndex++
    this.LoadComments()
  }
  ReplyViewMore(id:any) {
    debugger
    this.ReplyPageIndex++
    this.ViewReply(id)
  }
  ViewReply(Commentid: any) {
    this.commentid = Commentid
    if (!this.Replycomments[this.commentid]) {
      this.Replycomments[this.commentid] = [];
    }

    this.isViewReply[this.commentid]=true
    const commentModel = {
      Id: this.commentid,
      OPERATION: 4,
      ReplyPageIndex: this.ReplyPageIndex
    };
    this.homeapiserv.AddComment(commentModel).subscribe({
      next: (dataobj) => {
        debugger
        console.log(dataobj);
        this.temp = dataobj;
        if (this.temp.data.length != 0) {
          this.temp.data.forEach((item: any) => {
            item.time = this.timeAgo(new Date(item.time));
            this.Replycomments[this.commentid].push(item);
          });
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
    this.loadLikesofCommentByUser()
  }
  closeReply(id: any) {
    this.isViewReply[id]=false
    this.Replycomments[id].length = 0
  }
  heartlike(id: any, item: any) {
    let obj;
    debugger
    const button = document.querySelector(`#like${id}`);
    if (button?.classList.contains('liked')) {
      button.classList.remove('liked');
      obj = {
        UserId: this.id,
        OPERATION: 5,
        ArticleId: this.articleId,
        likecomment: false,
        id: id,
      };
      item.totalLikes--;
    } else {
      button?.classList.add('liked');
      obj = {
        UserId: this.id,
        OPERATION: 5,
        ArticleId: this.articleId,
        likecomment: true,
        id: id,
      };
      item.totalLikes++;
    }
    console.log('Sending API Request with Object:', obj);
    this.homeapiserv.AddComment(obj).subscribe({
      next: (dataobj) => {
        console.log('API Response:', dataobj);
        this.temp = dataobj;
      },
      error: (e) => {
        console.log('API Error:', e);
      },
    });
    console.log('Updated totalLikes:', item.totalLikes);
  }
  
  loadLikesofCommentByUser(){
    const obj={
      UserId: this.id,
      OPERATION: 6,
      ArticleId: this.articleId
    }
    this.homeapiserv.AddComment(obj).subscribe({
      next: (dataobj) => {
        this.temp = dataobj;
        console.log(this.temp.data)
        this.temp.data.forEach((item:any) => {
          const button = document.querySelector(`#like${item.id}`);
          button?.classList.add('liked');
      });
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

}
