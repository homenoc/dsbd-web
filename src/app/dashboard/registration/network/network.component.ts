import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../../../service/user.service';
import {Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {NetworkService} from '../../../service/network.service';
import {GroupService} from '../../../service/group.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {

  public ip: FormGroup;
  public routeV4: string;
  public routeV4Etc = new FormControl();
  public routeV6: string;
  public routeV6Etc = new FormControl();
  public routeV4Check = false;
  public routeV6Check = false;
  public pi = false;
  public asn = new FormControl();
  public plan = new FormControl();
  private planJa = '      [Subnet Number1]\n' +
    '      目的: \n\n' +
    '      ----使用IPアドレス----\n' +
    '      契約後: 4\n' +
    '      半年後: 5\n' +
    '      １年後: 6\n\n' +
    '      ----IPアドレスの使用率----\n' +
    '      * この使用率はネットワークアドレスとブロードキャストアドレスも含めて計算します。\n' +
    '      契約後: 75%\n' +
    '      半年後: 87.5%\n' +
    '      １年後: 100%\n\n' +
    '      ----Other----\n' +
    '      一時接続 :\n\n\n' +
    '      ----デバイス一覧----\n' +
    '      デバイス　　 契約後/半年後/１年後\n' +
    '      ----------------------------------------------\n' +
    '      Router     1/1/1\n' +
    '      FW         1/1/1\n' +
    '      WebServer  1/2/2\n' +
    '      MailServer 1/1/2\n' +
    '      ----------------------------------------------\n' +
    '      全デバイス   4/5/6';
  private planEn = '      [Subnet Number1]\n' +
    '      Purpose of use: \n\n' +
    '      ----Use number of ip addresses----\n' +
    '      immediately after contract : 4\n' +
    '      immediately after half year : 5\n' +
    '      immediately after one year : 6\n\n' +
    '      ----Utilization rate of ip addresses----\n' +
    '      * The utilization rate is calculated by including the network address and broadcast address.\n' +
    '      immediately after contract : 75%\n' +
    '      immediately after half year : 87.5%\n' +
    '      immediately after one year : 100%\n\n' +
    '      ----Other----\n' +
    '      temporary connection :\n\n\n' +
    '      ----Device List----\n' +
    '      device 　　after contract/half year/one year\n' +
    '      ----------------------------------------------\n' +
    '      Router     1/1/1\n' +
    '      FW         1/1/1\n' +
    '      WebServer  1/2/2\n' +
    '      MailServer 1/1/2\n' +
    '      ----------------------------------------------\n' +
    '      total Device      4/5/6\n' +
    '    Please copy and complete the format for each subnet , if you use divided subnets of IPv4 address.\n' +
    '    According to JPNIC\'s rules, users must meet the following conditions.\n' +
    '        immediately after contract\n' +
    '        Over 25%\n\n' +
    '        immediately after half year\n' +
    '        Over 25%\n\n' +
    '        immediately after one year\n' +
    '        Over 50%\n\n' +
    '     ---How to calculate the utilization rate---\n' +
    '                                    Number of IP addresses to be used\n' +
    '      Utilization rate = ------------------------------------------------------------------------ x100\n' +
    '                                    Number of IP addresses to be allocated\n' +
    '    \n' +
    '    Please do not include private addresses in the utilization rate.\n' +
    '    temporary connection means that the always IP address is not used. (ex Assign IP Address by DHCP.\n' +
    '    The utilization rate is calculated by including the network address and broadcast address.\n';
  jpnicJa = new FormGroup({
    org: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
  });
  jpnicEn = new FormGroup({
    org: new FormControl(''),
    address: new FormControl(''),
  });
  checkV4 = false;
  checkV6 = false;
  jpnicV4 = new FormGroup({
    name: new FormControl(''),
    subnet: new FormControl(''),
  });
  jpnicV6 = new FormGroup({
    name: new FormControl(''),
    subnet: new FormControl(''),
  });
  public users = {data: []};
  public admin: any;
  dateStart: string;
  dateEnd: string;
  dateEndUnlimited = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private groupService: GroupService,
    private router: Router,
    private commonService: CommonService,
    private networkService: NetworkService,
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
      if (group.status && !(status === 2 || status === 11 || status === 21 || status === 111 || status === 121)) {
        this.router.navigate(['/dashboard/registration']).then();
      }
    });
    // Groupに属するユーザをすべて取得する
    // Todo: #2 Issue
    this.userService.getGroup().then(response => {
      this.users = response;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.users.data.length; i++) {
        if (this.users.data[i].group_handle) {
          this.users.data[i].name += ' (GroupHandle)';
        }
      }
      // this.users = user.data;
      console.log('---response---');
      console.log(this.users);
    });
    this.plan.setValue(this.planJa);
  }

  addEventStart(event: MatDatepickerInputEvent<Date>) {
    this.dateStart = event.value.getFullYear() + '-' + ('00' + (event.value.getMonth() + 1)).slice(-2) +
      '-' + ('00' + (event.value.getDate())).slice(-2);
  }

  addEventEnd(event: MatDatepickerInputEvent<Date>) {
    this.dateStart = event.value.getFullYear() + '-' + ('00' + (event.value.getMonth() + 1)).slice(-2) +
      '-' + ('00' + (event.value.getDate())).slice(-2);
  }

  request() {
    // TODO: #1 Issue
    console.log(this.users.data);
    if (this.routeV4 === '' && this.routeV6 === '') {
      this.commonService.openBar('invalid..', 5000);
      return;
    }
    if (this.pi) {
      if (this.asn.value === '') {
        this.commonService.openBar('asn invalid..', 5000);
        return;
      }
    } else {
      if (this.admin === '') {
        this.commonService.openBar('no select (operation staff)', 5000);
      }
    }

    const tech: any[] = new Array();

    for (const u of this.users.data) {
      if (u.select) {
        tech.push(u.ID);
      }
    }

    // // date定義
    // let date: string;
    // if (this.dateEndUnlimited) {
    //   date = '接続開始日: ' + this.dateStart + '\n接続終了日: 未定';
    // } else {
    //   date = '接続開始日: ' + this.dateStart + '\n接続終了日: ' + this.dateEnd;
    // }

    const ip: any[] = [];

    if (this.checkV4) {
      ip.push({
        version: 4,
        ip: this.jpnicV4.value.subnet,
        plan: this.plan.value,
        start_date: this.dateStart,
        end_date: this.dateEnd,
      });
    }

    if (this.checkV6) {
      ip.push({
        version: 6,
        ip: this.jpnicV6.value.subnet,
        start_date: this.dateStart,
        end_date: this.dateEnd,
      });
    }

    const body = {
      admin_id: parseInt(this.admin, 10),
      tech_id: tech,
      org: this.jpnicJa.value.org,
      org_en: this.jpnicEn.value.org,
      postcode: this.jpnicJa.value.postcode,
      address: this.jpnicJa.value.address,
      address_en: this.jpnicEn.value.address,
      route_v4: this.routeV4,
      route_v6: this.routeV6,
      pi: this.pi,
      asn: this.asn.value,
      ip,
      v4_name: this.jpnicV4.value.name,
      v6_name: this.jpnicV6.value.name,
    };

    console.log(body);

    this.networkService.add(body).then(response => {
      console.log('---response---');
      console.log(response);
      this.commonService.openBar('申請完了', 5000);
      this.router.navigate(['/dashboard']).then();
    });
  }
}
