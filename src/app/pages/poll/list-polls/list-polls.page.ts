import {Component, OnInit} from '@angular/core';
import {BasePage} from '../../base/base.page';
import {LoadingController, ToastController} from '@ionic/angular';
import {StorageService} from '../../../sharedServices/storage.service';
import {PollService} from '../poll.service';
import {timer} from 'rxjs';

@Component({
  selector: 'app-list-polls',
  templateUrl: './list-polls.page.html',
  styleUrls: ['./list-polls.page.scss'],
})
export class ListPollsPage extends BasePage implements OnInit {

  public polls = [];

  constructor(
    private loadingController: LoadingController,
    private pollService: PollService,
    protected toastController: ToastController,
    protected storageService: StorageService,
  ) {
    super(storageService, toastController);
  }

  ngOnInit() {
    timer(1000).subscribe(() => {
      this.user = this.savedUser;
      this.loadPolls();
    });
  }

  async loadPolls() {

    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading',
      showBackdrop: false,
      translucent: true,
    });

    await loading.present();

    this.pollService.getAll(this.user.colonyId).subscribe(res => {
      this.polls = res;
    });

    loading.dismiss();
  }

}
