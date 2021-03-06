import { Component, OnInit } from '@angular/core';
import {NavController, NavParams} from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.page.html',
  styleUrls: ['./details-modal.page.scss'],
})
export class DetailsModalPage implements OnInit {

	title: string;
  constructor(private navParams: NavParams, public modalController: ModalController) {
  	this.title = this.navParams.get('Name');
   }

  ngOnInit() {
  }

  updateName() {
    if (this.title.trim().length < 0) {
      return;
    } else {
      this.modalController.dismiss({result: 'ok', Name: this.title.trim()});
    }
  }

    modalCancel() {
      this.modalController.dismiss({result: 'cancel'});
    }


}
