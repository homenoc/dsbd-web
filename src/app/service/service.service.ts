import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from './common.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(
    public router: Router,
    private commonService: CommonService,
    private http: HttpClient
  ) {
  }

  add(body): Promise<any> {
    return this.http.post(environment.api.url + environment.api.path + '/group/service',
      body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          USER_TOKEN: sessionStorage.getItem('ClientID'),
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        })
      }).toPromise().then(r => {
      this.commonService.openBar('申請完了', 5000);
      this.router.navigate(['/dashboard']).then();
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      console.log(error);
      this.commonService.openBar(error.error.error, 2000);
    });
  }

  get(): Promise<any> {
    return this.http.get(environment.api.url + environment.api.path + '/group/service', {
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

  getAddAllow(): Promise<any> {
    return this.http.get(environment.api.url + environment.api.path + '/group/service/add_allow', {
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

  confirm(body): Promise<any> {
    return this.http.post(environment.api.url + environment.api.path + '/group/service/confirm',
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
}
