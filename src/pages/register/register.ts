import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  
  hidePassword = false;
  responseData : any;
  userData = {
    "firstname": "",
    "lastname": "",
    "email": "",
    "password": ""
  };
  validation = {
    "firstname": { "valid": true, "check": [0], "msg": "" },
    "lastname": { "valid": true, "check": [0], "msg": "" },
    "email": { "valid": true, "check": [0,1], "msg": "" },
    "password": { "valid": true, "check": [0,2], "msg": "" }
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public authProvider: AuthProvider, public alertCtrl: AlertController,
  	public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
  	this.hidePassword = true;
    console.log('ionViewDidLoad RegisterPage');
  }

  validationUp(name) {
    this.validation[name].valid = true;
    for (let i = 0; i < this.validation[name].check.length; ++i) {
      if (this.validation[name].check[i] == 0 && this.userData[name] == "") {
        this.validation[name].valid = false;
        this.validation[name].msg = "El campo esta vacio.";
        break;
      } else if (this.validation[name].check[i] == 1 && !(new RegExp('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')).test(this.userData[name])) {
        this.validation[name].valid = false;
        this.validation[name].msg = "El correo electrónico no es válido.";
        break;
      } else if (this.validation[name].check[i] == 2 && this.userData[name].length < 6) {
        this.validation[name].valid = false;
        this.validation[name].msg = "El tamaño minimo es de 6 caracteres.";
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

  register(){

    if (this.isValidateForm()) {

      let loader = this.loadingCtrl.create({ content: "Enviando datos" });
      loader.present();

      this.userData.email = this.userData.email.toLowerCase();

      this.authProvider.postRequestData( this.userData, "register" )
      .then((data)=>{

        loader.dismiss();
        this.responseData = data;
        if(this.responseData.status == 'OK'){
          this.messageOK('Felicidades', 'Tu registro se realizó satisfactoriamente, ya puedes iniciar sesión');
          this.goToBack();
        }

      },(err)=>{

        loader.dismiss();
        if (err.status == 400) {
          this.messageOK('Error inesperado', err.error.result.msg);
        } else {
          this.messageOK('Error', 'Estimado Usuario, Ocurrio un error a la hora de realizar la operación');
        }

        console.log("no pude registrarme");

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
