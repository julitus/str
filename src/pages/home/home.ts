import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { GamesPage } from '../games/games';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	constructor(
		public navCtrl: NavController, 
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController
	) {

	}

	messageOK(title: string, msg: string) {

		let alert = this.alertCtrl.create({
			title: title,
			subTitle: msg,
			buttons: ['OK']
		});
		alert.present();
	}

	ionViewDidLoad() {

		console.log('ionViewDidLoad HomePage');
	}

}
