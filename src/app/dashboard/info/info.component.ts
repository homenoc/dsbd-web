import {Component, OnInit} from '@angular/core';
import {InfoService} from '../../service/info.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-data',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {


  constructor(
    private infoService: InfoService,
    private router: Router
  ) {
  }

  public info = [];

  ngOnInit() {
    this.infoService.get().then(response => {
      console.log('---response---');
      console.log(response);
      if (response.status) {
        this.info = response.info;
      } else {
        sessionStorage.setItem('error', 'response: ' + JSON.stringify(response));
        this.router.navigate(['/error']).then();
      }
    }).catch();
    {

    }
  }

}
