import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {GroupService} from '../../../service/group.service';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  constructor(
    public groupService: GroupService,
    public userService: UserService,
  ) {
  }

  public group = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    nameEn: new FormControl(''),
  });
  public groupInfo: any;
  public userInfo: any;
  public lock = true;


  ngOnInit(): void {
    this.userService.getLoginUser().then(user => {
      if (user.level <= 1) {
        this.groupService.get().then(group => {
          console.log(group);
          this.groupInfo = group;
          this.lock = false;
        });
      }
    });
  }
}
