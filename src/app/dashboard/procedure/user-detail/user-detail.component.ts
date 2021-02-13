import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../service/common.service';
import {UserService} from '../../../service/user.service';
import {GroupService} from '../../../service/group.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as shaJS from 'sha.js';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private userService: UserService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  public id: string;
  public hide = true;
  public email = new FormControl('', [Validators.required, Validators.email]);
  public emailVerify = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl();
  public passwordVerify = new FormControl();
  public user = new FormGroup({
    org: new FormControl(''),
    org_en: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
    address_en: new FormControl(''),
    name: new FormControl(''),
    name_en: new FormControl(''),
    dept: new FormControl(''),
    dept_en: new FormControl(''),
    pos: new FormControl(''),
    pos_en: new FormControl(''),
    tel: new FormControl(''),
    fax: new FormControl(''),
    country: new FormControl(''),
  });
  public name: string;
  public lock = true;
  public userInfo: any = {};
  public group = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    nameEn: new FormControl(''),
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.userService.get(this.id).then(response => {
      this.user.patchValue({
        org: response.org,
        org_en: response.org_en,
        postcode: response.postcode,
        address: response.address,
        address_en: response.address_en,
        name: response.name,
        name_en: response.name_en,
        dept: response.dept,
        dept_en: response.dept_en,
        pos: response.pos,
        pos_en: response.pos_en,
        tel: response.tel,
        fax: response.fax,
        country: response.country,
      });
      this.userInfo = response;
      this.lock = false;
      this.commonService.openBar('OK', 5000);
    });
  }


  changeInfo(): void {
    const body = JSON.stringify(this.user.getRawValue());
    this.userService.update(0, body).then(() => {
      this.commonService.openBar('OK', 5000);
      location.reload();
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


}
