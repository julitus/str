import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { HttpClient } from '@angular/common/http';

import { GamePage } from '../game/game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	responseData: any;
	quizzes: any[] = [];
	isOk: boolean;

	constructor(
		platform: Platform,
		public navCtrl: NavController, 
		public alertCtrl: AlertController,
		public http: HttpClient, 
		public loadingCtrl: LoadingController,
		public splashscreen: SplashScreen,
	) {
		/*platform.ready().then(() => {
			this.splashscreen.hide();
		});*/
		/*if (!platform.is('mobileweb') && !platform.is('core')){
			this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
		} else { }*/

		this.getData();
	}

	getData() {

		let loader = this.loadingCtrl.create({ content: "Cargando datos" });
		loader.present();

		this.getHttpData().then(
			result => {
			
				this.responseData = result;
				this.quizzes = this.responseData.feed.entry;
				this.shuffleData();
				this.isOk = true;
				loader.dismiss();

				localStorage.setItem("data", JSON.stringify(this.quizzes));

				console.log(localStorage.getItem("data"));

			}, (err) => {
				this.isOk = false;
				console.log("error:", err);
				loader.dismiss();
			});
	}

	shuffleData() {
		
		var currentIndex = this.quizzes.length, temporaryValue, randomIndex;

		while (0 !== currentIndex) {

			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = this.quizzes[currentIndex];
			this.quizzes[currentIndex] = this.quizzes[randomIndex];
			this.quizzes[randomIndex] = temporaryValue;
		}
	}

	initGame() {

		if (this.quizzes.length > 0 && this.isOk) {
			this.navCtrl.setRoot(GamePage);
			this.navCtrl.popToRoot();
		} else {
			this.messageOK("¡Upss!", "No se pudo cargar los datos correctamente, vuelva abrir el aplicativo.");
		}
	}

	getHttpData() {

		let debug = false;
		let url = (debug ? 'https://spreadsheets.google.com/feeds/list/1qZaMhR1RitdZBpXqwAHCyXhXcPTdSqlixuJxW2lI4yQ/od6/public/values?alt=json' : 'https://cors-anywhere.herokuapp.com/https://spreadsheets.google.com/feeds/list/1qZaMhR1RitdZBpXqwAHCyXhXcPTdSqlixuJxW2lI4yQ/od6/public/values?alt=json');

		return new Promise((resolve, reject) => {
			this.http.get(url)
			.subscribe(res => {
				resolve(res);
			}, (err) => {
				this.messageOK("Error", "No se pudo cargar los datos, revise su conexión a Internet.");
				//alert("No se pudo cargar los datos, revise su conexión a Internet.");
				console.log(err);
				reject(err);
			});
		});
	}

	messageOK(title: string, msg: string) {

		console.log(msg);
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
