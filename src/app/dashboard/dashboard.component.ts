import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SidenavService} from '../service/sidenav.service';
import {MatSidenav} from '@angular/material/sidenav';
import {UserService} from '../service/user.service';
import {CommonService} from '../service/common.service';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';
import {GroupService} from '../service/group.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('sideNav') public sidenav: MatSidenav;

  constructor(
    public userService: UserService,
    private groupService: GroupService,
    private sidenavService: SidenavService,
    private commonService: CommonService,
    public authService: AuthService,
    private router: Router,
  ) {
  }

  public notice = false;
  public info = false;
  public registration = false;
  public support = false;
  public gid = 0;


  ngOnInit() {
    this.userService.getLoginUser().then(user => {
      if (user.status) {
        if (user.data.status === 0) {
          this.registration = false;
          this.router.navigate(['/dashboard/setting']).then();
        } else if (user.data.status >= 100) {
          this.authService.logOut();
        } else {
          this.registration = true;
          this.notice = true;
          console.log(user.data);
          if (user.data.group_id !== 0) {
            this.groupService.get().then((group) => {
              console.log(group);
              if (group.status === true) {
                if (100 <= group.group.status && group.group.status <= 500) {
                  this.info = true;
                }
                if (2 <= group.group.status && group.group.status < 300) {
                  this.registration = true;
                }
              }
            }).catch();
          } else {
            this.support = false;
          }
        }
      } else {
        this.commonService.openBar(user.error, 4000);
      }
    });
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
