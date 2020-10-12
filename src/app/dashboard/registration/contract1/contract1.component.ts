import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DataService} from '../../../service/data.service';
import {CommonService} from '../../../service/common.service';

@Component({
  selector: 'app-contract1',
  templateUrl: './contract1.component.html',
  styleUrls: ['./contract1.component.scss']
})
export class Contract1Component implements OnInit {

  constructor(
    private dataService: DataService,
    private commonService: CommonService,
  ) {
  }

  public agree = false;
  lock = true;
  base1: any;
  base1Other = new FormControl('');
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

  base4Check = false;
  base5Check = false;

  ngOnInit(): void {
    this.dataService.getPersonalContract1().then((doc) => {
      if (doc === undefined) {
        this.lock = false;
      }
      if (!doc.lock) {
        this.lock = false;
      }
    });
  }

  errorBlank() {
    this.commonService.openBar('The field is blank.', 2000);
  }

  requestData() {
    if (this.base1 === undefined) {
      this.errorBlank();
      return;
    }
    if (this.base2.check0 === false && this.base2.check1 === false && this.base2.check2 === false && this.base2.check3 === false) {
      this.errorBlank();
      return;
    }
    if (this.base3.value.organization === '' || this.base3.value.firstName === '' ||
      this.base3.value.lastName === '' || this.base3.value.address === '' || this.base3.value.email === '' ||
      this.base3.value.phone === '' || this.base3.value.country === '') {
      this.errorBlank();
      return;
    }
    if (this.base6 === undefined || this.base8.value === '') {
      this.errorBlank();
      return;
    }
    if (this.base10.check0 === false && this.base10.check1 === false &&
      this.base10.check2 === false && this.base10.check3 === false && this.base10.check4 === false) {
      this.errorBlank();
      return;
    }
    if (this.base12 === undefined || this.base13 === undefined) {
      this.errorBlank();
      return;
    }

    const doc = {
      data10: this.base1,
      data11: this.base1Other.value,
      data20: this.base2.check0,
      data21: this.base2.check1,
      data22: this.base2.check2,
      data220: this.base22.value.ip,
      data221: this.base22.value.as,
      data23: this.base2.check3,
      data230: this.base23.value.ip,
      data231: this.base23.value.as,
      data31: this.base3.value.organization,
      data32: this.base3.value.firstName,
      data33: this.base3.value.lastName,
      data34: this.base3.value.address,
      data35: this.base3.value.email,
      data36: this.base3.value.phone,
      data37: this.base3.value.country,
      data40: this.base4Check,
      data41: this.base4.value.organization,
      data42: this.base4.value.firstName,
      data43: this.base4.value.lastName,
      data44: this.base4.value.address,
      data45: this.base4.value.email,
      data46: this.base4.value.phone,
      data47: this.base4.value.country,
      data50: this.base5Check,
      data51: this.base5.value.organization,
      data52: this.base5.value.firstName,
      data53: this.base5.value.lastName,
      data54: this.base5.value.address,
      data55: this.base5.value.email,
      data56: this.base5.value.phone,
      data57: this.base5.value.country,
      data60: this.base6,
      data70: this.base7StartIndefinite,
      data71: this.base7StartDate.value,
      data72: this.base7EndIndefinite,
      data73: this.base7EndDate.value,
      data80: this.base8.value,
      data90: this.base9.value.aveUpstream,
      data91: this.base9.value.maxUpstream,
      data92: this.base9.value.aveDownlink,
      data93: this.base9.value.maxDownlink,
      data94: this.base9Etc,
      data100: this.base10.check0,
      data101: this.base10.check1,
      data102: this.base10.check2,
      data103: this.base10.check3,
      data104: this.base10.check4,
      data105: this.base10Other.value,
      data110: this.base11.value,
      data120: this.base12,
      data130: this.base13,
      lock: true,
    };
    this.dataService.addRequestContract1(doc);

  }
}
