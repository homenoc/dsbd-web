import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DataService} from "../../../service/data.service";
import {CommonService} from "../../../service/common.service";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private commonService: CommonService,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getPersonalQuestion().then((doc) => {
      if (doc !== 0 || doc.lock) {
        this.lock = false;
      }
    });
  }

  public base1 = new FormControl();
  public base2 = new FormControl();
  public base3 = new FormControl();
  public base4 = new FormControl();
  public lock = true;

  public agree = false;


  requestComment() {
    if (this.base1.value == '' || this.base2.value == '' || this.base3.value == '' || this.base4.value == '') {
      this.commonService.openBar('The field is blank.', 2000)
    } else {
      this.dataService.addRequestComment({
        data1: this.base1.value,
        data2: this.base2.value,
        data3: this.base3.value,
        data4: this.base4.value
      })
    }
  }
}
