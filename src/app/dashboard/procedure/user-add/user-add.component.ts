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
  public groupInfo: any = {};
  public group = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    nameEn: new FormControl(''),
  });

  ngOnInit(): void {
    this.userService.getLoginUser().then(d => {
      if (d.status !== 0) {
        this.lock = false;
      }
      this.userInfo = d;
      if (this.userInfo.group_id !== 0) {
        this.groupService.get().then(group => {
          this.groupInfo = group;
        });
      }
    });
  }

  addUser(groupHandle: boolean): void {
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

    this.userService.create({
      group_id: this.groupInfo.id,
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
