import { Component, OnInit } from '@angular/core';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
// chats: Chats[];
//   constructor(private chatService: ChatService) { }
//
//   ionViewWillEnter() {
//     this.chatService.loadChatsArray() .subscribe( chatsResponse => {
//       this.chats = chatsResponse.chats;
//     }, error1 => {
//       console.log(error1);
//     });
//   }
  ngOnInit() {
  }

}
