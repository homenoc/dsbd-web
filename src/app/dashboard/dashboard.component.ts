import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {SidenavService} from "../service/sidenav.service";
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('sideNav') public sidenav: MatSidenav;

  constructor(
    public authService: AuthService,
    private sidenavService: SidenavService,
  ) {
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
