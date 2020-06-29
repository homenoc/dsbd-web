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

    this.authService.getUser().then(d => {
      this.afs.collection(`user`).doc(d.uid)
        .collection(`personal`).doc(`question`).set(doc, {merge: true})
        .then(() => {
          this.lockRegisterData(true);
          this.commonService.openBar('Document successfully written!', 2000);
        })
        .catch((error) => {
          // this.commonService.openBar('Error:' + error, 2000);
        });
    });
  }


  addRequestContract1(data: any) {
    this.authService.getUser().then(d => {
      this.afs.collection(`user`).doc(d.uid)
        .collection(`personal`).doc(`contract1`).set(data, {merge: true})
        .then(() => {
          this.lockRegisterData(true);
          this.commonService.openBar('Document successfully written!', 2000);
        })
        .catch((error) => {
          // this.commonService.openBar('Error:' + error, 2000);
        });
    });
  }

  addRequestContract2(data: any) {
    this.authService.getUser().then(d => {
      this.afs.collection(`user`).doc(d.uid)
        .collection(`personal`).doc(`contract2`).set(data, {merge: true})
        .then(() => {
          this.lockRegisterData(true);
          this.commonService.openBar('Document successfully written!', 2000);
        })
        .catch((error) => {
          // this.commonService.openBar('Error:' + error, 2000);
        });
    });
  }

  lockRegisterData(data: boolean) {
    const doc = {};
    doc['lock'] = data;

    this.authService.getUser().then(d => {
      this.afs.collection(`user`).doc(d.uid).set(doc, {merge: true})
        .then(() => {
          this.router.navigate(['/dashboard/registration']).then();
        })
        .catch((error) => {
          console.log(error);
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
          this.lockRegisterData(true);
          this.commonService.openBar('Document successfully written!', 2000);
        })
        .catch((error) => {
          // this.commonService.openBar('Error:' + error, 2000);
        });
    }).catch();
  }

  //-1:MainPage 0:question 1: check 2:agreement 3:check 4:contract1 5:check 6:contract2 7:check 8:finish
  getApplyStatus(d: any): Promise<any> {
    return this.authService.getUser().then(userData => {
      const data1 = this.afs.collection('user').doc(userData.uid).collection('admin').doc('base')
      return data1.ref.get().then((doc1) => {
        console.log(doc1.data());
        if (d === doc1.data().registration || d === -1) {
          const data2 = this.afs.collection('user').doc(userData.uid)
          return data2.ref.get()
            .then((doc2) => {
              if (d === -1 && doc2.data().lock) {
                return -2;
              } else if (d === -1) {
                return doc1.data().registration;
              }
              if (doc2.data().lock) {
                this.router.navigate(['/dashboard/registration']).then();
                return false;
              } else {
                return true;
              }
            })
        } else {
          this.router.navigate(['/dashboard/registration']).then();
          return false
        }
      });
    });
  }

  getRegistrationStatus()
    :
    Promise<any> {
    return this.authService.getUser().then(d => {
      const data = this.afs.collection('user').doc(d.uid).collection('admin').doc('base')
      return data.ref.get().then((doc) => {
        console.log(doc.data());
        return doc.data().registration;
      })
        .catch((error) => {
          console.log('Error:' + error);
          return -1;
        });
    })
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

  getUserNotice(): Promise<any> {
    return this.authService.getUser().then(d => {
      const data = this.afs.collection('user').doc(d.uid).collection('notice');
      return data.ref.get()
        .then(doc => {
          return doc;
        })
        .catch();
    })
  }
}
