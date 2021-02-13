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


  ngOnInit(): void {
    this.userService.getLoginUser().then(user => {
      this.userInfo = user;
      if (this.userInfo.group_id !== 0 && this.userInfo.level < 2) {
        this.groupLock = false;
      }
      if (this.userInfo.status === 0) {
        this.userLock = true;
      }
      console.log(user);
    });
  }

}
