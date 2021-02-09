import {Component, OnInit} from '@angular/core';
import {SupportService} from '../../service/support.service';
import {CommonService} from '../../service/common.service';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  public info: any[] = [];
  public lock = true;
  public title = new FormControl();
  public data = new FormControl();

  constructor(
    public supportService: SupportService,
    private commonService: CommonService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.supportService.getAll().then(response => {
      console.log(response);
      const info = response;
      if (info.status) {
        this.info = info.support_ticket;
        console.log(this.info);
        this.lock = false;
      } else {
        this.commonService.openBar('no data', 5000);
      }
    });
  }

  chatPage(id) {
    this.router.navigate(['/dashboard/support/' + id]).then();
  }

  registration(): void {
    if (this.title.value === '' || this.data.value === '') {
      this.commonService.openBar('invalid...', 5000);
      return;
    }

    const body = {
      title: this.title.value,
      data: this.data.value,
    };
    this.supportService.register(body).then(response => {
      const info = response;
      console.log(info);
      this.info = info.support_ticket;
      this.lock = false;
      location.reload();
    });
  }
}
