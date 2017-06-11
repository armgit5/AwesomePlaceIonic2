import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Place } from './place';

@NgModule({
  declarations: [
    Place,
  ],
  imports: [
    IonicPageModule.forChild(Place),
  ],
  exports: [
    Place
  ]
})
export class PlaceModule {}
