import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { PlayerProvider } from '../../providers/player/player';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  hidePassword = false;
  responseData:any;
  userData = {
    "new_password": "",
    "re_new_password": ""
  };
  validation = {
    "new_password": { "valid": true, "check": [0,1], "msg": "" },
    "re_new_password": { "valid": true, "check": [2], "msg": "" }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public playerProvider: PlayerProvider, public alertCtrl: AlertController,
  	public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
  	this.hidePassword = true;
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  validationUp(name) {
    this.validation[name].valid = true;
    for (let i = 0; i < this.validation[name].check.length; ++i) {
      if (this.validation[name].check[i] == 0 && this.userData[name] == "") {
        this.validation[name].valid = false;
        this.validation[name].msg = "El campo esta vacio.";
        break;
      } else if (this.validation[name].check[i] == 1 && this.userData[name].length < 6) {
        this.validation[name].valid = false;
        this.validation[name].msg = "El tamaño minimo es de 6 caracteres.";
        break;
      } else if (this.validation[name].check[i] == 2 && this.userData[name] != this.userData["new_password"]) {
        this.validation[name].valid = false;
        this.validation[name].msg = "Las nuevas contraseñas no son iguales.";
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

  changePass(){

    if (this.isValidateForm()) {

      let currentUser = JSON.parse(localStorage.getItem("userData"));

      let loader = this.loadingCtrl.create({ content: "Enviando datos" });
      loader.present();

      this.playerProvider.postRequestData( this.userData, "changepass", currentUser.result.token )
      .then((data)=>{

      	loader.dismiss();
        this.responseData = data;
        if(this.responseData.status == 'OK'){

          this.userData.new_password = "";
          this.userData.re_new_password = "";
          this.messageOK('Exito', 'Su contraseña ha sido actualizada');
          this.goToBack();
        }

      },(err)=>{

        loader.dismiss();
        if (err.status == 400) {
          this.messageOK('Error', err.error.result.msg);
        } else {
          this.messageOK('Error', 'Estimado Usuario, Ocurrio un error a la hora de realizar la operación');
        }

        console.log("no pude actualizar mi contraseña");

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
