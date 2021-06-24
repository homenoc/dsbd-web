import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {GroupService} from '../../../service/group.service';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  constructor(
    public groupService: GroupService,
  ) {
  }

  public group = new FormGroup({
    org: new FormControl(''),
    org_en: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
    address_en: new FormControl(''),
    tel: new FormControl(''),
    country: new FormControl(''),
  });
  public groupInfo: any;
  public userInfo: any;
  public lock = true;
  public hide = true;


  ngOnInit(): void {
    this.groupService.get().then(group => {
      console.log(group);
      this.groupInfo = group.group;
      this.lock = false;
    });
  }

  changeInfo(): void {
    const body = JSON.stringify(this.group.getRawValue());
    this.groupService.update(body).then();
  }
}
