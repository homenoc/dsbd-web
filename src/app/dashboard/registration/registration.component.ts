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
  public status = 0;
  public lock = false;
  public pass = false;

  ngOnInit(): void {
    this.userService.getLoginUser().then((user) => {
        if (user.group_id === 0) {
          this.router.navigate(['/dashboard/registration/init']).then();
        } else {
          this.groupService.get().then((group) => {
            console.log(group);
            this.status = group.status;
            this.pass = group.pass;

            // ユーザ記入段階
            if (this.status === 1) {
              this.router.navigate(['/dashboard/registration/service']).then();
            }
            // ユーザ側接続記入段階
            if (this.status === 3) {
              this.router.navigate(['/dashboard/registration/connection']).then();
            }
          });
        }
      }
    );
  }
}
