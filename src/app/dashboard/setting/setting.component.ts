import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {UserService} from '../../service/user.service';
import * as shaJS from 'sha.js';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private userService: UserService,
  ) {
  }

  public hide = true;
  public email = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl();
  public passwordVerify = new FormControl();
  public org = new FormControl();
  public postcode = new FormControl();
  public address = new FormControl();
  public phone = new FormControl();
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
      postcode: this.postcode.value,
      address: this.org.value,
      phone: this.phone.value,
      country: this.country.value
    };
    this.userService.update(0, body).then(response => {
      console.log('response: ' + response);
    });
  }

  changeMail(): void {
    const body = {
      email: this.email.value
    };
    this.userService.update(0, body).then(response => {
      console.log('response: ' + JSON.stringify(response));
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
      });
    } else {
      this.commonService.openBar('The password is wrong.', 2000);
    }
  }
}
