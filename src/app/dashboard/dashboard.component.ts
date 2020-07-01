import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {SidenavService} from "../service/sidenav.service";
import {MatSidenav} from "@angular/material/sidenav";
import {DataService} from "../service/data.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('sideNav') public sidenav: MatSidenav;

  constructor(
    public authService: AuthService,
    private sidenavService: SidenavService,
    private dataService: DataService,
  ) {
  }

  public release = 0;

  ngOnInit() {
    this.dataService.getStatus().then(d => {
        this.release = d;
    })
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
