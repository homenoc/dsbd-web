import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import {CommonService} from '../service/common.service';
import * as shaJS from 'sha.js';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  mailFormGroup: FormGroup;
  hide1 = true;
  hide2 = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
    private router: Router
  ) {
  }

  name = new FormControl();
  email = new FormControl();
  password = new FormControl();
  passwordVerify = new FormControl();


  ngOnInit() {
    this.mailFormGroup = this.formBuilder.group({
      mail: ['', Validators.required]
    });
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  registerUser() {
    if (this.password.value !== this.passwordVerify.value) {
      this.commonService.openBar('Password is wrong\n', 2000);
    } else {
      if (this.password.value === '' || this.email.value === '' || this.name.value === '') {
        this.commonService.openBar('value is empty', 2000);
      } else {
        const passHash: string = shaJS('sha256').update(this.password.value).digest('hex');
        this.userService.create({
          name: this.name.value,
          email: this.email.value,
          pass: passHash
        }, 0).then((result) => {
          if (!result.status) {
            console.log('response: ' + JSON.stringify(result));
            sessionStorage.setItem('error', 'user service(admin) response: ' + JSON.stringify(result));
            this.router.navigate(['/error']).then();
            return;
          }
        });
      }
    }
  }
}
