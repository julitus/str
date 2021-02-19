import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

}
