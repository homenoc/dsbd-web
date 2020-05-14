import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../service/user.service";
import {CommonService} from "../service/common.service";

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
  ) {
  }

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
    if (this.password.value != this.passwordVerify.value) {
      this.commonService.openBar("パスワードが異なります", 2000)
    } else {
      this.userService.createUser(this.email.value, this.password.value)
    }
  }


}
