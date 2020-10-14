import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SidenavService} from '../service/sidenav.service';
import {MatSidenav} from '@angular/material/sidenav';
import {UserService} from '../service/user.service';
import {CommonService} from '../service/common.service';
import {AuthService} from '../service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('sideNav') public sidenav: MatSidenav;

  constructor(
    public userService: UserService,
    private sidenavService: SidenavService,
    private commonService: CommonService,
    public authService: AuthService,
  ) {
  }

  public release = false;
  public registration = false;
  public gid = 0;


  ngOnInit() {
    this.userService.getLoginUser().then(d => {
      if (d.status) {
        this.gid = d.data.gid;
      } else {
        this.commonService.openBar(d.error, 4000);
      }
    });
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
