import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private closeEventSubject = new Subject<string>();

  public closeEventObservable$ = this.closeEventSubject.asObservable();

  constructor() {
  }

  public requestCloseModal() {
    this.closeEventSubject.next();
  }
}
