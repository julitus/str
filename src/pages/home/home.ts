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
				let rawData = this.responseData.feed.entry;
				this.quizzes = [];
				let quiz = { 
						title: '',
						key: '',
						time: 0,
						hasKey: false,
						quizzes: [] 
					};
				for (var i = 0; i < rawData.length; ++i) {
					if (rawData[i].gsx$desafio.$t != "") {
						quiz = { 
							title: rawData[i].gsx$desafio.$t,
							key: rawData[i].gsx$clave.$t,
							hasKey: (rawData[i].gsx$clave.$t != "" ? true : false),
							time: parseInt(rawData[i].gsx$tiempos.$t),
							quizzes: []
						};
					} else {
						quiz.quizzes.push({ 
							label: rawData[i].gsx$etiqueta.$t,
							title: rawData[i].gsx$titulo.$t,
							clue: rawData[i].gsx$pista.$t,
							answer: rawData[i].gsx$respuesta.$t,
							points: parseFloat(rawData[i].gsx$puntos.$t),
						});
					}
					if ((i + 1) == rawData.length || rawData[i + 1].gsx$desafio.$t != "") {
						this.quizzes.push(quiz);
					}
				}
				//this.shuffleData();
				this.isOk = true;
				loader.dismiss();

				//localStorage.setItem("data", JSON.stringify(this.quizzes));

				//console.log(localStorage.getItem("data"));
				console.log(this.quizzes);

			}, (err) => {
				this.isOk = false;
				console.log("error:", err);
				loader.dismiss();
			});
	}

	/*shuffleData() {
		
		var currentIndex = this.quizzes.length, temporaryValue, randomIndex;

		while (0 !== currentIndex) {

			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = this.quizzes[currentIndex];
			this.quizzes[currentIndex] = this.quizzes[randomIndex];
			this.quizzes[randomIndex] = temporaryValue;
		}
	}*/

	initGame(id: any) {

		if (this.quizzes[id].quizzes.length > 0 && this.isOk) {
			if (this.quizzes[id].key != "") {
				this.checkKey(id);
			} else {
				console.log(">> Ingreso sin password");
				this.navCtrl.setRoot(GamePage, { quiz: this.quizzes[id] });
				this.navCtrl.popToRoot();
			}
		} else {
			this.messageOK("¡Upss!", "No se pudo cargar los datos correctamente, vuelva a cargarlos.");
		}
	}

	getHttpData() {

		let debug = true;
		let url = (debug ? 'https://spreadsheets.google.com/feeds/list/1qZaMhR1RitdZBpXqwAHCyXhXcPTdSqlixuJxW2lI4yQ/od6/public/values?alt=json' : 'https://cors-anywhere.herokuapp.com/https://spreadsheets.google.com/feeds/list/1qZaMhR1RitdZBpXqwAHCyXhXcPTdSqlixuJxW2lI4yQ/od6/public/values?alt=json');

		return new Promise((resolve, reject) => {
			this.http.get(url)
			.subscribe(res => {
				resolve(res);
			}, (err) => {
				this.messageOK("Error", "No se pudo cargar los datos, revise su conexión a Internet.");
				console.log(err);
				reject(err);
			});
		});
	}

	checkKey(id: any) {

		let alert = this.alertCtrl.create({
			title: 'Clave',
			inputs: [
				{
					name: 'key',
					placeholder: 'clave',
					type: 'password'
				}
			],
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Aceptar',
					handler: data => {
						console.log(data.key == this.quizzes[id].key);
						if (data.key == this.quizzes[id].key) {
							this.navCtrl.setRoot(GamePage, { quiz: this.quizzes[id] });
							this.navCtrl.popToRoot();
							console.log(">> Ingreso con password correcta");
						} else {
							this.messageOK("¡Upss!", "No es la clave correcta.");
							return false;
						}
					}
				}
			]
		});
		alert.present();
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
