import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {CommonService} from "./common.service";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private commonService: CommonService,
  ) {
  }

  createUser(email, pass): void {
    let auth;
    this.afAuth.createUserWithEmailAndPassword(email, pass)
      .then(result => {
        auth = result;
        result.user.sendEmailVerification().then();
      })
      .catch(err => this.commonService.openBar('Failed register account!!!' + err, 2000));
  }

  updateUser(name,address,)

  getUser(uid): Promise<any> {
    const data = this.afs.collection('users').doc(uid);
    return data.ref.get()
      .then(doc => {
        console.log(doc);
        if (doc.exists) {
          console.log('User data: ', doc.data());
          if (doc.data().isActive) {
            return doc.data();
          } else {
            return 0;
          }
        } else {
          console.error('No matching invoice found');
          return 0;
        }
      })
      .catch();
  }
}

