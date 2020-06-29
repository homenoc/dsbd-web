import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DataService} from "../../../service/data.service";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  constructor(
    private dataService: DataService,
  ) {
  }

  ngOnInit(): void {
  }

  public base1 = new FormControl();
  public base2 = new FormControl();
  public base3 = new FormControl();
  public base4 = new FormControl();

  public agree = false;


  requestComment() {
    this.dataService.addUserComment({
      data1: this.base1.value,
      data2: this.base2.value,
      data3: this.base3.value,
      data4: this.base4.value
    })
  }
}
