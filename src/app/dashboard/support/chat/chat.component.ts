import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SupportService} from '../../../service/support.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  public comment = new FormControl();
  public ticketID: number;
  public ticket: any;
  public user: any[] = [];
  public myName = sessionStorage.getItem('name');
  public loading = true;

  constructor(
    public supportService: SupportService,
    private route: ActivatedRoute,
  ) {
  }


  ngOnInit(): void {
    this.supportService.chatMessage = null;
    this.ticketID = +this.route.snapshot.paramMap.get('id');
    this.supportService.openWebSocket(this.ticketID);
    this.supportService.get(this.ticketID).then(response => {
      this.ticket = response.tickets;
      this.loading = false;
      console.log(this.ticket);
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
    this.supportService.sendMessage(JSON.stringify(body));
    this.comment.setValue('');
  }
}
