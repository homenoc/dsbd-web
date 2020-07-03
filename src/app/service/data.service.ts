import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {CommonService} from "./common.service";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  addRequestComment(data: any) {
    const doc = {};
    doc['data1'] = data['data1'];
    doc['data2'] = data['data2'];
    doc['data3'] = data['data3'];
    doc['data4'] = data['data4'];
    doc['lock'] = true;

    this.afs.collection(`user`).doc(localStorage.getItem('authID'))
      .collection(`personal`).doc(`question`).set(doc, {merge: true})
      .then(() => {
        this.lockRegisterData(true);
        this.commonService.openBar('Document successfully written!', 2000);
      })
      .catch((error) => {
        // this.commonService.openBar('Error:' + error, 2000);
      });
  }


  addRequestContract1(data: any) {
    this.afs.collection(`user`).doc(localStorage.getItem('authID'))
      .collection(`personal`).doc(`contract1`).set(data, {merge: true})
      .then(() => {
        this.lockRegisterData(true);
        this.commonService.openBar('Document successfully written!', 2000);
      })
      .catch((error) => {
        // this.commonService.openBar('Error:' + error, 2000);
      });
  }

  addRequestContract2(data: any) {
    this.afs.collection(`user`).doc(localStorage.getItem('authID'))
      .collection(`personal`).doc(`contract2`).set(data, {merge: true})
      .then(() => {
        this.lockRegisterData(true);
        this.commonService.openBar('Document successfully written!', 2000);
      })
      .catch((error) => {
        // this.commonService.openBar('Error:' + error, 2000);
      });
  }

  lockRegisterData(data: boolean) {
    const doc = {};
    doc['lock'] = data;

    this.afs.collection(`user`).doc(localStorage.getItem('authID')).collection('personal').doc('common').set(doc, {merge: true})
      .then(() => {
        this.router.navigate(['/dashboard/registration']).then();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  agreeTerm(result: boolean) {
    const doc = {};
    doc['agree'] = result;

    this.afs.collection(`user`).doc(localStorage.getItem('authID'))
      .collection(`personal`).doc(`term`).set(doc, {merge: true})
      .then(() => {
        this.lockRegisterData(true);
        this.commonService.openBar('Document successfully written!', 2000);
      })
      .catch((error) => {
        // this.commonService.openBar('Error:' + error, 2000);
      });
  }

  //1:question 2: check 3:agreement 4:check 5:contract1 6:check 7:contract2 8:check 9:finish 10:Release 11:question ...
  getStatus(): Promise<number> {
    const data1 = this.afs.collection('user').doc(localStorage.getItem('authID'))
    return data1.ref.get().then((doc) => {
      // console.log(doc.data());
      // console.log(doc.data().status)
      if (doc.data().status == undefined) {
        return 1;
      }
      return doc.data().status;
    }).catch(err => console.log(err));
  }

  //1:question 2: check 3:agreement 4:check 5:contract1 6:check 7:contract2 8:check 9:finish 10:Release 11:question ...
  getApplyStatus(d: any): Promise<any> {
    const data1 = this.afs.collection('user').doc(localStorage.getItem('authID'))
    return data1.ref.get().then((doc1) => {
      // console.log(doc1.data());
      if (doc1.data() === undefined) {
        this.router.navigate(['/dashboard/registration/question']).then();
      }

      if (doc1.data().status == undefined && d === 1 || d === doc1.data().status % 10 || d === -1) {
        const data2 = this.afs.collection('user').doc(localStorage.getItem('authID')).collection('personal').doc('common')
        return data2.ref.get()
          .then((doc2) => {
            // console.log('lock: ' + doc2.data().lock)
            if (d === -1 && doc2.data().lock == true) {
              return -2;
            } else if (d === -1) {
              return doc1.data().status;
            }
            if (doc2.data().lock == true) {
              this.router.navigate(['/dashboard/registration']).then();
              return false;
            } else if (doc2.data()) {
              return true;
            }
          })
      } else {
        this.router.navigate(['/dashboard/registration']).then();
        return false
      }
    });
  }

  getUserNetData(): Promise<any> {
    const data = this.afs.collection('user').doc(localStorage.getItem('authID')).collection('data')
    return data.ref.get().then((doc) => {
      return doc;
    })
      .catch((error) => {
        console.log('Error:' + error);
        return 0;
      });
  }

  getPersonal(): Promise<any> {
    const data = this.afs.collection('user').doc(localStorage.getItem('authID')).collection('personal')
    return data.ref.get()
      .then((doc) => {
        return doc;
      })
      .catch((error) => {
        this.commonService.openBar('Error:' + error, 2000);
      }).catch((error) => {
        this.commonService.openBar('Error:' + error, 2000);
      });
  }

  getUserNotice(): Promise<any> {
    const data = this.afs.collection('user').doc(localStorage.getItem('authID')).collection('notice');
    return data.ref.get()
      .then(doc => {
        return doc;
      })
      .catch(err => console.log(err));
  }
}
