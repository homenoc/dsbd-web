import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    public router: Router,
    private commonService: CommonService,
    private http: HttpClient
  ) {
  }

  register(body): Promise<any> {
    return this.http.post(environment.base.url + environment.base.path + '/group',
      body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          USER_TOKEN: sessionStorage.getItem('ClientID'),
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      console.log('response: ' + JSON.stringify(response));
      if (response.status === true) {
        return response;
      } else {
        return {
          status: false,
          error: response.error.error,
          data: response
        };
      }
    }).catch(error => {
      console.log(error);
      return {status: false};
    });
  }

  get(): Promise<any> {
    return this.http.get(environment.base.url + environment.base.path + '/group', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        USER_TOKEN: sessionStorage.getItem('ClientID'),
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      })
    }).toPromise().then(r => {
      const response: any = r;
      if (response.status === true) {
        return response;
      } else {
        return {
          status: false,
          error: response.error.error,
          data: response
        };
      }
    }).catch(error => {
      console.log(error);
      return {status: false, error};
    });
  }
}
