import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../service/user.service';
import {GroupService} from '../../service/group.service';
import {AuthService} from "../../service/auth.service";

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

  public loading = true;

  ngOnInit(): void {
    this.userService.getLoginUser().then((user) => {
        if (user.status) {
          if (user.data.gid === 0) {
            this.router.navigate(['/dashboard/registration/init']).then();
          } else {
            this.groupService.get().then((group) => {
              if (group.status) {
                if (1000 <= group.group.status) {
                  this.authService.logOut();
                }
              }
            });
          }
        }
      }
    );
  }
}
