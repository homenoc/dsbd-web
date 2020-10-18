import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {

  public ip: FormGroup;
  public bgp: string;
  public bgpEtc = new FormControl();
  public pi = false;
  public date = new FormControl();
  public plan = new FormControl();
  private dateJa = '要望に答えられない可能性があります。\n\n#接続開始日\n\n\n#接続終了日\n\n\n';
  private dateEn = 'Sorry, we may not be able to meet your request.\n\n' + '#Scheduled start date for connection\n\n\n' +
    'Scheduled end date for connection\n\n\n';
  private planJa = '      [Subnet Number1]\n' +
    '      目的: \n\n' +
    '      ----使用IPアドレス----\n' +
    '      契約後: 4\n' +
    '      半年後: 5\n' +
    '      １年後: 6\n\n' +
    '      ----IPアドレスの使用率----\n' +
    '      * この使用率はネットワークアドレスとブロードキャストアドレスも含めて計算します。\n' +
    '      契約後: 75%\n' +
    '      半年後: 87.5%\n' +
    '      １年後: 100%\n\n' +
    '      ----Other----\n' +
    '      一時接続 :\n\n\n' +
    '      ----デバイス一覧----\n' +
    '      デバイス　　 契約後/半年後/１年後\n' +
    '      ----------------------------------------------\n' +
    '      Router     1/1/1\n' +
    '      FW         1/1/1\n' +
    '      WebServer  1/2/2\n' +
    '      MailServer 1/1/2\n' +
    '      ----------------------------------------------\n' +
    '      全デバイス   4/5/6';
  private planEn = '      [Subnet Number1]\n' +
    '      Purpose of use: \n\n' +
    '      ----Use number of ip addresses----\n' +
    '      immediately after contract : 4\n' +
    '      immediately after half year : 5\n' +
    '      immediately after one year : 6\n\n' +
    '      ----Utilization rate of ip addresses----\n' +
    '      * The utilization rate is calculated by including the network address and broadcast address.\n' +
    '      immediately after contract : 75%\n' +
    '      immediately after half year : 87.5%\n' +
    '      immediately after one year : 100%\n\n' +
    '      ----Other----\n' +
    '      temporary connection :\n\n\n' +
    '      ----Device List----\n' +
    '      device 　　after contract/half year/one year\n' +
    '      ----------------------------------------------\n' +
    '      Router     1/1/1\n' +
    '      FW         1/1/1\n' +
    '      WebServer  1/2/2\n' +
    '      MailServer 1/1/2\n' +
    '      ----------------------------------------------\n' +
    '      total Device      4/5/6\n' +
    '    Please copy and complete the format for each subnet , if you use divided subnets of IPv4 address.\n' +
    '    According to JPNIC\'s rules, users must meet the following conditions.\n' +
    '        immediately after contract\n' +
    '        Over 25%\n\n' +
    '        immediately after half year\n' +
    '        Over 25%\n\n' +
    '        immediately after one year\n' +
    '        Over 50%\n\n' +
    '     ---How to calculate the utilization rate---\n' +
    '                                    Number of IP addresses to be used\n' +
    '      Utilization rate = ------------------------------------------------------------------------ x100\n' +
    '                                    Number of IP addresses to be allocated\n' +
    '    \n' +
    '    Please do not include private addresses in the utilization rate.\n' +
    '    temporary connection means that the always IP address is not used. (ex Assign IP Address by DHCP.\n' +
    '    The utilization rate is calculated by including the network address and broadcast address.\n';
  jpnicJa = new FormGroup({
    address: new FormControl(''),
    organization: new FormControl(''),
    organization_f: new FormControl(''),
  });
  jpnicEn = new FormGroup({
    address: new FormControl(''),
    organization: new FormControl(''),
  });
  checkV4 = false;
  checkV6 = false;
  jpnicV4 = new FormGroup({
    name: new FormControl(''),
    subnet: new FormControl(''),
  });
  jpnicV6 = new FormGroup({
    name: new FormControl(''),
    subnet: new FormControl(''),
  });
  public dialog: MatDialog;


  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.ip = this.formBuilder.group({
      ip: this.formBuilder.array([])
    });
    this.date.setValue(this.dateJa);
    this.plan.setValue(this.planEn);
  }

  get optionForm(): FormGroup {
    return this.formBuilder.group({
      ip: [''],
      pi: this.pi,
      as: ['']
    });
  }

  get ipAddress(): FormArray {
    return this.ip.get('ip') as FormArray;
  }

  addOptionForm() {
    this.ipAddress.push(this.optionForm);
  }

  removeOptionForm(idx: number) {
    this.ipAddress.removeAt(idx);
  }

  request() {
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(JPNICDetailDialog, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}


@Component({
  selector: 'jpnic-detail-dialog',
  templateUrl: 'jpnic.html',
  styleUrls: ['jpnic.scss']
})
export class JPNICDetailDialog implements OnInit {

  public model;
  public shiftForm: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<JPNICDetailDialog>,
    // private _formBuilder: FormBuilder,
    // private _snackBar: MatSnackBar,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // console.log(data);
    this.model = {
      comment: ''
    };
    this.createForm();
  }

  onSubmit(): void {
  }

  ngOnInit(): void {
  }

  createForm(): void {
    // this.shiftForm = this._formBuilder.group(this.model);
    // this.shiftForm.setValue(this.model);
  }

  pushButton(count) {

    this.shiftForm.setValue(this.model);
  }

  // ngOnDestroy() {
  //   console.log('end');
  // }
}
