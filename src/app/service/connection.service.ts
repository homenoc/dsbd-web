import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from './common.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(
    public router: Router,
    private commonService: CommonService,
    private http: HttpClient
  ) {
  }

  add(id, body): Promise<any> {
    return this.http.post(environment.api.url + environment.api.path + '/group/service/' + id + '/connection',
      body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          USER_TOKEN: sessionStorage.getItem('ClientID'),
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        })
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  get(uid): Promise<any> {
    return this.http.get(environment.api.url + environment.api.path + '/group/connection/' + uid, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        USER_TOKEN: sessionStorage.getItem('ClientID'),
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      }),
    }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }
}
