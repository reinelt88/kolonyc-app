import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../sharedServices/auth.service';
import {User} from '../../models/user';
import {MenuController} from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    user: User = {
        uid: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        profilePicture: 'https://firebasestorage.googleapis.com/v0/b/colonyc-14f60.appspot.com/o/' +
          'no-image.PNG?alt=media&token=f40787bf-1ff9-4888-bf06-6f02d5a2123a',
        displayName: '',
        colonyId: '',
        token: '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

  constructor(
      private authService: AuthService,
      private router: Router,
      private menuController: MenuController
  ) {
    // menuController.enable(false);
  }

  ngOnInit() {
  }

  async onRegister() {

    const user = await this.authService.onRegister(this.user);
    if (user) {
      console.log('User created successfully', user);
      this.router.navigateByUrl('/');
    }
  }

}
