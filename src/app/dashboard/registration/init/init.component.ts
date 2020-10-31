import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {GroupService} from '../../../service/group.service';
import {Router} from '@angular/router';

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
  public bandwidthAs = false;
  public bandwidth = new FormGroup({
    aveUpstream: new FormControl(10, Validators.min(0)),
    maxUpstream: new FormControl(100, Validators.min(0)),
    aveDownstream: new FormControl(10, Validators.min(0)),
    maxDownstream: new FormControl(100, Validators.min(0)),
    asn: new FormControl()
  });
  public org = new FormControl();
  public techUser: FormGroup;
  public contract;

  ngOnInit(): void {
    this.techUser = this.formBuilder.group({
      tech: this.formBuilder.array([])
    });
    // アクセス制御
    this.userService.getLoginUser().then(user => {
      if (user.status && user.data.group_id !== 0 && user.data.status === 0) {
        this.commonService.openBar('すでに登録済みです。', 5000);
        this.router.navigate(['/dashboard/registration']).then();
      }
    });
  }

  get optionForm(): FormGroup {
    return this.formBuilder.group({
      email: [''],
      name: [''],
      name_en: ['']
    });
  }

  get userProcess(): FormArray {
    return this.techUser.get('tech') as FormArray;
  }

  addOptionForm() {
    this.userProcess.push(this.optionForm);
  }

  removeOptionForm(idx: number) {
    this.userProcess.removeAt(idx);
  }

  request() {
    const question1 = '1. どこで当団体のことを知りましたか？\n';
    const question2 = '\n\n2. どのような用途で当団体のネットワークに接続しますか？\n';
    const question3 = '\n\n3. アドレスを当団体から割り当てる必要はありますか？\n';
    const question4 = '\n\n4. 貴方が情報発信しているSNSやWebサイト、GitHubなどありましたら教えてください。';

    const bandwidth1 = '平均上り利用帯域: ';
    const bandwidth2 = '\n最大上り利用帯域: ';
    const bandwidth3 = '\n平均下り利用帯域: ';
    const bandwidth4 = '\n最大下り利用帯域: ';
    const bandwidth5 = '\n特定のASに対する大量通信があるのか？\n';

    let bandwidth = '';
    if (this.bandwidthAs) {
      bandwidth = bandwidth1 + this.bandwidth.value.aveUpstream + bandwidth2 + this.bandwidth.value.maxUpstream
        + bandwidth3 + this.bandwidth.value.aveDownstream + bandwidth4 + this.bandwidth.value.maxDownstream
        + bandwidth5 + this.bandwidth.value.asn;
    } else {
      bandwidth = bandwidth1 + this.bandwidth.value.aveUpstream + bandwidth2 + this.bandwidth.value.maxUpstream
        + bandwidth3 + this.bandwidth.value.aveDownstream + bandwidth4 + this.bandwidth.value.maxDownstream;
    }

    let groupID = 0;
    // check
    for (const t of this.techUser.value.tech) {
      if (t.email.indexOf('@') === -1) {
        this.commonService.openBar('This mail is invalid..', 5000);
        return;
      }
    }
    if (this.contract === '' || this.question.value === '' || this.org.value === null ||
      this.bandwidth.value === null) {
      this.commonService.openBar('invalid..', 5000);
      return;
    }

    // main
    this.groupService.register({
      Agree: this.agree,
      Question: question1 + this.question.value.question1 + question2 + this.question.value.question2 +
        question3 + this.question.value.question3 + question4 + this.question.value.question4,
      Org: this.org.value,
      Bandwidth: bandwidth,
      Contract: this.contract
    }).then(d => {
      if (!d.status) {
        console.log('group service response: ' + JSON.stringify(d));
        sessionStorage.setItem('error', 'group service response: ' + JSON.stringify(d));
        this.router.navigate(['/error']).then();
        return;
      }

      if (this.admin) {
        this.userService.update(0, {
          status: 1,
          user: true
        }).then(user => {
          if (!user.status) {
            console.log('user service(admin) response: ' + JSON.stringify(user));
            sessionStorage.setItem('error', 'user service(admin) response: ' + JSON.stringify(user));
            this.router.navigate(['/error']).then();
            return;
          }
        });
      }

      this.userService.getLoginUser().then((doc) => {
        groupID = doc.data.group_id;
        for (const t of this.techUser.value.tech) {
          console.log('groupID:' + groupID);
          this.userService.create({
            group_id: groupID,
            user: true,
            level: 2,
            email: t.email,
            name: t.name,
            name_en: t.name_en
          }, 1).then(user => {
            if (!user.status) {
              console.log('user service(techUser) response: ' + JSON.stringify(user));
              sessionStorage.setItem('error', 'user service(techUser) response: ' + JSON.stringify(user));
              this.router.navigate(['/error']).then();
              return;
            }
          });
        }
      });
    });
    this.commonService.openBar('申請完了', 5000);
    this.router.navigate(['/dashboard']).then();
  }
}
