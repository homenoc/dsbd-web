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

  // type| 0:なし 1:ネットワーク情報記入 2:接続情報記入
  public type = 0;

  ngOnInit(): void {
    this.userService.getLoginUser().then((user) => {
        if (user.status) {
          if (user.data.gid === 0) {
            this.router.navigate(['/dashboard/registration/init']).then();
          } else {
            this.groupService.get().then((group) => {
              if (group.status) {
                const status = group.group.status;
                if (status === 2 || status === 11 || status === 21 || status === 111 || status === 121) {
                  this.router.navigate(['/dashboard/registration/network']).then();
                }
                if (status === 12 || status === 22 || status === 112 || status === 122) {
                  this.type = 1;
                }
                if (status === 13 || status === 23 || status === 113 || status === 123) {
                  this.router.navigate(['/dashboard/registration/connection']).then();
                }
                if (status === 14 || status === 24 || status === 114 || status === 124) {
                  this.type = 2;
                }
              }
            });
          }
        }
      }
    );
  }
}
