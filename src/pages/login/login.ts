import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  hidePassword = false;
  responseData : any;
  userData = {
    "email" : "",
    "password" : "",
    "remember" : false
  };
  validation = {
    "email": { "valid": true, "check": [0], "msg": "" },
    "password": { "valid": true, "check": [0,1], "msg": "" }
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public alertCtrl: AlertController, public loadingCtrl: LoadingController,
  	public authProvider: AuthProvider) {

  	let rememberLogin = JSON.parse(localStorage.getItem("rememberUser"));
  	if (rememberLogin && rememberLogin.remember) {
  		this.userData = rememberLogin;
  	}

  }

  ionViewDidLoad() {
  	this.hidePassword = true;
    console.log('ionViewDidLoad LoginPage');
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

  login() {

    if (this.isValidateForm()) {
      
      let loader = this.loadingCtrl.create({ content: "Validando Usuario"  });
      loader.present();

      this.userData.email = this.userData.email.toLowerCase();

      this.authProvider.postRequestData( this.userData, "signin" )
      .then((data)=>{

        loader.dismiss();
        this.responseData = data;
        if(this.responseData.status == 'OK'){
          localStorage.setItem('userData', JSON.stringify(this.responseData));
          localStorage.setItem('rememberUser', JSON.stringify(this.userData));
          this.goToHome();
        }
      },(err)=>{

        loader.dismiss();
        if (err.status == 400) {
          this.messageOK('Error al iniciar sesión', err.error.result.msg);
        } else {
          this.messageOK('Error', 'Estimado Usuario, Ocurrio un error a la hora de realizar la operación');
        }

        console.log(err);
        console.log("no pude loguearme");

      });
    }
  }

  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  goToRegister() {
    this.navCtrl.push(RegisterPage);
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
