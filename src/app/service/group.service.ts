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

  getGroup(): Promise<any> {
    return this.http.get(environment.base.url + environment.base.path + '/group', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        USER_TOKEN: sessionStorage.getItem('ClientID'),
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      })
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
    }).catch(error => {
      console.log(error);
      return {status: false};
    });
  }
}
