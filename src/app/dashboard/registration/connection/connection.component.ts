import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {ConnectionService} from '../../../service/connection.service';
import {UserService} from '../../../service/user.service';
import {Router} from '@angular/router';
import {GroupService} from '../../../service/group.service';
import {ServiceService} from '../../../service/service.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  public nttID: string;
  public nocID: string;
  public termIP = new FormControl();
  public address = new FormControl();
  public monitor: boolean;
  public termUser: any;
  public serviceID = 0;
  public connections: any[] = [];
  public connectionType: string;
  public connectionComment = new FormControl();
  public nocs: any[] = [];
  public ntts: any[] = [];
  public services: any[] = [];
  public needInternet = false;
  public needCrossConnect = false;
  public needComment = false;


  constructor(
    private commonService: CommonService,
    private connectionService: ConnectionService,
    private userService: UserService,
    private groupService: GroupService,
    private serviceService: ServiceService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // アクセス制御
    this.userService.getLoginUser().then(user => {
      if ((!(0 < user.level && user.level < 3)) || (user.group_id === 0 && user.status === 0) ||
        (!user.group.pass || !(user.group.status === 3))) {
        this.router.navigate(['/dashboard/registration']).then();
      }
    });
    this.serviceService.getAddAllow().then(service => {
      this.services = service.service;
      console.log(service);
    });
    this.commonService.getTemplate().then(res => {
      this.connections = res.connections;
      this.ntts = res.ntts;
    });
    this.commonService.getNOC().then(res => {
      this.nocs = res.noc;
    });
  }

  changeStatus(internet, crossConnect, comment: boolean) {
    this.needInternet = internet;
    this.needCrossConnect = crossConnect;
    this.needComment = comment;
  }

  request() {
    if (this.needInternet) {
      if (this.termIP.value === '') {
        this.commonService.openBar('終端先アドレスが入力されていません。', 5000);
        return;
      }
      if (this.nttID === '') {
        this.commonService.openBar('フレッツ光に関する質問が入力されていません。。', 5000);
        return;
      }
    }
    if (this.needComment && this.connectionComment.value === '') {
      this.commonService.openBar('その他項目が入力されていません。', 5000);
      return;
    }

    const body = {
      address: this.address.value,
      connection_template_id: parseInt(this.connectionType, 10),
      connection_comment: this.connectionComment.value,
      ntt_template_id: parseInt(this.nttID, 10),
      noc_id: parseInt(this.nocID, 10),
      term_ip: this.termIP.value,
      monitor: this.monitor
    };
    console.log(body);
    console.log(this.serviceID);

    this.connectionService.add(this.serviceID, body).then(() => {
      console.log('---response---');
      this.commonService.openBar('申請完了', 5000);
      this.router.navigate(['/dashboard']).then();
    });
  }
}
