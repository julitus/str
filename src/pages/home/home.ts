import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { GamesPage } from '../games/games';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import { ChangePasswordPage } from '../change-password/change-password';

import { PlayerProvider } from '../../providers/player/player';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	responseData:any;
	connections: any;

	userData = {
	    "code": ""
	  };

	constructor(
		public navCtrl: NavController, 
		public alertCtrl: AlertController,
		public playerProvider: PlayerProvider,
  		public loadingCtrl: LoadingController
	) {
		this.getConnections();
	}

	ionViewDidLoad() {

		console.log('ionViewDidLoad HomePage');
	}

	getConnections(){

	      let currentUser = JSON.parse(localStorage.getItem("userData"));

	      let loader = this.loadingCtrl.create({ content: "Cargando datos" });
	      loader.present();

	      this.playerProvider.postRequestData( {}, "connections", currentUser.result.token )
	      .then((data)=>{

	        loader.dismiss();
	        this.responseData = data;
	        if(this.responseData.status == 'OK'){
	        	this.connections = this.responseData.result.connections;
        		console.log("this.connections", this.connections);
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

	addConnection(){

		let currentUser = JSON.parse(localStorage.getItem("userData"));

      let loader = this.loadingCtrl.create({ content: "Enviando datos" });
      loader.present();

      this.playerProvider.postRequestData( this.userData, "connection", currentUser.result.token )
      .then((data)=>{

        loader.dismiss();
        this.responseData = data;
        if(this.responseData.status == 'OK'){
        	this.getConnections();
        }

      },(err)=>{

        loader.dismiss();
        if (err.status == 400) {
          this.messageOK('Error al enlazar con Creador', err.error.result.msg);
        } else {
          this.messageOK('Error', 'Estimado Usuario, Ocurrio un error a la hora de realizar la operación');
        }

      });
	}

	formConnection() {

		let alert = this.alertCtrl.create({
			title: 'Enlazar con Creador',
			inputs: [
				{
					name: 'code',
					placeholder: 'código'
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
					text: 'Enlazar',
					handler: data => {

						data.code = data.code.replace(/  /g,'');
						if (data.code != "" && data.code != " ") {
							
							this.userData.code = data.code.toUpperCase();
							this.addConnection();

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

  	goToProfile() {
		this.navCtrl.push(ProfilePage);
	}

	goToChangePassword() {
		this.navCtrl.push(ChangePasswordPage);
	}

	goToGames(creator=null) {
		localStorage.setItem('creatorData', JSON.stringify(creator));
		this.navCtrl.setRoot(GamesPage);
		this.navCtrl.popToRoot();
	}

	logout() {

		let alert = this.alertCtrl.create({
		    title: 'Cerrar Sesión',
		    message: '¿Deseas cerrar tu sesión?',
		    buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					handler: () => {
					//console.log('Cancel clicked');
					}
				},
				{
					text: 'Aceptar',
					handler: () => {
						localStorage.removeItem("userData");
						console.log("userData eliminada del localstorage : ", localStorage);
						this.navCtrl.setRoot(LoginPage);
					}
				}
	    	]
	  	});
		alert.present();
		
	}

	messageOK(title: string, msg: string) {

		let alert = this.alertCtrl.create({
			title: title,
			subTitle: msg,
			buttons: ['OK']
		});
		alert.present();
	}

}
