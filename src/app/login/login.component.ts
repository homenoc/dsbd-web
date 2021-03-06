import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../service/auth.service';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from '../service/common.service';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    private http: HttpClient,
  ) {
  }

  public hide = true;
  public email = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl();
  private updateSubscription: Subscription;


  ngOnInit(): void {
    this.getTmpToken();
    // ユーザの20分ごとに一時Tokenを更新
    this.updateSubscription = interval(1200000).subscribe(
      (val) => {
        this.getTmpToken();
      });
  }

  getTmpToken() {
    sessionStorage.clear();
    sessionStorage.setItem('ClientID', this.commonService.random(30));
    this.http.get(environment.api.url + environment.api.path + '/token/init', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        USER_TOKEN: sessionStorage.getItem('ClientID')
      }),
    }).toPromise().then(r => {
      const response: any = r;
      console.log('response: ' + JSON.stringify(response));
      sessionStorage.setItem('TmpKey', response.token);
    }).catch(r => {
      console.log(r);
      this.commonService.openBar('一時Tokenの取得に失敗しました。\nページをリロードしてください。', 10000);
    });
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  loginMail() {
    this.authService.loginWithMail(this.email.value, this.password.value);
  }

}
