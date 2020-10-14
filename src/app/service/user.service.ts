import {Injectable} from '@angular/core';
import {CommonService} from './common.service';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import * as shaJS from 'sha.js';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public router: Router,
    private commonService: CommonService,
    private http: HttpClient
  ) {
  }

  create(userName, mail, password): void {
    const passHash: string = shaJS('sha256').update(password).digest('hex');
    this.http.post(environment.base.url + environment.base.path + '/user',
      {
        name: userName,
        email: mail,
        pass: passHash
      }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }).toPromise().then(r => {
      const response: any = r;
      console.log('response: ' + JSON.stringify(response));
      if (response.status) {
        this.router.navigate(['/dashboard']).then();
      } else {
        this.commonService.openBar(response.error, 4000);
      }
    }).catch(error => {
      console.log(error);
      return {status: false};
    });
  }

  get(uid): Promise<any> {
    return this.http.post(environment.base.url + environment.base.path + '/user/' + uid, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        USER_TOKEN: sessionStorage.getItem('ClientID'),
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      }),
      body: {},
    }).toPromise().then(r => {
      const response: any = r;
      if (response.status) {
        return response;
        // this.router.navigate(['/dashboard']).then();
      } else {
        this.commonService.openBar(response.error, 4000);
        return response;
      }
    }).catch(error => {
      console.log(error);
      return {status: false};
    });
  }

  getLoginUser(): Promise<any> {
    return this.http.get(environment.base.url + environment.base.path + '/user', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        USER_TOKEN: sessionStorage.getItem('ClientID'),
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      }),
    }).toPromise().then(r => {
      const response: any = r;
      if (response.status) {
        return response;
        // this.router.navigate(['/dashboard']).then();
      } else {
        this.commonService.openBar(response.error, 4000);
        return response;
      }
    }).catch(error => {
      console.log(error);
      return {status: false};
    });
  }

  update(uid, data): Promise<any> {
    return this.http.put(environment.base.url + environment.base.path + '/user/' + uid,
      data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          USER_TOKEN: sessionStorage.getItem('ClientID'),
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      if (response.status) {
        return response;
        // this.router.navigate(['/dashboard']).then();
      } else {
        this.commonService.openBar(response.error, 4000);
        return response;
      }
    }).catch(error => {
      console.log(error);
      return {status: false};
    });
  }
}

