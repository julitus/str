import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { PlayerProvider } from '../../providers/player/player';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  responseData : any;
  userData = {
    "firstname": "",
    "lastname": ""
  };
  validation = {
    "firstname": { "valid": true, "check": [0], "msg": "" },
    "lastname": { "valid": true, "check": [0], "msg": "" }
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public playerProvider: PlayerProvider, public alertCtrl: AlertController,
  	public loadingCtrl: LoadingController) {

  	let currentUser = JSON.parse(localStorage.getItem("userData"));
    this.userData.firstname = currentUser.result.player.firstname;
    this.userData.lastname = currentUser.result.player.lastname;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  validationUp(name) {
    this.validation[name].valid = true;
    for (let i = 0; i < this.validation[name].check.length; ++i) {
      if (this.validation[name].check[i] == 0 && this.userData[name] == "") {
        this.validation[name].valid = false;
        this.validation[name].msg = "El campo esta vacio.";
        break;
      }
    }
    return this.validation[name].valid;
  }

  isValidateForm() {
    let isValid = true;
    for (let val in this.validation) {
      isValid = isValid && this.validationUp(val);
    }
    return isValid;
  }

  updateProfile(){

    if (this.isValidateForm()) {

      let currentUser = JSON.parse(localStorage.getItem("userData"));

      let loader = this.loadingCtrl.create({ content: "Enviando datos" });
      loader.present();

      this.playerProvider.postRequestData( this.userData, "update", currentUser.result.token )
      .then((data)=>{

        loader.dismiss();
        this.responseData = data;
        if(this.responseData.status == 'OK'){

       	  currentUser.result.player.firstname = this.userData.firstname;
          currentUser.result.player.lastname = this.userData.lastname;
          
          localStorage.setItem('userData', JSON.stringify(currentUser));

          this.messageOK('Exito', 'Su información ha sido actualizada');
          this.goToBack();
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
  }

  goToBack() {
  	this.navCtrl.pop();
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

}
