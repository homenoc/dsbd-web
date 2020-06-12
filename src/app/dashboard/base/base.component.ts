import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DataService} from "../../service/data.service";
import {CommonService} from "../../service/common.service";

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private commonService: CommonService,
  ) {
  }

  ngOnInit(): void {
    //status
    this.dataService.getData().then(userData => {
      if (userData.lock != true || userData.lock == undefined) {
        this.process();
      }
    }).catch(() => this.process())
  }


  public status = 0;

  public base1_1 = new FormControl();
  public base1_2 = new FormControl();
  public base1_3 = new FormControl();
  public base1_4 = new FormControl();


  process() {
    this.dataService.getPersonal().then((d) => {
        let i = 0;
        let question = false;
        // console.log(d.docs[0].data());
        for (const doc of d.docs) {
          i++;
          console.log(doc.data());
          if (doc.id == "term") {
            console.log(doc.data().agree);
            if (question == false) {
              if (doc.data().agree == true || doc.data().agree != undefined) {
                this.status = 2;
              } else {
                this.status = 1;
                break;
              }
            }
          }

          if (doc.id == "question") {
            console.log(doc.data().lock)
            if (doc.data().lock == true || doc.data().lock != undefined) {
              question = true;
              // #1 Issue
              //一時処置
              this.status = 0;
              //Script作成必要あり
              // this.status = 3;
            }
          }
        }
        if (i == 0) {
          this.status = 1;
        }

        // console.log(d.docs());
        // console.log(d.personal.question);
        // this.status = d.status
      }
    ).catch(() => this.status = 0);
  }

  requestTerm(d: boolean) {
    this.dataService.agreeTerm(d);
    this.status = 2;
  }

  requestComment() {
    this.dataService.addUserComment({
      data1: this.base1_1.value,
      data2: this.base1_2.value,
      data3: this.base1_3.value,
      data4: this.base1_4.value
    })
    this.status = 0
  }

  requestUserInfo() {

  }

}
