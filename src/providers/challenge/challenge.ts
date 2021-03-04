import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { URL_SERVICES } from './../../config/url.config';
let url = URL_SERVICES + "/challenge/";

/*
  Generated class for the ChallengeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChallengeProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ChallengeProvider Provider');
  }

  postRequestData(credentials, type, token=""){
    return new Promise((resolve, reject)=>{
      let header = {}
      if (token != "") {
        header = { headers: new HttpHeaders({'Authorization': 'Bearer '+token}) };
      }
      
      this.http.post(url+type,credentials,header).subscribe(data =>{
        resolve(data);

        console.log("Entre a la promesa");
      },(err)=>{
        console.log(err);
        console.log("No entre a la promesa");
        reject(err);
      });
    });
  }

}
