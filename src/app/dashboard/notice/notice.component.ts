import {Component, OnInit} from '@angular/core';
import {DataService} from '../../service/data.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {

  constructor(
    private dataService: DataService,
  ) {
  }

  public data: any;
  public name: string;

  ngOnInit(): void {
    this.name = sessionStorage.getItem('name');
    // this.dataService.getUserNotice().then(data => this.data = data);
  }
}
