import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {CommonService} from "./common.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private commonService: CommonService,
    private authService: AuthService,
  ) {
  }

  addUserComment(data: any) {
    const doc = {};
    doc['data1'] = data['data1'];
    doc['data2'] = data['data2'];
    doc['data3'] = data['data3'];
    doc['data4'] = data['data4'];
    doc['lock'] = true;

    this.authService.getUser().then(d => {
      this.afs.collection(`user`).doc(d.uid)
        .collection(`personal`).doc(`question`).set(doc, {merge: true})
        .then(() => {
          this.registerStatus(1);
          this.commonService.openBar('Document successfully written!', 2000);
        })
        .catch((error) => {
          // this.commonService.openBar('Error:' + error, 2000);
        });
    });
  }


  addUserData() {

  }

  registerStatus(data: number) {
    const doc = {};
    doc['status'] = data;

    this.authService.getUser().then(d => {
      this.afs.collection(`user`).doc(d.uid).set(doc, {merge: true})
        .then(() => {
          this.commonService.openBar('Document successfully written!', 2000);
        })
        .catch((error) => {
          this.commonService.openBar('Error:' + error, 2000);
        });
    }).catch();
  }

  agreeTerm(result: boolean) {
    const doc = {};
    doc['agree'] = result;

    this.authService.getUser().then(d => {
      this.afs.collection(`user`).doc(d.uid)
        .collection(`personal`).doc(`term`).set(doc, {merge: true})
        .then(() => {
          this.commonService.openBar('Document successfully written!', 2000);
        })
        .catch((error) => {
          this.commonService.openBar('Error:' + error, 2000);
        });
    }).catch();
  }

  getData(): Promise<any> {
    return this.authService.getUser().then(d => {
      console.log(d.uid);
      const data = this.afs.collection('user').doc(d.uid)
      return data.ref.get()
        .then((doc) => {
          return doc.data();
        })
        .catch((error) => {
          this.commonService.openBar('Error:' + error, 2000);
        });
    })
      .catch((error) => {
        this.commonService.openBar('Error:' + error, 2000);
      });
  }


  getPersonal(): Promise<any> {
    return this.authService.getUser().then(d => {
      console.log(d.uid);
      const data = this.afs.collection('user').doc(d.uid).collection('personal')
      return data.ref.get()
        .then((doc) => {
          return doc;
        })
        .catch((error) => {
          this.commonService.openBar('Error:' + error, 2000);
        });
    })
      .catch((error) => {
        this.commonService.openBar('Error:' + error, 2000);
      });
  }
}
