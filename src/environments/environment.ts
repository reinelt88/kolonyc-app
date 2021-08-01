// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  fcmUrl: 'https://fcm.googleapis.com/fcm/send',
  fcmToken: 'AAAAskCpXng:APA91bFXMecTkfojuA84w2UDCYjDc_DzkYHTor1qsNK7T4_G4GkgRXsYRgj2qAX9bEqEgtNnBKL4r268L8pBIKrtqtReEc_IlGGhJoDRl35xXl8D8cRCfNI1CNyiftxLixN1xP6Cjgdl',
  functionUrl: 'https://us-central1-colonyc-dev.cloudfunctions.net',
  firebaseConfig: {
    apiKey: 'AIzaSyB1CwlchqDDIp-W4WvOeVL6AIBu14wm-V4',
    authDomain: 'colonyc-dev.firebaseapp.com',
    databaseURL: 'https://colonyc-dev.firebaseio.com',
    projectId: 'colonyc-dev',
    storageBucket: 'colonyc-dev.appspot.com',
    messagingSenderId: '765589020280',
    appId: '1:765589020280:web:4a3ba40fd0c1785fc0978d'
  },
  enableAuth: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
