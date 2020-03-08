import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';

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

	score: any;
	time: any;
	successful: any;
	wrong: any;
	//jumped: any;
	//last: any;

	quizzes: any[] = [];

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams
	) {

		this.score = navParams.get('score');
		this.time = navParams.get('time');
		this.successful = navParams.get('successful');
		this.wrong = navParams.get('wrong');
		//this.jumped = navParams.get('jumped');

		//this.last = navParams.get('last');
		this.quizzes = navParams.get('quizzes');

		console.log("score: ", this.score);
		console.log("time: ", this.time);
		console.log("successful: ", this.successful);
		console.log("wrong: ", this.wrong);
		//console.log("jumped: ", this.jumped);
		//console.log("last: ", this.last);

		console.log("quizzes: ", this.quizzes);
	}

	replay() {

		this.navCtrl.setRoot(HomePage);
		this.navCtrl.popToRoot();
	}

	addClass(i) {

		return (i % 2 == 0 ? "bg-color-0" : "bg-color-1");
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ResultPage');
	}

}
