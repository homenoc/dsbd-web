import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
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
  public question = new FormControl();
  public org = new FormControl();
  public techUser: FormGroup;
  public bandwidth = new FormControl();
  public contract;
  private questionTemplateEn = '1．What is the purpose of using our network service ? \n' +
    'Limited to research, learning and personal use. Commercial use is prohibited. \n\n\n\n\n\n\n\n\n\n\n' +
    '2. Do you want to allocate IP addresses ?\n' +
    'If you have public IPs and AS numbers assigned by the RIR, it is possible to use them within our network ' +
    'connection. \n\n\n\n\n\n\n\n\n\n\n' +
    '3. What is the expected traffic volume for this connection ? \n\n\n\n\n\n\n\n\n\n\n' +
    '4. If you have a website or SNS about network technology, please let us know.\n' +
    'We will use this information as a reference when assessing whether to permit use.\n\n\n\n\n\n\n\n\n\n\n';
  private questionTemplateJa = '0. どこで当団体のことを知りましたか？ \n' +
    '当団体の運営委員より紹介を受けた方は紹介者の名前を記入してください。 \n\n\n\n\n\n\n\n\n\n\n' +
    '1．どのような用途で当団体のネットワークに接続しますか？ \n' +
    '例）研究目的、勉強、個人用途.（商用利用は禁止です。） \n\n\n\n\n\n\n\n\n\n\n' +
    '2. IPアドレスを当団体から割り当てる必要はありますか？　\n\n\n\n\n\n\n\n\n\n\n' +
    '3. どの程度トラフィックを出しますか？ \n\n\n\n\n\n\n\n\n\n\n' +
    '4. 技術の情報発信しているSNSやWebサイト、GitHubなどありましたら教えてください。\n\n\n\n\n\n\n\n\n\n\n';
  private bandwidthTemplateJa = ``;
  private bandwidthTemplateEn = `Average upstream bandwidth\nex) Upstream bandwidth: 1000 Kbps\n\nUpstream bandwidth:\n\n` +
    'Maximum upstream bandwidth\nex) Maximum bandwidth: 5000 Kbps\n\nMaximum bandwidth:\n\n' +
    'Average downlink bandwidth\nex) Upstream bandwidth: 1000 Kbps\n\nUpstream bandwidth:\n\n' +
    'Maximum downlink bandwidth\nex) Maximum bandwidth: 5000 Kbps\n\nMaximum bandwidth:\n\n' +
    'Do you have transfer of a large amount communications to a particular AS ? (Normally 10Mbps and above.)\n\n' +
    'yes or no\n\n';

  ngOnInit(): void {
    this.question.setValue(this.questionTemplateJa);
    this.bandwidth.setValue(this.bandwidthTemplateEn);
    this.techUser = this.formBuilder.group({
      tech: this.formBuilder.array([])
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
      Question: this.question.value,
      Org: this.org.value,
      Bandwidth: this.bandwidth.value,
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
        groupID = doc.data.gid;
        for (const t of this.techUser.value.tech) {
          console.log('groupID:' + groupID);
          this.userService.create({
            gid: groupID,
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
