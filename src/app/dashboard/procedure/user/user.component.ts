import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    public userService: UserService
  ) {
  }

  public userInfo: any[] = [];

  ngOnInit(): void {
    this.userService.getGroup().then(d => {
      this.userInfo = d.user;
      console.log(d);
    });
  }

}
