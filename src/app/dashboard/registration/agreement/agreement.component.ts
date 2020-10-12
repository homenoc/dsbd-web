import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../service/data.service';

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

  public agree = false;
  public lock = true;

  ngOnInit(): void {
    this.dataService.getPersonalTerm().then((doc) => {
      if (doc === undefined) {
        this.lock = false;
      }
      if (!doc.lock) {
        this.lock = false;
      }
    });
  }

  requestTerm(d: boolean) {
    this.dataService.agreeTerm(d);
  }
}
