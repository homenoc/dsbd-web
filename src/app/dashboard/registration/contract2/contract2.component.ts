import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-contract2',
  templateUrl: './contract2.component.html',
  styleUrls: ['./contract2.component.scss']
})
export class Contract2Component implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  base1_ja = new FormGroup({
    address: new FormControl(''),
    organization: new FormControl(''),
    organization_f: new FormControl(''),
  });
  base1_en = new FormGroup({
    address: new FormControl(''),
    organization: new FormControl(''),
  })
  base2V4Check = false;
  base2V4 = new FormControl('');
  base2V4Name = new FormControl('');
  base2V6Check = false;
  base2V6 = new FormControl('');
  base2V6Name = new FormControl('');
  base3_ja = new FormGroup({
    name: new FormControl(''),
    organization: new FormControl(''),
    postalCode: new FormControl(''),
    address: new FormControl(''),
    department: new FormControl(''),
    position: new FormControl(''),
    tel: new FormControl(''),
    fax: new FormControl(''),
    email: new FormControl(''),
  });
  base3_en = new FormGroup({
    name: new FormControl(''),
    organization: new FormControl(''),
    address: new FormControl(''),
    department: new FormControl(''),
    position: new FormControl(''),
  });
  base4Check = false;
  base4_ja = new FormGroup({
    name: new FormControl(''),
    organization: new FormControl(''),
    postalCode: new FormControl(''),
    address: new FormControl(''),
    department: new FormControl(''),
    position: new FormControl(''),
    tel: new FormControl(''),
    fax: new FormControl(''),
    email: new FormControl(''),
  });
  base4_en = new FormGroup({
    name: new FormControl(''),
    organization: new FormControl(''),
    address: new FormControl(''),
    department: new FormControl(''),
    position: new FormControl(''),
  });
  base5 = new FormControl('');

  public agree = false;

  requestUserInfo() {

  }

}
