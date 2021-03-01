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

  public ntt: string;
  public noc: string;
  public termIP = new FormControl();
  public monitor: boolean;
  public user: any[] = [];
  public termUser: any;
  public connections: any[] = [];
  public connectionType: string;
  public connectionComment = new FormControl();
  public nocs: any[] = [];


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
      if (user.status && user.group_id === 0 && user.status === 0) {
        this.router.navigate(['/dashboard/registration']).then();
      }
    });
    this.groupService.get().then(group => {
      if (!group.pass || !(group.status === 3)) {
        this.router.navigate(['/dashboard/registration']).then();
      }
    });
    this.commonService.getService().then(res => {
      this.connections = res.connection;
      console.log(res);
    });
    this.commonService.getNOC().then(res => {
      this.nocs = res.noc;
      console.log(res);
    });

    // Groupに属するユーザをすべて取得する
    // Todo: #2 Issue
    this.userService.getGroup().then(response => {
      this.user = response.user;
    });
  }

  request() {
    const body = {
      user_id: parseInt(this.termUser, 10),
      connection_type: this.connectionType,
      connection_comment: this.connectionComment.value,
      ntt: this.ntt,
      noc: this.noc,
      term_ip: this.termIP.value,
      monitor: this.monitor
    };

    this.connectionService.add(body).then(() => {
      console.log('---response---');
      this.commonService.openBar('申請完了', 5000);
      this.router.navigate(['/dashboard']).then();
    });
  }
}
