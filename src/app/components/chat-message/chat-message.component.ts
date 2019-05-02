import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ChatMessage} from '../../models/chatMessage.model';
import {Socket} from 'ngx-socket-io';
import {ModalController, PopoverController} from '@ionic/angular';
import {PreviewImagePage} from '../../pages/preview-image/preview-image.page';
import {PopoverComponent} from '../popover/popover.component';
import {Conversation} from '../../models/Conversation.model';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input() message: ChatMessage;
  createdDate: Date;
  selected = false;
  @Input() chat: Conversation;
  @Input() secondColor: string;
  @Input() color: string;
  @Output() updateEmitter = new EventEmitter<{body: string, id: number}>();
  constructor(private socket: Socket, private modalCtrl: ModalController,
              private popoverController: PopoverController) { }
  @Output() value = new EventEmitter<any>();
  serverUrl = environment.url;

  ngOnInit() {
    this.createdDate = new Date(this.message.created_at);
    this.value.emit(true);
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

  onUpdate() {
    this.updateEmitter.emit({body: this.message.message_body, id: this.message.message_id});
  }

  async onPressed() {
    this.selected = true;
    const popover = await this.popoverController.create({
      component: PopoverComponent, componentProps: {isMine: this.message.isMine, isPreview: false}
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data) {
      switch (data.result) {
        case 'update': this.onUpdate();
        break;
        case 'delete': this.deleteMessage(this.message.conversations_id, this.message.message_id);
      }
    }
    this.selected = false;
  }

}
