import {Injectable} from '@angular/core';
import {LoadingController, Platform} from '@ionic/angular';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {Observable} from 'rxjs';
import {Events} from './events.service';
import firebase from 'firebase/app';
import 'firebase/storage';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    constructor(
        private loadingController: LoadingController,
        private camera: Camera,
        private imagePicker: ImagePicker,
        private photoViewer: PhotoViewer,
        private events: Events,
        private platform: Platform,
    ) {

    }

    getImages(path: string, maxImages: number) {

        const options = {
            // width: 200,
            quality: 50,
            outputType: 1,
            maximumImagesCount: maxImages
        };

        this.imagePicker.getPictures(options).then((results) => {
            if (results.length > 0) {
                results.forEach(r => {
                   this.uploadImage('data:image/jpeg;base64,' + r, path);
                });
            }
        }, (err) => {
            console.log(err);
        });

        return;
    }

    async takePicture(path: string) {

        const cameraOptions: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
        };

        this.camera.getPicture(cameraOptions).then((imageData) => {
            if (imageData) {
                this.uploadImage('data:image/jpeg;base64,' + imageData, path);
            }
        }, (err) => {
            this.loadingController.dismiss();
            console.log('Error', err);
        });
    }

    uploadImage(data: string, path: string) {

        const storageRef = firebase.storage().ref();

        const filename = Math.floor(Date.now() / 1000);

        const imageRef = storageRef.child(path + '/' + filename + '.jpg');

        imageRef.putString(data, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
            snapshot.ref.getDownloadURL().then(url => {

                this.events.publish(path, url);

            });
        });
    }

    ionViewWillEnter() {
        this.imagePicker.hasReadPermission().then((hasPermission: boolean) => {
            if (!hasPermission) {
                this.imagePicker.requestReadPermission();
            }
        });
    }

    showPhoto(picture: string, name: string) {
        const options = {
            share: true, // default is false
            closeButton: false, // iOS only: default is true
            copyToReference: true, // iOS only: default is false
            headers: '',  // If this is not provided, an exception will be triggered
            piccasoOptions: { } // If this is not provided, an exception will be triggered
        };

        const srcUrl = (this.platform.is('ios')) ? decodeURIComponent(picture) : picture;

        this.photoViewer.show(srcUrl, name, options);
    }

    // CROP
    convertFileToDataURLviaFileReader(url: string) {
        return new Observable(observer => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.onload = () => {
                const reader: FileReader = new FileReader();
                reader.onloadend = () => {
                    observer.next(reader.result);
                    observer.complete();
                };
                reader.readAsDataURL(xhr.response);
            };

            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        });
    }
}
