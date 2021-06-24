import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SidenavService} from '../service/sidenav.service';
import {MatSidenav} from '@angular/material/sidenav';
import {UserService} from '../service/user.service';
import {CommonService} from '../service/common.service';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';
import {GroupService} from '../service/group.service';
import {CookieService} from 'ngx-cookie-service';

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
    private cookieService: CookieService,
    public authService: AuthService,
    private router: Router,
  ) {
  }

  public notice = false;
  public lock = false;
  public registration = false;
  public support = false;
  public groupStatus;
  public groupID = 0;
  public userID = 0;
  public userLevel = 0;

  ngOnInit() {
    this.userService.getLoginUser().then(user => {
      this.groupID = user.group_id;
      sessionStorage.setItem('user', JSON.stringify(user));
      if (user.group_id === 0) {
        this.router.navigate(['/dashboard/registration']).then();
      } else {
        this.registration = true;
        this.lock = true;
        this.groupStatus = user.group.status;
        this.lock = user.group.lock;
        this.userLevel = user.level;

        console.log(user);
      }
    });
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
