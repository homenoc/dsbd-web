import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {UserService} from '../../service/user.service';
import * as shaJS from 'sha.js';
import {Router} from '@angular/router';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  public hide = true;
  public email = new FormControl('', [Validators.required, Validators.email]);
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


  ngOnInit(): void {
    this.name = sessionStorage.getItem('name');
    this.userService.getLoginUser().then(d => {
      if (d.status) {
        if (d.data.status !== 0) {
          this.lock = false;
        }
        console.log(d.data);
        this.userInfo = d.data;
      }
    });
  }

  changeInfo(): void {
    const body = {
      org: this.org.value,
      org_en: this.orgEn.value,
      postcode: this.postcode.value,
      address: this.org.value,
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
      console.log('response: ' + JSON.stringify(response));
      if (response) {
        this.commonService.openBar('OK', 5000);
      } else {
        sessionStorage.setItem('error', 'response: ' + JSON.stringify(response));
        this.router.navigate(['/error']).then();
      }
    });
  }

  changeMail(): void {
    const body = {
      email: this.email.value
    };
    this.userService.update(0, body).then(response => {
      console.log('response: ' + JSON.stringify(response));
      if (response) {
        this.commonService.openBar('OK', 5000);
      } else {
        sessionStorage.setItem('error', 'response: ' + JSON.stringify(response));
        this.router.navigate(['/error']).then();
      }
    });
  }

  changePass(): void {
    if (this.password.value === this.passwordVerify.value) {
      const passHash: string = shaJS('sha256').update(this.password.value).digest('hex');
      const body = {
        pass: passHash
      };
      this.userService.update(0, body).then(response => {
        console.log('response: ' + JSON.stringify(response));
        if (response) {
          this.commonService.openBar('OK', 5000);
        } else {
          sessionStorage.setItem('error', 'response: ' + JSON.stringify(response));
          this.router.navigate(['/error']).then();
        }
      });
    } else {
      this.commonService.openBar('The password is wrong.', 2000);
    }
  }
}
