import {Injectable, NgZone} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/auth";
import {auth} from "firebase";
import {CommonService} from "./common.service";
import {UserService} from "./user.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any;

  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
    private userService: UserService,
    private commonService: CommonService,
  ) {
    this.afAuth.authState
      .subscribe(user => this.user = user);
  }


  loginWithMail(email: string, pass: string): void {
    this.afAuth.signInWithEmailAndPassword(email, pass)
      .then(() => {
        this.loginProcess();
      })
      .catch(error => this.loginFailedProcess(error));
  }

  loginWithGoogle() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(this.loginProcess)
      .catch(error => this.loginFailedProcess(error));
  }

  loginWithTwitter() {
    this.afAuth.signInWithPopup(new auth.TwitterAuthProvider())
      .then(this.loginProcess)
      .catch(error => this.loginFailedProcess(error));
  }

  loginWithFacebook() {
    this.afAuth.signInWithPopup(new auth.FacebookAuthProvider())
      .then(this.loginProcess)
      .catch(error => this.loginFailedProcess(error));
  }

  loginFailedProcess(error): void {
    console.log(error);
    this.commonService.openBar('Failed login process... Error: ' + error, 4000);
  }


  loginProcess(): void {
    this.afAuth.currentUser
      .then((user) => {
        console.log(user);
        if (user.emailVerified) {
          localStorage.setItem('authID', user.uid);
          this.router.navigate(['/dashboard']).then();
        } else {
          this.commonService.openBar('Email verification is required...', 4000);
          this.logOut(false);
        }
      });
  }

  getUser() {
    return this.afAuth.currentUser
      .then(d => {
        return d;
      });
  }


  loginCheck() {
    console.log("test")
    console.log(this.user)
    return this.user !== null;
  }


  logOut(status: boolean): void {
    localStorage.clear();
    this.afAuth.signOut().then(() => {
      if (status) {
        this.commonService.openBar('Logout!。', 4000);
      }
      this.router.navigate(['/']).then();
    });
  }

}
