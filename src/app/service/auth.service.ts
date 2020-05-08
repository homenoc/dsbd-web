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
    this.commonService.openBar('ログイン処理に失敗しました。Error: ' + error, 4000);
  }


  loginProcess(): void {
    this.afAuth.currentUser
      .then((user) => {
        console.log(user);
        if (user.emailVerified) {
          localStorage.setItem('id', user.uid);
          this.userService.getUser(user.uid)
            .then(r => {
              if (r.isActive && r !== 0 && r.isAdmin) {
                localStorage.setItem('name', r.name);
                this.router.navigate(['/dashboard']).then();
              } else {
                this.commonService.openBar('以下が原因でログアウト処理を行いました。\n管理者ではない、アカウントがアクティブではありません。', 4000);
                this.logOut();
              }
            });
        } else {
          this.commonService.openBar('以下が原因でログアウト処理を行いました。\nメール認証を行っていない', 4000);
          this.logOut();
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
    return this.user !== null;
  }


  logOut(): void {
    localStorage.clear();
    this.afAuth.signOut().then(() => {
      this.commonService.openBar('ログアウトしました', 2000);
      this.router.navigate(['/']).then();
    });
  }

}
