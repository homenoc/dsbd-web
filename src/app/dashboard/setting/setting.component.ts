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

  public hide = false;
  public email = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl();
  public passwordVerify = new FormControl();
  public name: string;


  ngOnInit(): void {
    this.name = sessionStorage.getItem('name');
  }

  changeMail(): void {
    const body = {
      email: this.email.value
    };
    this.userService.update(0, body).then(response => {
      console.log(response);
    });
  }

  changePass(): void {
    if (this.password.value === this.passwordVerify.value) {
      const passHash: string = shaJS('sha256').update(this.password.value).digest('hex');
      const body = {
        pass: passHash
      };
      this.userService.update(0, body).then(response => {
        console.log(response);
      });
    } else {
      this.commonService.openBar('The password is wrong.', 2000);
    }
  }
}
