import {Component, OnInit} from '@angular/core';
import {DataService} from '../../service/data.service';


// tslint:disable-next-line:class-name
class dataStruct {
  public id: string;
  public as: number;
  public ipv4: string[];
  public ipv6: string[];
  public service: string;
  public name: string;
  public fee: string;
  public assign: string;
  public connection: string;
  public noc: string;
  public terminatedAddress: string;
  public linkInfoV4: { our: string, your: string };
  public linkInfoV6: { our: string, your: string };

}

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  constructor(
    private dataService: DataService,
  ) {
  }

  public data: dataStruct[] = [];


  ngOnInit() {
    this.dataService.getUserNetData().then(d => {
      // tslint:disable-next-line:no-shadowed-variable
      d.forEach(d => {
        // console.log(d.id + '=>' + d.data());
        this.data.push({
          as: d.data().as,
          assign: d.data().assign,
          fee: d.data().fee,
          ipv4: d.data().v4.split(','),
          ipv6: d.data().v6.split(','),
          name: d.data().name,
          service: d.data().service,
          id: d.id,
          connection: d.data().connection,
          noc: d.data().noc,
          terminatedAddress: d.data().terminatedAddress,
          linkInfoV4: {our: d.data().v4_our, your: d.data().v4_your},
          linkInfoV6: {our: d.data().v6_our, your: d.data().v6_your},
        });
      });
    });
  }
}
