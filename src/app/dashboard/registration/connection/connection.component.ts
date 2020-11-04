import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {ConnectionService} from '../../../service/connection.service';
import {UserService} from '../../../service/user.service';
import {Router} from '@angular/router';
import {GroupService} from '../../../service/group.service';

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
    private groupService: GroupService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // アクセス制御
    this.userService.getLoginUser().then(user => {
      if (user.status && user.data.group_id === 0 && user.data.status === 0) {
        this.router.navigate(['/dashboard/registration']).then();
      }
    });
    this.groupService.get().then(group => {
      const status: number = group.group.status;
      if (group.status && !(status === 13 || status === 23 || status === 113 || status === 123)) {
        this.router.navigate(['/dashboard/registration']).then();
      }
    });
    // Groupに属するユーザをすべて取得する
    // Todo: #2 Issue
    this.userService.getGroup().then(response => {
      console.log('---response---');
      console.log(response);
      if (response.status) {
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

    if (this.connection === 'L2 構内接続' || this.connection === 'L3 StaticRouting 構内接続' ||
      this.connection === 'L3 BGP 構内接続') {
      this.ntt = '構内接続のため必要なし';
      this.termIP.setValue('構内接続のため必要なし');
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
      console.log(response.status);
      if (response.status) {
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
