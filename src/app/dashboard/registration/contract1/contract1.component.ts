import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {DataService} from "../../../service/data.service";
import {CommonService} from "../../../service/common.service";

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

  base4Check = false;
  base5Check = false;

  requestUserInfo() {
    console.log(this.base1);
    console.log(this.base22.value);
    console.log(this.base23.value);
    let status = true;

    if (this.base1 === undefined) {
      status = false;
    }
    if (this.base2.check0 === false || this.base2.check1 === false || this.base2.check2 === false || this.base2.check3 === false) {
      status = false;
    }
    if (this.base3.value.organization === '' || this.base3.value.firstName === '' || this.base3.value.lastName === '' || this.base3.value.address === '' || this.base3.value.email === '' || this.base3.value.phone === '' || this.base3.value.country === '') {
      status = false;
    }
    if (this.base6 === undefined || this.base8.value === '') {
      status = false;
    }
    if (this.base10.check0 === false || this.base10.check1 === false || this.base10.check2 === false || this.base10.check3 === false || this.base10.check4 === false) {
      status = false;
    }
    if (this.base12 === undefined || this.base13 === undefined) {
      status = false;
    }

    if (status) {
      const doc = {};
      doc['data10'] = this.base1;
      doc['data11'] = this.base1_Other.value;
      doc['data20'] = this.base2.check0;
      doc['data21'] = this.base2.check1;
      doc['data22'] = this.base2.check2;
      doc['data220'] = this.base22.value.ip;
      doc['data221'] = this.base22.value.as;
      doc['data23'] = this.base2.check3;
      doc['data230'] = this.base23.value.ip;
      doc['data231'] = this.base23.value.as;
      doc['data31'] = this.base3.value.organization;
      doc['data32'] = this.base3.value.firstName;
      doc['data33'] = this.base3.value.lastName;
      doc['data34'] = this.base3.value.address;
      doc['data35'] = this.base3.value.email;
      doc['data36'] = this.base3.value.phone;
      doc['data37'] = this.base3.value.country;
      doc['data40'] = this.base4Check;
      doc['data41'] = this.base4.value.organization;
      doc['data42'] = this.base4.value.firstName;
      doc['data43'] = this.base4.value.lastName;
      doc['data44'] = this.base4.value.address;
      doc['data45'] = this.base4.value.email;
      doc['data46'] = this.base4.value.phone;
      doc['data47'] = this.base4.value.country;
      doc['data50'] = this.base5Check;
      doc['data51'] = this.base5.value.organization;
      doc['data52'] = this.base5.value.firstName;
      doc['data53'] = this.base5.value.lastName;
      doc['data54'] = this.base5.value.address;
      doc['data55'] = this.base5.value.email;
      doc['data56'] = this.base5.value.phone;
      doc['data57'] = this.base5.value.country;
      doc['data60'] = this.base6;
      doc['data70'] = this.base7StartIndefinite;
      doc['data71'] = this.base7StartDate.value;
      doc['data72'] = this.base7EndIndefinite;
      doc['data73'] = this.base7EndDate.value;
      doc['data80'] = this.base8.value;
      doc['data90'] = this.base9.value.aveUpstream;
      doc['data91'] = this.base9.value.maxUpstream;
      doc['data92'] = this.base9.value.aveDownlink;
      doc['data93'] = this.base9.value.maxDownlink;
      doc['data94'] = this.base9Etc;
      doc['data100'] = this.base10.check0;
      doc['data101'] = this.base10.check1;
      doc['data102'] = this.base10.check2;
      doc['data103'] = this.base10.check3;
      doc['data104'] = this.base10.check4;
      doc['data105'] = this.base10Other.value;
      doc['data110'] = this.base11.value;
      doc['data120'] = this.base12;
      doc['data130'] = this.base13;
      this.dataService.addRequestContract1(doc);
    } else {
      this.commonService.openBar('The field is blank.', 2000);
    }
  }
}
