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
    this.dataService.getRegistrationStatus().then((d) => {
      console.log(d);
      if (d === 0) {
        this.router.navigate(['/question']).then();
      } else if (d === 2) {
        this.router.navigate(['/agreement']).then();
      }else if (d === 4) {
        this.router.navigate(['/contract1']).then();
      }else if (d === 6) {
        this.router.navigate(['/contract2']).then();
      }
    })
  }


}
