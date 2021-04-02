import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../service/user.service';
import {Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {ServiceService} from '../../../service/service.service';
import {GroupService} from '../../../service/group.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-network',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  public ip: FormGroup;
  public routeV4: string;
  public routeV4Etc = new FormControl();
  public routeV6: string;
  public routeV6Etc = new FormControl();
  public routeV4Check = false;
  public routeV6Check = false;
  public asn = new FormControl();
  public jpnicJa = new FormGroup({
    org: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
  });
  public jpnicEn = new FormGroup({
    org: new FormControl(''),
    address: new FormControl(''),
  });
  public checkV4 = false;
  public checkV6 = false;
  public jpnicV4 = new FormGroup({
    name: new FormControl(''),
    subnet: new FormControl(''),
  });
  public jpnicV6 = new FormGroup({
    name: new FormControl(''),
    subnet: new FormControl(''),
  });
  public bandwidth = new FormGroup({
    aveUpstream: new FormControl(10, Validators.min(0)),
    maxUpstream: new FormControl(100, Validators.min(0)),
    aveDownstream: new FormControl(10, Validators.min(0)),
    maxDownstream: new FormControl(100, Validators.min(0)),
    asn: new FormControl()
  });
  public templateConnections: any[] = [];
  public templateServices: any[] = [];
  public ipv4Template: any[] = [];
  public ipv6Template: any[] = [];
  public users: any[] = [];
  public admin: any;
  public serviceTypeID = '0';
  public serviceComment = new FormControl();
  public bandwidthAs = false;
  public dateStart: string;
  public dateEnd: string;
  public dateEndUnlimited = false;
  public jpnicTech: FormGroup;
  public plan: FormGroup;
  public jpnicAdmin = new FormGroup({
    name: new FormControl(''),
    name_en: new FormControl(''),
    mail: new FormControl(''),
    org: new FormControl(''),
    org_en: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
    address_en: new FormControl(''),
    dept: new FormControl(''),
    dept_en: new FormControl(''),
    tel: new FormControl(''),
    fax: new FormControl(''),
    country: new FormControl(''),
  });
  public hide = false;
  public needJPNIC = false;
  public needGlobalAS = false;
  public needComment = false;
  public needRoute = false;
  public tmpIPQuantity = 0;
  public planAfter = false;
  public planHalfYear = false;
  public planOneYear = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private groupService: GroupService,
    private router: Router,
    private commonService: CommonService,
    private serviceService: ServiceService,
  ) {
  }

  ngOnInit(): void {
    // アクセス制御
    this.jpnicTech = this.formBuilder.group({
      tech: this.formBuilder.array([])
    });
    this.plan = this.formBuilder.group({
      v4: this.formBuilder.array([])
    });
    this.userService.getLoginUser().then(user => {
      if ((!(0 < user.level && user.level < 3)) || (user.group_id === 0 && user.status === 0) ||
        (!user.group.pass || !(user.group.status === 1))) {
        this.router.navigate(['/dashboard/registration']).then();
      }
    });
    this.commonService.getTemplate().then(res => {
      // console.log(res);
      this.templateConnections = res.connections;
      this.templateServices = res.services;
      this.ipv4Template = res.ipv4;
      this.ipv6Template = res.ipv6;
    });
  }

  addEventStart(event: MatDatepickerInputEvent<Date>) {
    this.dateStart = event.value.getFullYear() + '-' + ('00' + (event.value.getMonth() + 1)).slice(-2) +
      '-' + ('00' + (event.value.getDate())).slice(-2);
  }

  addEventEnd(event: MatDatepickerInputEvent<Date>) {
    this.dateEnd = event.value.getFullYear() + '-' + ('00' + (event.value.getMonth() + 1)).slice(-2) +
      '-' + ('00' + (event.value.getDate())).slice(-2);
  }

  get jpnicTechProcess(): FormArray {
    return this.jpnicTech.get('tech') as FormArray;
  }

  addTechUserOptionForm() {
    this.jpnicTechProcess.push(this.optionJPNICForm);
  }

  removeTechUserOptionForm(idx: number) {
    this.jpnicTechProcess.removeAt(idx);
  }

  copyJPNIC() {
    this.jpnicTechProcess.push(this.formBuilder.group({
      org: [this.jpnicAdmin.value.org],
      org_en: [this.jpnicAdmin.value.org_en],
      mail: [this.jpnicAdmin.value.mail],
      postcode: [this.jpnicAdmin.value.postcode],
      address: [this.jpnicAdmin.value.address],
      address_en: [this.jpnicAdmin.value.address_en],
      name: [this.jpnicAdmin.value.name],
      name_en: [this.jpnicAdmin.value.name_en],
      dept: [this.jpnicAdmin.value.dept],
      dept_en: [this.jpnicAdmin.value.dept_en],
      pos: [this.jpnicAdmin.value.pos],
      pos_en: [this.jpnicAdmin.value.pos_en],
      tel: [this.jpnicAdmin.value.tel],
      fax: [this.jpnicAdmin.value.fax],
      country: [this.jpnicAdmin.value.country],
    }));
  }

  get optionJPNICForm(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      name_en: [''],
      mail: [''],
      org: [''],
      org_en: [''],
      postcode: [''],
      address: [''],
      address_en: [''],
      dept: [''],
      dept_en: [''],
      tel: [''],
      fax: [''],
      country: [''],
    });
  }

  get planProcess(): FormArray {
    return this.plan.get('v4') as FormArray;
  }

  addPlanOptionForm() {
    this.planProcess.push(this.optionPlanForm);
  }

  removePlanOptionForm(idx: number) {
    this.planProcess.removeAt(idx);
  }

  get optionPlanForm(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      after: [''],
      half_year: [''],
      one_year: [''],
    });
  }

  changeStatus(jpnic, comment, globalAS, route: boolean) {
    this.needJPNIC = jpnic;
    this.needComment = comment;
    this.needGlobalAS = globalAS;
    this.needRoute = route;
  }

  checkPlan(): void {
    let after = 0;
    let halfYear = 0;
    let oneYear = 0;

    for (const plan of this.planProcess.value) {
      after += plan.after;
      halfYear += plan.half_year;
      oneYear += plan.one_year;
    }

    if (after > this.tmpIPQuantity / 4 && !(after > this.tmpIPQuantity)) {
      this.planAfter = true;
    } else {
      this.planAfter = false;
    }

    if (halfYear > this.tmpIPQuantity / 4 && !(halfYear > this.tmpIPQuantity)) {
      this.planHalfYear = true;
    } else {
      this.planHalfYear = false;
    }

    if (oneYear > this.tmpIPQuantity / 2 && !(oneYear > this.tmpIPQuantity)) {
      this.planOneYear = true;
    } else {
      this.planOneYear = false;
    }

    // console.log('直後: ' + after);
    // console.log('半年後: ' + halfYear);
    // console.log('1年後: ' + oneYear);
    // console.log(this.planProcess.value);
  }

  check(): boolean {

    if (this.bandwidth.value.aveUpstream === 0) {
      this.commonService.openBar('平均アップロード帯域が0です。', 5000);
      return false;
    }
    if (this.bandwidth.value.maxUpstream === 0) {
      this.commonService.openBar('最大アップロード帯域が0です。', 5000);
      return false;
    }
    if (this.bandwidth.value.aveDownstream === 0) {
      this.commonService.openBar('平均ダウンロード帯域が0です。', 5000);
      return false;
    }
    if (this.bandwidth.value.maxDownstream === 0) {
      this.commonService.openBar('最大ダウンロード帯域が0です。', 5000);
      return false;
    }

    if (this.needJPNIC || this.needGlobalAS) {
      if (!this.checkV4 && !this.checkV6) {
        this.commonService.openBar('v4とv6どちらか選択する必要があります。。', 5000);
        return false;
      }
      if (this.checkV4) {
        if (this.jpnicV4.value.name === '') {
          this.commonService.openBar('v4のネットワーク名が入力されていません。', 5000);
          return false;
        }
        if (this.jpnicV4.value.subnet === '') {
          this.commonService.openBar('v4のAddress/Subnetが入力されていません。', 5000);
          return false;
        }
      }
      if (this.checkV6) {
        if (this.jpnicV6.value.name === '') {
          this.commonService.openBar('v6のネットワーク名が入力されていません。', 5000);
          return false;
        }
        if (this.jpnicV6.value.subnet === '') {
          this.commonService.openBar('v6のAddress/Subnetが入力されていません。', 5000);
          return false;
        }
      }
    }

    if (this.needJPNIC) {
      // 管理責任者のCheck
      if (this.jpnicAdmin.value.org === '') {
        this.commonService.openBar('団体名が入力されていません。', 5000);
        return false;
      }
      if (this.jpnicAdmin.value.org_en === '') {
        this.commonService.openBar('団体名(English)が入力されていません。', 5000);
        return false;
      }
      if (this.jpnicAdmin.value.mail === '') {
        this.commonService.openBar('メールアドレスが入力されていません。', 5000);
        return false;
      }
      if (this.jpnicAdmin.value.postcode === '') {
        this.commonService.openBar('郵便番号が入力されていません。', 5000);
        return false;
      }
      if (this.jpnicAdmin.value.address === '') {
        this.commonService.openBar('住所が入力されていません。', 5000);
        return false;
      }
      if (this.jpnicAdmin.value.address_en === '') {
        this.commonService.openBar('住所(English)が入力されていません。', 5000);
        return false;
      }
      if (this.jpnicAdmin.value.group_name === '') {
        this.commonService.openBar('グループ名/個人名が入力されていません。', 5000);
        return false;
      }
      if (this.jpnicAdmin.value.group_name_en === '') {
        this.commonService.openBar('グループ名/個人名(English)が入力されていません。', 5000);
        return false;
      }
      if (this.jpnicAdmin.value.tel === '') {
        this.commonService.openBar('電話番号が入力されていません。', 5000);
        return false;
      }
      if (this.jpnicAdmin.value.country === '') {
        this.commonService.openBar('居住国が入力されていません。', 5000);
        return false;
      }
      // 技術連絡担当者のCheck
      if (this.jpnicTech.value.tech.length <= 0 || this.jpnicTech.value.tech.length > 2) {
        this.commonService.openBar('技術連絡担当者が多い又は入力されていません。', 5000);
        return false;
      }
      for (const tmp of this.jpnicTech.value.tech) {
        if (tmp.org === '') {
          this.commonService.openBar('団体名が入力されていません。', 5000);
          return false;
        }
        if (tmp.org_en === '') {
          this.commonService.openBar('団体名(English)が入力されていません。', 5000);
          return false;
        }
        if (tmp.mail === '') {
          this.commonService.openBar('メールアドレスが入力されていません。', 5000);
          return false;
        }
        if (tmp.postcode === '') {
          this.commonService.openBar('郵便番号が入力されていません。', 5000);
          return false;
        }
        if (tmp.address === '') {
          this.commonService.openBar('住所が入力されていません。', 5000);
          return false;
        }
        if (tmp.address_en === '') {
          this.commonService.openBar('住所(English)が入力されていません。', 5000);
          return false;
        }
        if (tmp.group_name === '') {
          this.commonService.openBar('グループ名/個人名が入力されていません。', 5000);
          return false;
        }
        if (tmp.group_name_en === '') {
          this.commonService.openBar('グループ名/個人名(English)が入力されていません。', 5000);
          return false;
        }
        if (tmp.tel === '') {
          this.commonService.openBar('電話番号が入力されていません。', 5000);
          return false;
        }
        if (tmp.country === '') {
          this.commonService.openBar('居住国が入力されていません。', 5000);
          return false;
        }
      }
      if (this.checkV4 && this.plan.value.v4.length === 0) {
        this.commonService.openBar('Planが設定されていません。', 5000);
        return false;
      }
    }

    if (this.needComment) {
      if (this.serviceComment.value === '') {
        this.commonService.openBar('その他の項目が入力されていません。', 5000);
        return false;
      }
    }

    if (this.needRoute) {
      if (this.routeV4 === '' && this.routeV6 === '') {
        this.commonService.openBar('経路情報が選択されていません。', 5000);
        return false;
      }
    }

    if (this.needGlobalAS) {
      if (this.asn.value === '') {
        this.commonService.openBar('AS番号が入力されていません。', 5000);
        return false;
      }
    }
    return true;
  }

  request() {

    let body: any;
    const ip: any[] = [];

    if (!this.check()) {
      return;
    }

    // 2000 , 3S00 , 3B00
    if (this.needJPNIC) {
      if (this.checkV4) {
        ip.push({
          version: 4,
          name: this.jpnicV4.value.name,
          ip: this.jpnicV4.value.subnet,
          plan: this.plan.getRawValue().v4,
          start_date: this.dateStart,
          end_date: this.dateEnd,
        });
      }
      if (this.checkV6) {
        ip.push({
          version: 6,
          name: this.jpnicV6.value.name,
          ip: this.jpnicV6.value.subnet,
          start_date: this.dateStart,
          end_date: this.dateEnd,
        });
      }

      body = {
        jpnic_admin: this.jpnicAdmin.getRawValue(),
        jpnic_tech: this.jpnicTech.getRawValue().tech,
        service_template_id: parseInt(this.serviceTypeID, 10),
        service_comment: this.serviceComment.value,
        org: this.jpnicJa.value.org,
        org_en: this.jpnicEn.value.org,
        postcode: this.jpnicJa.value.postcode,
        address: this.jpnicJa.value.address,
        address_en: this.jpnicEn.value.address,
        route_v4: this.routeV4,
        route_v6: this.routeV6,
        avg_upstream: this.bandwidth.value.aveUpstream,
        max_upstream: this.bandwidth.value.maxDownstream,
        avg_downstream: this.bandwidth.value.aveDownstream,
        max_downstream: this.bandwidth.value.maxDownstream,
        asn: this.asn.value,
        ip,
      };
    } else if (this.needGlobalAS) {
      const ipv4 = this.jpnicV4.value.subnet.split(',');
      const ipv6 = this.jpnicV6.value.subnet.split(',');
      for (const tmp of ipv4) {
        ip.push({
          version: 4,
          ip: tmp,
          start_date: this.dateStart,
          end_date: this.dateEnd,
        });
      }
      for (const tmp of ipv6) {
        ip.push({
          version: 6,
          ip: tmp,
          start_date: this.dateStart,
          end_date: this.dateEnd,
        });
      }
      body = {
        service_template_id: parseInt(this.serviceTypeID, 10),
        service_comment: this.serviceComment.value,
        route_v4: this.routeV4,
        route_v6: this.routeV6,
        avg_upstream: this.bandwidth.value.aveUpstream,
        max_upstream: this.bandwidth.value.maxDownstream,
        avg_downstream: this.bandwidth.value.aveDownstream,
        max_downstream: this.bandwidth.value.maxDownstream,
        bandwidth_as: this.bandwidth.value.asn,
        asn: this.asn.value,
        ip,
      };
    } else {
      this.commonService.openBar('Error: ServiceCode', 5000);
      return;
    }
    console.log(body);

    this.serviceService.add(body).then();
  }

  testPush() {
    this.jpnicJa.setValue({
      org: 'HomeNOC',
      postcode: '5970022',
      address: '大阪',
    });

    this.jpnicEn.setValue({
      org: 'HomeNOC',
      address: 'Osaka',
    });

    this.jpnicAdmin.setValue({
      name: 'HomeNOC 太郎',
      name_en: 'Taro HomeNOC',
      mail: 'test@homenoc.ad.jp',
      org: 'HomeNOC',
      org_en: 'HomeNOC',
      postcode: '5970022',
      address: '大阪',
      address_en: 'Osaka',
      dept: 'None',
      dept_en: 'None',
      tel: '050',
      fax: '',
      country: 'Japan',
    });
  }
}
