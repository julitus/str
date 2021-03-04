import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { GamesPage } from '../games/games';

import { ChallengeProvider } from '../../providers/challenge/challenge';

/**
 * Generated class for the ResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

	responseData: any;

	titleQuiz: any;
	score: any;
	time: any;
	successful: any;
	wrong: any;
	hasKey: boolean;
	finish: any;

	questions: any;

	userData = {
		"challenge_id": 0,
		"score": 0.0,
		"time": 0,
		"successful": 0,
		"wrong": 0
	}

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public challengeProvider: ChallengeProvider
	) {

		this.titleQuiz = navParams.get('title');
		this.score = navParams.get('score');
		this.time = navParams.get('time');
		this.successful = navParams.get('successful');
		this.wrong = navParams.get('wrong');
		this.hasKey = navParams.get('hasKey');
		this.finish = navParams.get('finish');

		this.questions = navParams.get('questions');

		this.userData.challenge_id = navParams.get('challenge_id');
		this.userData.score = this.score;
		this.userData.time = this.time;
		this.userData.successful = this.successful;
		this.userData.wrong = this.wrong;

		this.saveResult();
	}

	async saveResult() {

		let currentUser = JSON.parse(localStorage.getItem("userData"));

      	let loader = this.loadingCtrl.create({ content: "Guardando resultados" });
      	loader.present();

      	await this.challengeProvider.postRequestData( this.userData, "result", currentUser.result.token )
      	.then((data)=>{

	        loader.dismiss();
	        this.responseData = data;
	        if(this.responseData.status == 'OK'){
	    		console.log("save result!!!");
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

	replay() {

		this.navCtrl.setRoot(GamesPage);
		this.navCtrl.popToRoot();
	}

	addClass(i) {

		return (i % 2 == 0 ? "bg-color-0" : "bg-color-1");
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

	ionViewDidLoad() {
		console.log('ionViewDidLoad ResultPage');
	}

}
