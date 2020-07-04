import {Component, OnInit} from '@angular/core';
import {DataService} from "../../service/data.service";
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.dataService.getApplyStatus(-1).then((d) => {
      // console.log(d)
      if (d % 10 === 1) {
        this.router.navigate(['/dashboard/registration/question']).then();
      } else if (d % 10 === 3) {
        this.router.navigate(['/dashboard/registration/agreement']).then();
      } else if (d % 10 === 5) {
        this.router.navigate(['/dashboard/registration/contract1']).then();
      } else if (d % 10 === 7) {
        this.router.navigate(['/dashboard/registration/contract2']).then();
      } else if (d === -1 || d === undefined) {
        this.router.navigate(['/dashboard/registration/question']).then();
      }
    })
  }


}
