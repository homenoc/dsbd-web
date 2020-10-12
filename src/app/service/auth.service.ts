import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from './common.service';
import {UserService} from './user.service';
import {environment} from '../../environments/environment';
import * as shaJS from 'sha.js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    public router: Router,
    private userService: UserService,
    private commonService: CommonService,
    private http: HttpClient
  ) {
  }

  loginWithMail(email: string, pass: string): void {
    console.log('E-Mail: ' + email);
    const hash: string = shaJS('sha256').update(pass + sessionStorage.getItem('TmpKey')).digest('hex');
    console.log('hash: ' + hash);
    this.http.get(environment.base.url + environment.base.path + '/token', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        USER_TOKEN: sessionStorage.getItem('ClientID'),
        HASH_PASS: hash,
        Email: email
      }),
    }).toPromise().then(r => {
      const response: any = r;
      console.log('response: ' + JSON.stringify(response));
      if (response.status) {
        sessionStorage.setItem('AccessToken', response.token[0].access_token);
        this.router.navigate(['/dashboard']).then();
      } else {
        this.commonService.openBar(response.error, 4000);
      }
    }).catch(error => console.log(error));
  }

  logOut(): void {
    sessionStorage.clear();
    this.http.delete(environment.base.url + environment.base.path + '/token', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        USER_TOKEN: sessionStorage.getItem('ClientID'),
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      }),
    }).toPromise().then(r => {
      const response: any = r;
      console.log('response: ' + JSON.stringify(response));
      sessionStorage.clear();
      this.router.navigate(['/']).then();
    }).catch(error => console.log(error));
  }
}
