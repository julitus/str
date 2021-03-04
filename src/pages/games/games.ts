import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { GamePage } from '../game/game';
import { HomePage } from '../home/home';

import { ChallengeProvider } from '../../providers/challenge/challenge';

/**
 * Generated class for the GamesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-games',
  templateUrl: 'games.html',
})
export class GamesPage {

	responseData: any;
	challenges:any;
	creator: any;

	userData = {
	    "creator_id": ""
	  };

  constructor(
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public challengeProvider: ChallengeProvider
		) {

  		this.creator = JSON.parse(localStorage.getItem("creatorData"));
  		this.userData.creator_id = this.creator.id;
  		this.getChallenges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamesPage');
  }

  getChallenges(){

      let currentUser = JSON.parse(localStorage.getItem("userData"));

      let loader = this.loadingCtrl.create({ content: "Cargando datos" });
      loader.present();

      this.challengeProvider.postRequestData( this.userData, "list", currentUser.result.token )
      .then((data)=>{

        loader.dismiss();
        this.responseData = data;
        if(this.responseData.status == 'OK'){
        	this.challenges = this.responseData.result.challenges;
    		console.log("this.challenges", this.challenges);
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

	checkToGame(challenge=null) {
		let pass = challenge.code.trim();

		if (pass == "") {	
			this.goToGame(challenge);
		} else {
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
							if (data.key == pass) {
								this.goToGame(challenge);
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
	}

  goToHome() {
  	this.navCtrl.setRoot(HomePage);
  	this.navCtrl.popToRoot();
  }

  goToGame(challenge) {
  	this.navCtrl.setRoot(GamePage, { challenge: challenge });
	this.navCtrl.popToRoot();
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
