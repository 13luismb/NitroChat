import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ChatMessage} from '../../models/chatMessage.model';
import {Socket} from 'ngx-socket-io';
import {ModalController} from '@ionic/angular';
import {PreviewImagePage} from '../../pages/preview-image/preview-image.page';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input() message: ChatMessage;
  createdDate: Date;
  color: string;
  serverUrl = environment.url;
  colorArr = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'dark'];
  constructor(private socket: Socket, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.color = this.colorArr[Math.floor(Math.random() * this.colorArr.length) - 1];
    this.createdDate = new Date(this.message.created_at);
  }

  deleteMessage (chat, id) {
    this.socket.emit('delete-msg', {room: `chat ${chat}`, chatId: chat, messageId: id});
  }

  async previewImg() {
  const modal = await this.modalCtrl.create({
    component: PreviewImagePage,
    componentProps: { image: this.message.message_attachment}});
    await modal.present();
  }

}
