import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-contract1',
  templateUrl: './contract1.component.html',
  styleUrls: ['./contract1.component.scss']
})
export class Contract1Component implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  public agree = false;

  base1: any;
  base1_Other = new FormControl('');
  base2 = {check0: false, check1: false, check2: false, check3: false};
  base22 = new FormGroup({
    ip: new FormControl(''),
    as: new FormControl(''),
  });
  base23 = new FormGroup({
    ip: new FormControl(''),
    as: new FormControl(''),
  });
  base3 = new FormGroup({
    organization: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    country: new FormControl(''),
  });
  base4 = new FormGroup({
    organization: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    country: new FormControl(''),
  });
  base5 = new FormGroup({
    organization: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    country: new FormControl(''),
  });
  base6: any;
  base7StartIndefinite = false;
  base7StartDate = new FormControl();
  base7EndIndefinite = false;
  base7EndDate = new FormControl();
  base8 = new FormControl('');
  base9 = new FormGroup({
    aveUpstream: new FormControl(''),
    maxUpstream: new FormControl(''),
    aveDownlink: new FormControl(''),
    maxDownlink: new FormControl(''),
  });
  base9Etc: any;
  base10 = {check0: false, check1: false, check2: false, check3: false, check4: false};
  base10Other = new FormControl('');
  base11 = new FormControl('');
  base12: any;
  base13: any;

  base4check = false;
  base5check = false;

  requestUserInfo() {
    console.log(this.base1);
    console.log(this.base22.value);
    console.log(this.base23.value);
  }

}
