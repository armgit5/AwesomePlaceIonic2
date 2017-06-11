import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddPlace } from '../add-place/add-place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  addPlacePage = AddPlace;

  constructor(public navCtrl: NavController) {

  }

}
