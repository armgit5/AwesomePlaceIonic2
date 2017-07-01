import { Component } from '@angular/core';
import { ToastController, LoadingController, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NgForm } from "@angular/forms/forms";
import { SetLocation } from '../set-location/set-location';
import { Location } from '../../models/location';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { PlacesService } from '../../services/places';
import { File } from '@ionic-native/file';

/**
 * Generated class for the AddPlace page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlace {

  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  }

  locationIsSet = false;

  imageUrl = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private modalCtrl: ModalController,
              private geolocation: Geolocation,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private placesService: PlacesService,
              private file: File) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlace');
  }

  onSubmit(form: NgForm) {
    this.placesService.addPlace(form.value.title, form.value.description, 
        this.location, this.imageUrl);
    form.reset();
    this.location = {
      lat: 40.7624324,
      lng: -73.9759827
    }
    this.imageUrl = '';
    this.locationIsSet = false;
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocation, 
        {location: this.location, isSet: this.locationIsSet});
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    );
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content: 'Getting your Location...'
    });
    loader.present();
    this.geolocation.getCurrentPosition().then(
      location => {
        loader.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.locationIsSet = true;
    }).catch((error) => {
      loader.dismiss();
      const toast = this.toastCtrl.create({
        message: 'Could not get location, please pick it manually',
        duration: 2500
      });
      console.log('Error getting location', error);
      toast.present();
    });
  }

  onTakePhoto() {
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
    .then(
      imageData => {
        const currentName = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        const newFileName = new Date().getUTCMilliseconds() + '.jpg';

        console.log("current name and path");
        // console.log(currentName);
        // console.log(path);
        // console.log(`1 ${imageData}`);

        this.file.moveFile(path, currentName, this.file.dataDirectory, newFileName)
          .then(
            data => {
              this.imageUrl = data.nativeURL;
              // console.log(`2 ${data.nativeURL}`);
              this.camera.cleanup();
              // console.log(`3 ${imageData}`);
            }
          )
          .catch(
            err => {
              this.imageUrl = '';
              const toast = this.toastCtrl.create({
                message: 'Could not save this image. Please try again.',
                duration: 2500
              });
              toast.present();
              this.camera.cleanup();
            }  
          );
        this.imageUrl = imageData;
        // console.log(`4 ${imageData}`);

      }
    )
    .catch(
      err => {
        const toast = this.toastCtrl.create({
          message: 'Could not take this image. Please try again.',
          duration: 2500
        });
        toast.present();
      }
    );
  }

}
