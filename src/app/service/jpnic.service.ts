import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class JpnicService {

  constructor(
    private router: Router,
    private commonService: CommonService,
    private http: HttpClient
  ) {
  }

  add(body): Promise<any> {
    return this.http.post(environment.api.url + environment.api.path + '/group/service/jpnic',
      body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          USER_TOKEN: sessionStorage.getItem('ClientID'),
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        })
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
      return {status: false, error};
    });
  }

  delete(id): Promise<any> {
    return this.http.delete(environment.api.url + environment.api.path + '/group/service/jpnic/' + id,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          USER_TOKEN: sessionStorage.getItem('ClientID'),
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        })
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
      return {status: false, error};
    });
  }

  get(id): Promise<any> {
    return this.http.get(environment.api.url + environment.api.path + '/group/service/jpnic/' + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        USER_TOKEN: sessionStorage.getItem('ClientID'),
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      }),
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

  getAll(): Promise<any> {
    return this.http.get(environment.api.url + environment.api.path + '/group/service/jpnic/all', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          USER_TOKEN: sessionStorage.getItem('ClientID'),
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }
    ).toPromise().then(r => {
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

  update(uid, body): Promise<any> {
    return this.http.put(environment.api.url + environment.api.path + '/group/service/jpnic/' + uid,
      body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          USER_TOKEN: sessionStorage.getItem('ClientID'),
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
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
