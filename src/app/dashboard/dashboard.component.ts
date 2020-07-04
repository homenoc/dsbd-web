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

  public release = false;
  public registration = false;

  ngOnInit() {
    this.dataService.getStatus().then(d => {
      // console.log(d);
      if (d / 10 >= 1) {
        this.release = true;
      }
      if (0 < d % 10 && d % 10 <= 7) {
        this.registration = true;
      } else if (d === undefined) {
        this.registration = true;
      }
    })
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
