import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../../../service/user.service';
import {Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {NetworkService} from '../../../service/network.service';
import {JpnicAdminService} from '../../../service/jpnic-admin.service';
import {JpnicTechService} from '../../../service/jpnic-tech.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {

  public ip: FormGroup;
  public route: string;
  public bgpEtc = new FormControl();
  public pi = false;
  public asn = new FormControl();
  public date = new FormControl();
  public plan = new FormControl();
  private dateJa = '要望に答えられない可能性があります。\n（接続終了期限が未定の場合は「未定」と記入してください。）\n\n' +
    '#接続開始日\n\n\n#接続終了日\n\n\n';
  private dateEn = 'Sorry, we may not be able to meet your request.\n\n' + '#Scheduled start date for connection\n\n\n' +
    'Scheduled end date for connection\n\n\n';
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


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private commonService: CommonService,
    private networkService: NetworkService,
    private jpnicAdminService: JpnicAdminService,
    private jpnicTechService: JpnicTechService
  ) {
  }

  ngOnInit(): void {
    // Groupに属するユーザをすべて取得する
    // Todo: #2 Issue
    this.userService.getGroup().then(response => {
      if (response) {
        this.users = response;
        // this.users = user.data;
        console.log('---response---');
        console.log(this.users);
      } else {
        sessionStorage.setItem('error', 'response: ' + JSON.stringify(response));
        this.router.navigate(['/error']).then();
      }
    }).catch();
    {

    }
    this.date.setValue(this.dateJa);
    this.plan.setValue(this.planEn);
  }

  request() {
    // TODO: #1 Issue
    console.log(this.users);
    if (this.route === '' || this.date.value === null) {
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
      tech.push(u.ID);
    }

    const body = {
      admin_id: parseInt(this.admin, 10),
      tech_id: tech,
      org: this.jpnicJa.value.org,
      org_en: this.jpnicEn.value.org,
      postcode: this.jpnicJa.value.postcode,
      address: this.jpnicJa.value.address,
      address_en: this.jpnicEn.value.address,
      route: this.route,
      pi: this.pi,
      asn: this.asn.value,
      v4: this.jpnicV4.value.subnet,
      v6: this.jpnicV6.value.subnet,
      v4_name: this.jpnicV4.value.name,
      v6_name: this.jpnicV6.value.name,
      date: this.date.value,
      plan: this.plan.value,
    };

    console.log(body);

    this.networkService.add(body).then(response => {
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
