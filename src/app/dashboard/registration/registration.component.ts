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
    this.dataService.getStatus().then((d) => {
      // console.log(d)
      if (d % 10 === 1 || d === undefined) {
        this.router.navigate(['/dashboard/registration/question']).then();
      } else if (d % 10 === 2) {
        this.router.navigate(['/dashboard/registration/agreement']).then();
      } else if (d % 10 === 3) {
        this.router.navigate(['/dashboard/registration/contract1']).then();
      } else if (d % 10 === 4) {
        this.router.navigate(['/dashboard/registration/contract2']).then();
      }
    })
  }


}
