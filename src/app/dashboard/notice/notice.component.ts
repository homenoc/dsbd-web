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
    private commonService: CommonService
  ) {
  }

  public info: any;
  public name: string;

  ngOnInit(): void {
    this.name = sessionStorage.getItem('name');
    this.noticeService.get().then(response => {
      const info = response;
      this.info = info.notice;
    });
  }
}
