import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

import { ResultPage } from '../result/result';

import { ChallengeProvider } from '../../providers/challenge/challenge';

/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

	responseData: any;

	initTime: any = 0;
	constTime: any;
	timer: any;

	challenge: any;
	questions: any;
	elementsPos: any[] = [];
	currentPos: any = 0;
	inputAnswer: string;
	currentQuiz: any;
	
	score: any = 0;
	successful: any = 0;
	wrong: any = 0;
	hasKey: boolean;
	titleQuiz: any;

	userData = {
	    "challenge_id": ""
	  };

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController,
		private nativeAudio: NativeAudio,
		public loadingCtrl: LoadingController,
		public challengeProvider: ChallengeProvider
	) {

		console.log('construct!!!');
		this.challenge = this.navParams.get('challenge');
		this.userData.challenge_id = this.challenge.id;

		this.constTime = this.challenge.time;
		this.initTime = this.challenge.time;
		this.hasKey = (this.challenge.code.trim() != "");
		this.titleQuiz = this.challenge.name;

		this.getChallenge();

		nativeAudio.preloadSimple('success', 'assets/sounds/success-sound.wav');
		nativeAudio.preloadSimple('wrong', 'assets/sounds/wrong-sound.wav');
		nativeAudio.preloadSimple('finish', 'assets/sounds/finish-sound.wav');
		nativeAudio.preloadSimple('win', 'assets/sounds/win-sound.mp3');
	}

	ionViewDidLoad() {

		this.startTimer();
		console.log('ionViewDidLoad GamePage');
	}

	ionViewWillLeave() {

		this.initTime = 0;
		console.log("ionViewWillLeave GamePage :(");
	}

	async getChallenge() {

		let currentUser = JSON.parse(localStorage.getItem("userData"));

	      let loader = this.loadingCtrl.create({ content: "Cargando datos" });
	      loader.present();

	      await this.challengeProvider.postRequestData( this.userData, "get", currentUser.result.token )
	      .then((data)=>{

	        loader.dismiss();
	        this.responseData = data;
	        if(this.responseData.status == 'OK'){
	        	this.questions = this.responseData.result.questions;

				for (var i = 0; i < this.questions.length; ++i) {
					this.questions[i]["color"] = "#068cce";
					this.questions[i]["score"] = 0;
					this.elementsPos.push(i);
				}

				this.currentQuiz = this.questions[this.currentPos];
	    		console.log("this.questions", this.questions);
	        }

	      },(err)=>{

	        loader.dismiss();
	        if (err.status == 400) {
	          this.messageOK('Error inesperado', err.error.result.msg);
	        } else {
	          this.messageOK('Error', 'Estimado Usuario, Ocurrio un error a la hora de realizar la operación');
	        }

	      });
	}

	getNextPosElement(op: boolean) {
		if (op) {
			this.elementsPos.shift();
		} else {
			let e = this.elementsPos.shift();
			this.elementsPos.push(e);
		}
		return (this.elementsPos.length == 0 ? this.questions.length : this.elementsPos[0]);
	}

	jumpQuiz() {

		this.questions[this.currentPos].color = "#f6af05";
		this.questions[this.currentPos].score = 0;
		this.currentPos = this.getNextPosElement(false);

		this.currentQuiz = this.questions[this.currentPos];
	}

	checkAnswer() {

		if (this.inputAnswer) {
			let typeAnswer = this.validateAnswer();
			switch (typeAnswer) {
				case 0:
					this.nativeAudio.play('wrong');
					this.questions[this.currentPos].color = "#ea0707";
					this.questions[this.currentPos].score = 0;
					this.inputAnswer = "";
					this.currentPos = this.getNextPosElement(true);
					this.wrong++;
					this.toastMessage("¡Incorrecto!", 3000, "top", false);
					break;
				case 1:
					this.nativeAudio.play('success');
					this.questions[this.currentPos].color = "#05ba12";
					this.questions[this.currentPos].score = this.questions[this.currentPos].points;
					this.score += this.questions[this.currentPos].points;
					this.inputAnswer = "";
					this.currentPos = this.getNextPosElement(true);
					this.successful++;
					this.toastMessage("¡Es correcto!", 3000, "top", true);
					break;
				default:
					this.messageOK("¡Casi!", "Escribiste: \"" + this.inputAnswer + "\",<br> quizás quisiste decir <br>\"" + this.questions[this.currentPos].answer + "\"");
					break;
			}

			if (this.currentPos >= this.questions.length) {
				this.nativeAudio.play('win');
				this.messageOK("¡Genial!", "Haz terminado el juego.");
				this.endChallenge();
			} else {
				this.currentQuiz = this.questions[this.currentPos];
			}
		}
	}

	validateAnswer() {

		let currentAnswer = this.questions[this.currentPos].answer.toLowerCase().replace(/ /g,'')/*.normalize("NFD").replace(/[\u0300-\u036f]/g, "")*/;
		let possibleAnswer = this.inputAnswer.toLowerCase().replace(/ /g,'')/*.normalize("NFD").replace(/[\u0300-\u036f]/g, "")*/;

		if (possibleAnswer != currentAnswer) {

			possibleAnswer = possibleAnswer.replace(/ /g,'');
			//console.log(possibleAnswer);
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
					//console.log(possibleAnswer.substring(0, i), currentAnswer.substring(0, i));
					//console.log(possibleAnswer.substring(i), currentAnswer.substring(i + 1));
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
			challenge_id: this.challenge.id,
			title: this.titleQuiz, 
			score: this.score, 
			time: (this.constTime - this.initTime),
			successful: this.successful, 
			wrong: this.wrong,
			hasKey: this.hasKey,
			questions: this.questions,
			finish: this.getDate()
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
				this.nativeAudio.play('finish');
				this.messageOK("¡Wooow!", "El desafio ha finalizado.");
				this.endChallenge();
			}

		}, 1000);
	}

	getDate() {
		var d = new Date;
   		return [d.getFullYear(),
				d.getMonth()+1,
				d.getDate()
			   ].join('/')+' '+
			   [d.getHours(),
				d.getMinutes(),
				d.getSeconds()].join(':');
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


}
