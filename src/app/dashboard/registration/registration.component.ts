import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../service/user.service';
import {GroupService} from '../../service/group.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  constructor(
    private groupService: GroupService,
    private userService: UserService,
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
              console.log(group.data[0]);
              if (group.status) {
                console.log(group.data[0].status);
                if (10 < group.data[0].status && group.data[0].status < 300) {
                }
                // if(group.data.);
              }
            });
          }
        }
        // this.router.navigate(['/dashboard/user_registration/contract1']).then();
        // this.router.navigate(['/dashboard/user_registration/contract2']).then();
      }
    );
  }
}
