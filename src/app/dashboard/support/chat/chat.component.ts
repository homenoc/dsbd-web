import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SupportService} from '../../../service/support.service';
import {CommonService} from '../../../service/common.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  public comment = new FormControl();
  public ticketID: number;
  public chat: any;

  constructor(
    public supportService: SupportService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
  }


  ngOnInit(): void {
    this.ticketID = +this.route.snapshot.paramMap.get('id');
    this.supportService.openWebSocket(this.ticketID);
    this.supportService.get(this.ticketID).then(response => {
      console.log(response);
      const info = response;
      if (info.status) {
        this.chat = info.support_chat;
        console.log(info);
        // this.lock = false;
      } else {
        this.commonService.openBar('no data', 5000);
      }
    });
  }

  ngOnDestroy() {
    this.supportService.closeWebSocket();
  }

  public sendMessage() {
    const body = {
      user_token: sessionStorage.getItem('ClientID'),
      access_token: sessionStorage.getItem('AccessToken'),
      message: this.comment.value
    };
    // this.supportService.chatMessage.push({
    //   Name: sessionStorage.getItem('name'),
    //   CreatedAt: '',
    //   data: this.comment.value
    // });
    this.supportService.sendMessage(JSON.stringify(body));
  }
}
