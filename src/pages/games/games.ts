import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireDatabase } from 'angularfire2/database';

import { HttpClient } from '@angular/common/http';

import { GamePage } from '../game/game';

import { User } from '../../model/user/user.model';
import { UserService } from '../../services/user.service';

/**
 * Generated class for the GamesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-games',
  templateUrl: 'games.html',
})
export class GamesPage {

  	user: User = {
	    name: ''
	};

	responseData: any;
	quizzes: any[] = [];
	lastUpdated: any;
	isOk: boolean;

  constructor(
  		platform: Platform,
		public navCtrl: NavController,
		public navParams: NavParams,
		public alertCtrl: AlertController,
		public http: HttpClient, 
		public loadingCtrl: LoadingController,
		public splashscreen: SplashScreen,
		public db: AngularFireDatabase,
		private userService: UserService) {

  		this.getData();

		let userLocal = JSON.parse(localStorage.getItem("user"));
	    if(!userLocal) {
	    	this.updateUser();
	    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamesPage');
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
				this.lastUpdated = new Date();
				localStorage.setItem('lastUpdated', this.lastUpdated);
				localStorage.setItem('quizzes', JSON.stringify(this.quizzes));
				loader.dismiss();

				//console.log(this.quizzes);

			}, (err) => {
				//this.isOk = false;
				//this.quizzes = [];
				//let q = JSON.parse(localStorage.getItem('quizzes')) || [];
				this.quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
				//console.log(q);
				this.lastUpdated = localStorage.getItem('lastUpdated');
			    /*if (q) {
					this.quizzes = q;
			    }*/
			    /*if (!u) {
					this.lastUpdated = u;
			    }*/
				this.isOk = true;
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
			if (this.quizzes[id].hasKey) {
				this.checkKey(id);
			} else {
				//console.log(">> Ingreso sin password");
				this.navCtrl.setRoot(GamePage, { quiz: this.quizzes[id] });
				this.navCtrl.popToRoot();
			}
		} else {
			this.messageOK("¡Upss!", "No se actualizó la información correctamente, intente otra vez.");
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
				this.messageOK("Error", "No se pudo actualizar la información, revise su conexión a Internet.");
				console.log(err);
				reject(err);
			});
		});
	}

	checkKey(id: any) {

		let userLocal = JSON.parse(localStorage.getItem("user"));
		if (userLocal) {

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
							//console.log('Cancel clicked');
						}
					},
					{
						text: 'Aceptar',
						handler: data => {
							console.log(data.key == this.quizzes[id].key);
							if (data.key == this.quizzes[id].key) {
								this.navCtrl.setRoot(GamePage, { quiz: this.quizzes[id] });
								this.navCtrl.popToRoot();
								//console.log(">> Ingreso con password correcta");
							} else {
								this.messageOK("¡Upss!", "No es la clave correcta.");
								return false;
							}
						}
					}
				]
			});
			alert.present();
		} else {
			this.messageOK("Mensaje", "Antes de ingresar actualice su Nombre.");
		}
	}

	updateUser() {

		let userLocal = JSON.parse(localStorage.getItem("user"));
		let userName = "";
	    if(userLocal) {
	    	userName = userLocal.name
	    }

		let alert = this.alertCtrl.create({
			title: 'Nombre Alumno',
			inputs: [
				{
					name: 'name',
					placeholder: 'nombre',
					value: userName
				}
			],
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					handler: data => {
						//console.log('Cancel clicked');
					}
				},
				{
					text: 'Aceptar',
					handler: data => {

						data.name = data.name.replace(/  /g,'');
						if (data.name != "" && data.name != " ") {
							
							this.saveUser(data.name);

						} else {
							this.messageOK("Alerta", "No ingrese campos vacios.");
							return false;
						}
					}
				}
			]
		});
		alert.present();

	}

	saveUser(name: any) {

		let userLocal = JSON.parse(localStorage.getItem("user"));
		this.user.name = name;

	    if(!userLocal) {
			this.userService.addUser(this.user).then(ref => {
		      	this.messageOK("¡Éxito!", "El nombre fue guardado correctamente.");
		      	this.user.key = ref.key;
				localStorage.setItem("user", JSON.stringify(this.user));
		    })
		    
	    } else {
	    	this.user.key = userLocal.key;
	    	this.userService.updateUser(this.user).then(() => {
		      	this.messageOK("¡Éxito!", "El nombre fue guardado correctamente.");
				localStorage.setItem("user", JSON.stringify(this.user));
		    })
	    }
		
	}

	messageOK(title: string, msg: string) {

		//console.log(msg);
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: msg,
			buttons: ['OK']
		});
		alert.present();
	}

}
