import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {ConnectionService} from '../../../service/connection.service';
import {UserService} from '../../../service/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  public connection: string;
  public connectionEtc = new FormControl();
  public ntt: string;
  public noc: string;
  public termIP = new FormControl();
  public monitor: boolean;
  public user = {data: []};
  public termUser: any;


  constructor(
    private commonService: CommonService,
    private connectionService: ConnectionService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // Groupに属するユーザをすべて取得する
    // Todo: #2 Issue
    this.userService.getGroup().then(response => {
      console.log('---response---');
      console.log(response);
      if (response) {
        this.user = response;
        // this.commonService.openBar('OK', 5000);
      } else {
        sessionStorage.setItem('error', 'response: ' + JSON.stringify(response));
        this.router.navigate(['/error']).then();
      }
    }).catch();
    {

    }
  }

  request() {
    if (this.connection === 'Other') {
      this.connection = this.connectionEtc.value;
    }
    if (this.connection === '' || this.ntt === '' || this.noc === '' || this.termIP.value === '') {
      this.commonService.openBar('invalid..', 5000);
      return;
    }

    const body = {
      user_id: parseInt(this.termUser, 10),
      service: this.connection,
      ntt: this.ntt,
      noc: this.noc,
      term_ip: this.termIP.value,
      monitor: this.monitor
    };

    this.connectionService.add(body).then(response => {
      console.log('---response---');
      console.log(response);
      if (response.result) {
        this.commonService.openBar('申請完了', 5000);
        this.router.navigate(['/dashboard']).then();
      } else {
        sessionStorage.setItem('error', 'Process 1\n' + 'response: ' + JSON.stringify(response));
        this.router.navigate(['/error']).then();
        return;
      }
    });


  }

}
