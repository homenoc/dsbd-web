import {Component, OnInit} from '@angular/core';
import {GroupService} from '../../../service/group.service';
import {UserService} from '../../../service/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import {CommonService} from '../../../service/common.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private commonService: CommonService,
  ) {
  }

  public lock = true;
  public userInfo: any = {};
  public group = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    nameEn: new FormControl(''),
    level: new FormControl(4),
  });

  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    this.userInfo = userData;
    if (userData.group_id !== 0 && userData.level < 3) {
      this.lock = false;
    }
  }

  addUser(): void {
    if (this.group.value.email === '') {
      this.commonService.openBar('invalid email', 5000);
      return;
    }
    if (this.group.value.name === '') {
      this.commonService.openBar('invalid name', 5000);
      return;
    }
    if (this.group.value.nameEn === '') {
      this.commonService.openBar('invalid name', 5000);
      return;
    }

    this.userService.createGroup({
      group_id: this.userInfo.group_id,
      user: true,
      leve: this.group.value.level,
      email: this.group.value.email,
      name: this.group.value.name,
      name_en: this.group.value.nameEn,
    }).then(() => {
      this.commonService.openBar('OK', 5000);
      location.reload();
    });
  }

}
