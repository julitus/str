import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeAudio } from '@ionic-native/native-audio';

import { HttpClientModule } from '@angular/common/http';
  
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { FIREBASE_CONFIG } from './firebase.credentials';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { GamePage } from '../pages/game/game';
import { GamesPage } from '../pages/games/games';
import { ResultPage } from '../pages/result/result';

import { UserService } from '../services/user.service';
import { RecordService } from '../services/record.service';

import { AuthProvider } from '../providers/auth/auth';
import { ChallengeProvider } from '../providers/challenge/challenge';
import { PlayerProvider } from '../providers/player/player';

import { TextInputDirective } from '../directives/text-input/text-input';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    ProfilePage,
    ChangePasswordPage,
    GamePage,
    GamesPage,
    ResultPage,
    TextInputDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    HomePage,
    ProfilePage,
    ChangePasswordPage,
    GamePage,
    GamesPage,
    ResultPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NativeAudio,
    UserService,
    RecordService,
    AuthProvider,
    ChallengeProvider,
    PlayerProvider
  ]
})
export class AppModule {}
