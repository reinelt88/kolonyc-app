import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgCalendarModule  } from 'ionic2-calendar';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import { environment } from '../environments/environment';
import {FCM} from '@ionic-native/fcm/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Base64ToGallery} from '@ionic-native/base64-to-gallery/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {PayPal} from '@ionic-native/paypal/ngx';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {SpeechRecognition} from '@ionic-native/speech-recognition/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    NgCalendarModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    IonicStorageModule.forRoot({
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FCM,
    Keyboard,
    AndroidPermissions,
    Base64ToGallery,
    SpeechRecognition,
    Camera,
    ImagePicker,
    CallNumber,
    PhotoViewer,
    Keyboard,
    PayPal,
    BarcodeScanner,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
