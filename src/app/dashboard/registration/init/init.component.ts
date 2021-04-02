import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {GroupService} from '../../../service/group.service';
import {Router} from '@angular/router';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-agreement',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router
  ) {
  }

  public agree = false;
  public admin = false;
  public question = new FormGroup({
    question1: new FormControl(),
    question2: new FormControl(),
    question3: new FormControl(),
    question4: new FormControl()
  });
  public group = new FormGroup({
    org: new FormControl(''),
    org_en: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
    address_en: new FormControl(''),
    tel: new FormControl(''),
    country: new FormControl(''),
  });
  public contract;
  public student = false;
  public dateStudentEnd: string;

  ngOnInit(): void {
    // アクセス制御
    this.userService.getLoginUser().then(user => {
      if (user.group_id !== 0) {
        this.commonService.openBar('すでに登録済みです。', 5000);
        this.router.navigate(['/dashboard/registration']).then();
      }
    });
  }

  addEventEnd(event: MatDatepickerInputEvent<Date>) {
    this.dateStudentEnd = event.value.getFullYear() + '-' + ('00' + (event.value.getMonth() + 1)).slice(-2) +
      '-' + ('00' + (event.value.getDate())).slice(-2);
  }

  termPage() {
    window.open('https://www.homenoc.ad.jp/usage/terms/');
  }

  request() {
    const question1 = '1. どこで当団体のことを知りましたか？\n';
    const question2 = '\n\n2. どのような用途で当団体のネットワークに接続しますか？\n';
    const question3 = '\n\n3. アドレスを当団体から割り当てる必要はありますか？\n';
    const question4 = '\n\n4. 貴方が情報発信しているSNSやWebサイト、GitHubなどありましたら教えてください。\n';

    // check
    if (this.contract === '' || this.question.value === '') {
      this.commonService.openBar('invalid..', 5000);
      return;
    }
    if (this.group.value.org === '') {
      this.commonService.openBar('invalid: 団体名が入力されていません。', 5000);
      return;
    }
    if (this.group.value.org_en === '') {
      this.commonService.openBar('invalid: 団体名(English)が入力されていません。', 5000);
      return;
    }
    if (this.group.value.postcode === '') {
      this.commonService.openBar('invalid: 郵便番号が入力されていません。', 5000);
      return;
    }
    if (this.group.value.address === '') {
      this.commonService.openBar('invalid: 住所が入力されていません。', 5000);
      return;
    }
    if (this.group.value.address_en === '') {
      this.commonService.openBar('invalid: 住所(English)が入力されていません。', 5000);
      return;
    }
    if (this.group.value.tel === '') {
      this.commonService.openBar('invalid: 電話番号が入力されていません。', 5000);
      return;
    }
    if (this.group.value.country === '') {
      this.commonService.openBar('invalid: 居住国が入力されていません。', 5000);
      return;
    }

    const body = {
      agree: this.agree,
      question: question1 + this.question.value.question1 + question2 + this.question.value.question2 +
        question3 + this.question.value.question3 + question4 + this.question.value.question4,
      org: this.group.value.org,
      org_en: this.group.value.org_en,
      postcode: this.group.value.postcode,
      address: this.group.value.address,
      address_en: this.group.value.address_en,
      tel: this.group.value.tel,
      country: this.group.value.country,
      contract: this.contract,
      student: this.student,
      student_expired: this.dateStudentEnd
    };

    // main
    this.groupService.register(body).then(d => {
      this.commonService.openBar('申請完了', 5000);
      this.router.navigate(['/dashboard']).then();
    }).catch();
  }
}
