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
    this.dataService.getPersonalTerm().then((doc) => {
      if (doc !== 0 || doc.lock) {
        this.lock = false;
      }
    });
  }

  public agree = false;
  public lock = true;

  requestTerm(d: boolean) {
    this.dataService.agreeTerm(d);
  }
}
