import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(
    private location: Location
  ) {
  }

  public time: string;
  public error: string;

  ngOnInit(): void {
    const date = new Date();
    this.time = date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getDay() + ' ' +
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' ' + date.getTimezoneOffset();
    this.error = sessionStorage.getItem('error');
    sessionStorage.removeItem('error');
  }

  goBack() {
    this.location.back();
  }


}
