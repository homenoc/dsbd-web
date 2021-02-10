import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {UserService} from '../../service/user.service';
import * as shaJS from 'sha.js';
import {Router} from '@angular/router';
import {GroupService} from '../../service/group.service';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private userService: UserService,
    private groupService: GroupService,
    private router: Router,
  ) {
  }

  public hide = true;
  public email = new FormControl('', [Validators.required, Validators.email]);
  public emailVerify = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl();
  public passwordVerify = new FormControl();
  public org = new FormControl();
  public orgEn = new FormControl();
  public postcode = new FormControl();
  public address = new FormControl();
  public addressEn = new FormControl();
  public dept = new FormControl();
  public deptEn = new FormControl();
  public pos = new FormControl();
  public posEn = new FormControl();
  public tel = new FormControl();
  public fax = new FormControl();
  public country = new FormControl();
  public name: string;
  public lock = true;
  public userInfo: any = {};
  public groupInfo: any = {};
  public group = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    nameEn: new FormControl(''),
  });


  ngOnInit(): void {
    this.name = sessionStorage.getItem('name');
    this.userService.getLoginUser().then(d => {
      if (d.data.status !== 0) {
        this.lock = false;
      }
      this.userInfo = d.data;
      if (this.userInfo.group_id !== 0) {
        this.groupService.get().then(group => {
          this.groupInfo = group;
        });
      }
    });
  }

  changeInfo(): void {
    const body = {
      org: this.org.value,
      org_en: this.orgEn.value,
      postcode: this.postcode.value,
      address: this.address.value,
      address_en: this.addressEn.value,
      dept: this.dept.value,
      dept_en: this.deptEn.value,
      pos: this.pos.value,
      pos_en: this.posEn.value,
      tel: this.tel.value,
      fax: this.fax.value,
      country: this.country.value
    };
    this.userService.update(0, body).then(response => {
      if (response.status) {
        this.commonService.openBar('OK', 5000);
        location.reload();
      } else {
        sessionStorage.setItem('error', 'response: ' + JSON.stringify(response));
        this.router.navigate(['/error']).then();
      }
    });
  }

  changeMail(): void {
    if (this.email.value === '' || this.emailVerify.value === '') {
      this.commonService.openBar('データがありません。', 5000);
      return;
    }

    if (this.email.value !== this.emailVerify.value) {
      this.commonService.openBar('メールアドレスが一致しません', 5000);
      return;
    }

    const body = {
      email: this.email.value
    };
    this.userService.update(0, body).then(response => {
      this.commonService.openBar('OK', 5000);
      location.reload();
    });
  }

  changePass(): void {
    if (this.password.value === this.passwordVerify.value) {
      const passHash: string = shaJS('sha256').update(this.password.value).digest('hex');
      const body = {
        pass: passHash
      };
      this.userService.update(0, body).then(response => {
        this.commonService.openBar('OK', 5000);
        location.reload();
      });
    } else {
      this.commonService.openBar('The password is wrong.', 2000);
    }
  }

  addGroupUser(groupHandle: boolean): void {
    if (this.group.value.email === '' || this.group.value.name === '' || this.group.value.nameEn === '') {
      this.commonService.openBar('valid', 5000);
      return;
    }

    this.userService.create({
      group_id: this.groupInfo.ID,
      user: true,
      level: 2,
      email: this.group.value.email,
      name: this.group.value.name,
      name_en: this.group.value.nameEn,
      group_handle: groupHandle
    }, 1).then(() => {
      this.commonService.openBar('OK', 5000);
      location.reload();
    });
  }
}
