import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DataService} from '../../../service/data.service';
import {CommonService} from '../../../service/common.service';

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

  lock = true;
  base1Ja = new FormGroup({
    address: new FormControl(''),
    organization: new FormControl(''),
    organization_f: new FormControl(''),
  });
  base1En = new FormGroup({
    address: new FormControl(''),
    organization: new FormControl(''),
  });
  base2V4Check = false;
  base2V4 = new FormControl('');
  base2V4Name = new FormControl('');
  base2V6Check = false;
  base2V6 = new FormControl('');
  base2V6Name = new FormControl('');
  base3Ja = new FormGroup({
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
  base3En = new FormGroup({
    name: new FormControl(''),
    organization: new FormControl(''),
    address: new FormControl(''),
    department: new FormControl(''),
    position: new FormControl(''),
  });
  base4Check = false;
  base4Ja = new FormGroup({
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
  base4En = new FormGroup({
    name: new FormControl(''),
    organization: new FormControl(''),
    address: new FormControl(''),
    department: new FormControl(''),
    position: new FormControl(''),
  });
  base5 = new FormControl('');

  public agree = false;

  ngOnInit(): void {
    this.dataService.getPersonalContract2().then((doc) => {
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
    if (this.base5.value === '') {
      this.errorBlank();
      return;
    }

    const doc = {
      data100: this.base1Ja.value.address,
      data101: this.base1Ja.value.organization,
      data102: this.base1Ja.value.organization_f,
      data110: this.base1En.value.address,
      data111: this.base1En.value.organization,
      data200: this.base2V4Check,
      data201: this.base2V4.value,
      data202: this.base2V4Name.value,
      data210: this.base2V6Check,
      data211: this.base2V6.value,
      data212: this.base2V6Name.value,
      data310: this.base3Ja.value.name,
      data311: this.base3Ja.value.organization,
      data312: this.base3Ja.value.postalCode,
      data313: this.base3Ja.value.address,
      data314: this.base3Ja.value.department,
      data315: this.base3Ja.value.position,
      data316: this.base3Ja.value.tel,
      data317: this.base3Ja.value.fax,
      data318: this.base3Ja.value.email,
      data320: this.base3En.value.name,
      data321: this.base3En.value.organization,
      data322: this.base3En.value.address,
      data323: this.base3En.value.department,
      data324: this.base3En.value.position,
      data400: this.base4Check,
      data410: this.base4Ja.value.name,
      data411: this.base4Ja.value.organization,
      data412: this.base4Ja.value.postalCode,
      data413: this.base4Ja.value.address,
      data414: this.base4Ja.value.department,
      data415: this.base4Ja.value.position,
      data416: this.base4Ja.value.tel,
      data417: this.base4Ja.value.fax,
      data418: this.base4Ja.value.email,
      data420: this.base4En.value.name,
      data421: this.base4En.value.organization,
      data422: this.base4En.value.address,
      data423: this.base4En.value.department,
      data424: this.base4En.value.position,
      data500: this.base5.value,
      lock: true,
    };
    this.dataService.addRequestContract2(doc);
  }

}
