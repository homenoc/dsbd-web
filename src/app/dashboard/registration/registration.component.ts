import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../service/user.service';
import {GroupService} from '../../service/group.service';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  // type| 0:なし 1:初期審査 2:ネットワーク情報記入 3:接続情報記入
  public type = 0;
  public lock = false;

  ngOnInit(): void {
    this.userService.getLoginUser().then((user) => {
        if (user.status) {
          if (user.data.status === 0) {
            this.lock = true;
          } else {
            if (user.data.group_id === 0) {
              this.router.navigate(['/dashboard/registration/init']).then();
            } else {
              this.groupService.get().then((group) => {
                if (group.status) {
                  const status = group.group.status;
                  if (status === 1) {
                    this.type = 1;
                  }
                  if (status === 2 || status === 11 || status === 21 || status === 111 || status === 121) {
                    this.router.navigate(['/dashboard/registration/network']).then();
                  }
                  if (status === 12 || status === 22 || status === 112 || status === 122) {
                    this.type = 2;
                  }
                  if (status === 13 || status === 23 || status === 113 || status === 123) {
                    this.router.navigate(['/dashboard/registration/connection']).then();
                  }
                  if (status === 14 || status === 24 || status === 114 || status === 124) {
                    this.type = 3;
                  }
                  if (status === 500) {
                    this.type = 10;
                  }
                }
              });
            }
          }
        }
      }
    );
  }
}
