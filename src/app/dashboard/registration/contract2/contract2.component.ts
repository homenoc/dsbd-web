import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {DataService} from "../../../service/data.service";
import {CommonService} from "../../../service/common.service";

@Component({
  selector: 'app-contract2',
  templateUrl: './contract2.component.html',
  styleUrls: ['./contract2.component.scss']
})
export class Contract2Component implements OnInit {

  constructor(
    private dataService: DataService,
    private commonService: CommonService,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getPersonalContract2().then((doc) => {
      if (doc !== 0 || doc.lock) {
        this.lock = false;
      }
    });
  }

  lock = true;
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

  errorBlank() {
    this.commonService.openBar('The field is blank.', 2000);
  }

  requestData() {
    if (this.base5.value === '') {
      this.errorBlank()
      return;
    }

    const doc = {};
    doc['data100'] = this.base1_ja.value.address;
    doc['data101'] = this.base1_ja.value.organization;
    doc['data102'] = this.base1_ja.value.organization_f;
    doc['data110'] = this.base1_en.value.address;
    doc['data111'] = this.base1_en.value.organization;
    doc['data200'] = this.base2V4Check;
    doc['data201'] = this.base2V4.value;
    doc['data202'] = this.base2V4Name.value;
    doc['data210'] = this.base2V6Check;
    doc['data211'] = this.base2V6.value;
    doc['data212'] = this.base2V6Name.value;
    doc['data310'] = this.base3_ja.value.name;
    doc['data311'] = this.base3_ja.value.organization;
    doc['data312'] = this.base3_ja.value.postalCode;
    doc['data313'] = this.base3_ja.value.address;
    doc['data314'] = this.base3_ja.value.department;
    doc['data315'] = this.base3_ja.value.position;
    doc['data316'] = this.base3_ja.value.tel;
    doc['data317'] = this.base3_ja.value.fax;
    doc['data318'] = this.base3_ja.value.email;
    doc['data320'] = this.base3_en.value.name;
    doc['data321'] = this.base3_en.value.organization;
    doc['data322'] = this.base3_en.value.address;
    doc['data323'] = this.base3_en.value.department;
    doc['data324'] = this.base3_en.value.position;
    doc['data400'] = this.base4Check;
    doc['data410'] = this.base4_ja.value.name;
    doc['data411'] = this.base4_ja.value.organization;
    doc['data412'] = this.base4_ja.value.postalCode;
    doc['data413'] = this.base4_ja.value.address;
    doc['data414'] = this.base4_ja.value.department;
    doc['data415'] = this.base4_ja.value.position;
    doc['data416'] = this.base4_ja.value.tel;
    doc['data417'] = this.base4_ja.value.fax;
    doc['data418'] = this.base4_ja.value.email;
    doc['data420'] = this.base4_en.value.name;
    doc['data421'] = this.base4_en.value.organization;
    doc['data422'] = this.base4_en.value.address;
    doc['data423'] = this.base4_en.value.department;
    doc['data424'] = this.base4_en.value.position;
    doc['data500'] = this.base5.value;
    doc['lock'] = true;

    this.dataService.addRequestContract2(doc);
  }

}
