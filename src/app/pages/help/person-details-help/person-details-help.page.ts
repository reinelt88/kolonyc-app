import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-person-details-help',
  templateUrl: './person-details-help.page.html',
  styleUrls: ['./person-details-help.page.scss'],
})
export class PersonDetailsHelpPage implements OnInit {

  constructor(
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
