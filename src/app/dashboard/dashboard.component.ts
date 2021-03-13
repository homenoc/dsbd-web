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
  public open = false;
  public lock = false;
  public registration = false;
  public support = false;
  public user;
  public groupStatus;
  public groupID = 0;

  ngOnInit() {
    this.userService.getLoginUser().then(user => {
      this.groupID = user.group_id;
      if (user.group_id === 0) {
        this.router.navigate(['/dashboard/registration']).then();
      } else {
        console.log(user);
        if (user.group_id !== 0) {
          this.registration = true;
          this.groupService.get().then((group) => {
            this.support = true;
            this.groupStatus = group.status;
            console.log(group);
            this.open = group.open;
            this.lock = group.lock;
          }).catch();
        } else {
          this.support = false;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
