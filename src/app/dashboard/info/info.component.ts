import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-data',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {


  constructor(
    private http: HttpClient
  ) {
  }

  public info = [];
  public result = true;
  public errorResult: string;
  public errorDetailJSON: string;

  ngOnInit() {
    this.http.get(environment.api.url + environment.api.path + '/group/info', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        USER_TOKEN: sessionStorage.getItem('ClientID'),
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      }),
    }).toPromise().then(r => {
      this.info = r[`info`];
    }).catch(error => {
      console.log(error);
      this.result = false;
      this.errorResult = error.error.error;
      this.errorDetailJSON = JSON.stringify(error);
    });
  }
}
