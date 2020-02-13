import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Platform } from 'ionic-angular';
//import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { ResultPage } from '../result/result';

/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

	initTime: any = 300;
	timer: any;

	quizzes: any[] = [];
	currentPos: any = 0;
	inputAnswer: string;
	currentQuiz: any;
	
	score: any = 0;
	successful: any = 0;
	wrong: any = 0;
	jumped: any = 0;

	constructor(
		public platform: Platform,
		public navCtrl: NavController, 
		public navParams: NavParams,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController
	) {

		/*if (!this.platform.is('mobileweb') && !this.platform.is('core')) {
			this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
		} else { }*/

		this.quizzes = JSON.parse(localStorage.getItem("data"));
		this.currentQuiz = this.quizzes[this.currentPos];
		console.log(this.quizzes);
	}

	jumpQuiz() {

		this.quizzes[this.currentPos]["color"] = "#f6af05";
		this.quizzes[this.currentPos]["score"] = "0";
		this.currentPos++;
		this.jumped++;

		if (this.currentPos >= this.quizzes.length) {
			this.messageOK("¡Genial!", "Haz terminado el juego.");
			this.currentPos--;
			this.endChallenge();
		}

		this.currentQuiz = this.quizzes[this.currentPos];
	}

	checkAnswer() {

		let typeAnswer = this.validateAnswer();
		switch (typeAnswer) {
			case 0:
				this.quizzes[this.currentPos]["color"] = "#ea0707";
				this.quizzes[this.currentPos]["score"] = "0";
				this.inputAnswer = "";
				this.currentPos++;
				this.wrong++;
				this.toastMessage("¡Incorrecto!", 3000, "top", false);
				break;
			case 1:
				this.quizzes[this.currentPos]["color"] = "#05ba12";
				this.quizzes[this.currentPos]["score"] = this.quizzes[this.currentPos].gsx$puntos.$t;
				this.score += parseFloat(this.quizzes[this.currentPos].gsx$puntos.$t);
				this.inputAnswer = "";
				this.currentPos++;
				this.successful++;
				this.toastMessage("¡Es correcto!", 3000, "top", true);
				break;
			default:
				this.messageOK("¡Casi!", "Escribiste: \"" + this.inputAnswer + "\",<br> quizás quisiste decir <br>\"" + this.quizzes[this.currentPos].gsx$respuesta.$t + "\"");
				break;
		}

		if (this.currentPos >= this.quizzes.length) {
			this.messageOK("¡Genial!", "Haz terminado con todas las interrogantes.");
			this.currentPos--;
			this.endChallenge();
		} else {
			this.currentQuiz = this.quizzes[this.currentPos];
		}
	}

	validateAnswer() {

		let currentAnswer = this.quizzes[this.currentPos].gsx$respuesta.$t.toLowerCase()/*.normalize("NFD").replace(/[\u0300-\u036f]/g, "")*/;
		let possibleAnswer = this.inputAnswer.toLowerCase()/*.normalize("NFD").replace(/[\u0300-\u036f]/g, "")*/;

		if (possibleAnswer != currentAnswer) {

			possibleAnswer = possibleAnswer.replace(/ /g,'');
			console.log(possibleAnswer);
			if (possibleAnswer.length == currentAnswer.length) {
				for (let i = 0; i < possibleAnswer.length; i++) {
					if (possibleAnswer.substring(0, i) == currentAnswer.substring(0, i) && 
						possibleAnswer.substring(i + 1) == currentAnswer.substring(i + 1)) {
						return 2;
					}
				}

			} else if (possibleAnswer.length - 1 == currentAnswer.length) {
				for (let i = 0; i < possibleAnswer.length; i++) {
					if (possibleAnswer.substring(0, i) == currentAnswer.substring(0, i) && 
						possibleAnswer.substring(i + 1) == currentAnswer.substring(i)) {
						return 2;
					}
				}

			} else if (possibleAnswer.length + 1 == currentAnswer.length) {
				for (let i = 0; i < currentAnswer.length; i++) {
					console.log(possibleAnswer.substring(0, i), currentAnswer.substring(0, i));
					console.log(possibleAnswer.substring(i), currentAnswer.substring(i + 1));
					if (possibleAnswer.substring(0, i) == currentAnswer.substring(0, i) && 
						possibleAnswer.substring(i) == currentAnswer.substring(i + 1)) {
						return 2;
					}
				}

			}
			return 0;
		}
		return 1;
	}

	endChallenge() {

		this.navCtrl.setRoot(ResultPage, { 
			score: this.score, 
			successful: this.successful, 
			wrong: this.wrong,
			jumped: this.jumped,
			quizzes: this.quizzes,
			last: this.currentPos
		});
		this.navCtrl.popToRoot();
	}

	startTimer() {

		this.timer = setTimeout(x => {
			
			if (this.initTime <= 0) { return; }
			this.initTime--;

			if (this.initTime > 0) {
				this.startTimer();
			} else {
				this.messageOK("¡Wooow!", "El desafio ha finalizado.");
				this.endChallenge();
			}

		}, 1000);
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

	toastMessage(msg: string, duration: any, position: string, type: boolean) {

		let cssClass = "toast-successful";
		if (!type) { cssClass = "toast-wrong"; }
	
		let toast = this.toastCtrl.create({
			message: msg,
			duration: duration,
			position: position,
			cssClass: cssClass
		});

		toast.present();
	}

	ionViewDidLoad() {

		this.startTimer();
		console.log('ionViewDidLoad GamePage');
	}

	ionViewWillLeave() {

		this.initTime = 0;
		console.log("ionViewWillLeave GamePage :(");
	}

}
