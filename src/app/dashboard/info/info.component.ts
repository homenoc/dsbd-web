import {Component, OnInit} from '@angular/core';


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
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  constructor(
  ) {
  }

  public data: dataStruct[] = [];


  ngOnInit() {
    // this.dataService.getUserNetData().then(d => {
    //   // tslint:disable-next-line:no-shadowed-variable
    //   d.forEach(d => {
    //     // console.log(d.id + '=>' + d.info());
    //     this.info.push({
    //       as: d.info().as,
    //       assign: d.info().assign,
    //       fee: d.info().fee,
    //       ipv4: d.info().v4.split(','),
    //       ipv6: d.info().v6.split(','),
    //       name: d.info().name,
    //       service: d.info().service,
    //       id: d.id,
    //       connection: d.info().connection,
    //       noc: d.info().noc,
    //       terminatedAddress: d.info().terminatedAddress,
    //       linkInfoV4: {our: d.info().v4_our, your: d.info().v4_your},
    //       linkInfoV6: {our: d.info().v6_our, your: d.info().v6_your},
    //     });
    //   });
    // });
  }
}
