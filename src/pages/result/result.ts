import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { HomePage } from '../home/home';

import { Record } from '../../model/record/record.model';
import { RecordService } from '../../services/record.service';

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

	titleQuiz: any;
	score: any;
	time: any;
	successful: any;
	wrong: any;
	hasKey: boolean;
	finish: any;

	quizzes: any[] = [];

	record: Record = {
	    userKey: '',
	    title: '',
	    score: '',
	    time: '',
	    successful: '',
	    wrong: '',
	    created: ''
	};

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public db: AngularFireDatabase,
		private recordService: RecordService
	) {

		this.titleQuiz = navParams.get('title');
		this.score = navParams.get('score');
		this.time = navParams.get('time');
		this.successful = navParams.get('successful');
		this.wrong = navParams.get('wrong');
		this.hasKey = navParams.get('hasKey');
		this.finish = navParams.get('finish');

		this.quizzes = navParams.get('quizzes');

		if (this.hasKey) {

			let userLocal = JSON.parse(localStorage.getItem("user"));
			this.record.userKey = userLocal.key;
			this.record.title = this.titleQuiz;
			this.record.score = this.score;
			this.record.time = this.time;
			this.record.successful = this.successful;
			this.record.wrong = this.wrong;
			this.record.created = this.finish;

			this.recordService.addRecord(this.record).then(ref => {})
		}

		//console.log("score: ", this.score);
		//console.log("time: ", this.time);
		//console.log("successful: ", this.successful);
		//console.log("wrong: ", this.wrong);

		//console.log("quizzes: ", this.quizzes);
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
