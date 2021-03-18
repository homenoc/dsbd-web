import {Component, OnInit} from '@angular/core';
import {NoticeService} from '../../service/notice.service';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {

  constructor(
    private noticeService: NoticeService,
  ) {
  }

  public info: any[] = [];
  public name: string;
  public none = false;

  ngOnInit(): void {
    this.name = sessionStorage.getItem('name');
    this.noticeService.get().then(response => {
      const info = response;
      this.info = info.notice;
      if (info.notice === null || info.notice.length === 0) {
        this.none = true;
      }
    });
  }

  getStringFromDate(before: string): string {
    let str = '無期限';
    if (!before.match(/9999-12-31/)) {
      const dateNumberUTC = Date.parse(before);
      const dateJST = new Date(dateNumberUTC + (9 * 60 * 60 * 1000));
      str = dateJST.getFullYear() + '-' + ('0' + (2 + dateJST.getMonth())).slice(-2) + '-' +
        ('0' + dateJST.getDate()).slice(-2) + ' ' + ('0' + dateJST.getHours()).slice(-2) + ':' +
        ('0' + dateJST.getMinutes()).slice(-2) + ':' + ('0' + dateJST.getSeconds()).slice(-2);
    }
    return str;
  }
}
