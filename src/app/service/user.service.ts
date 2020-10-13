import {Injectable} from '@angular/core';
import {CommonService} from './common.service';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

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

  createUser(userName, mail, password): void {
    this.http.post(environment.base.url + environment.base.path + '/token', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        name: userName,
        email: mail,
        pass: password
      },
    }).toPromise().then(r => {
      const response: any = r;
      console.log('response: ' + JSON.stringify(response));
      if (response.status) {
        this.router.navigate(['/dashboard']).then();
      } else {
        this.commonService.openBar(response.error, 4000);
      }
    }).catch(error => console.log(error));
  }

  getUser(uid): Promise<any> {
    return this.http.post(environment.base.url + environment.base.path + '/user/' + uid, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        USER_TOKEN: sessionStorage.getItem('ClientID'),
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      }),
      body: {},
    }).toPromise().then(r => {
      const response: any = r;
      console.log('response: ' + JSON.stringify(response));
      if (response.status) {
        return response;
        // this.router.navigate(['/dashboard']).then();
      } else {
        this.commonService.openBar(response.error, 4000);
        return response;
      }
    }).catch(error => console.log(error));
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
      console.log('response: ' + JSON.stringify(response));
      if (response.status) {
        return response;
        // this.router.navigate(['/dashboard']).then();
      } else {
        this.commonService.openBar(response.error, 4000);
        return response;
      }
    }).catch(error => console.log(error));
  }
}

