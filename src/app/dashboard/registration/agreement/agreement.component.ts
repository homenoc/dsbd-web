import {Component, OnInit} from '@angular/core';
import {DataService} from "../../../service/data.service";

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {

  constructor(
    private dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getApplyStatus(3).then();
  }

  public agree = false;

  requestTerm(d: boolean) {
    this.dataService.agreeTerm(d);
  }
}
