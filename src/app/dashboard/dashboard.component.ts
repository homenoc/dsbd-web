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
  public request = false;
  public gid = 0;


  ngOnInit() {
    this.userService.getLoginUser().then(user => {
      if (user.status) {
        if (user.data.status === 0) {
          this.router.navigate(['/dashboard/setting']).then();
        } else if (user.data.status >= 100) {
          this.authService.logOut();
        } else {
          this.notice = true;
          if (user.data.gid === 0) {
            this.request = true;
          }
          this.groupService.get().then((group) => {
            if (group.status) {
              if (group.data.status < 1000) {
                this.info = true;
              }
            }
          }).catch();
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
