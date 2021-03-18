import {Component, OnInit} from '@angular/core';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.scss']
})
export class ProcedureComponent implements OnInit {

  constructor(
    public userService: UserService,
  ) {
  }

  public open = true;
  public userInfo: any;
  public groupLock = true;
  public userLock = false;
  public userID = 0;


  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    this.userID = userData.id;
    if (userData.group_id !== 0 && userData.level < 2) {
      this.groupLock = false;
    }
    if (userData.level > 2) {
      this.userLock = true;
    }
  }
}
