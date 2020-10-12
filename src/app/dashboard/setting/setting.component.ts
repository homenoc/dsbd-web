import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private afAuth: AngularFireAuth,
  ) {
  }

  hide = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl();
  passwordVerify = new FormControl();
  id: string;


  ngOnInit(): void {
    this.id = localStorage.getItem('authID');
  }

  changeMail(): void {
    this.afAuth.currentUser.then(r => {
      r.verifyBeforeUpdateEmail(this.email.value).then(() => this.commonService.openBar('Updated email address!', 2000));
    })
      .catch(error => this.commonService.openBar('Error: ' + error, 200));
  }

  changePass(): void {
    if (this.password.value === this.passwordVerify.value) {
      this.afAuth.currentUser.then(r => {
        r.updatePassword(this.password.value)
          .then(() => this.commonService.openBar('Updated password!', 2000))
          .catch(error => this.commonService.openBar('Error: ' + error, 200));
      }).catch(error => this.commonService.openBar('Error: ' + error, 200));
    } else {
      this.commonService.openBar('The password is wrong.', 2000);
    }
  }

}
