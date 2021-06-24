import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(
    private location: Location,
    private router: Router
  ) {
  }

  public time: string;
  public error: string;
  public errorJson: any;

  ngOnInit(): void {
    const date = new Date();
    this.time = date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getDay() + ' ' +
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' ' + date.getTimezoneOffset();
    this.error = sessionStorage.getItem('error');
    this.errorJson = JSON.parse(sessionStorage.getItem('error'));
    console.log(this.errorJson);
    sessionStorage.removeItem('error');
  }

  dashboardPage(): void {
    this.router.navigate(['/dashboard']).then();
  }

  goBack() {
    this.location.back();
  }


}
