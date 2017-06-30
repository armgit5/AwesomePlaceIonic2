import { Component } from '@angular/core';
import {ToastController, LoadingController,  IonicPage,   NavController,   NavParams,   ModalController} from 'ionic-angular';
import { NgForm } from "@angular/forms/forms";
import { SetLocation } from '../set-location/set-location';
import { Location } from '../../models/location';
import { Geolocation } from '@ionic-native/geolocation';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private modalCtrl: ModalController,
              private geolocation: Geolocation,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlace');
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
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

}
