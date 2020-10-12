import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {CommonService} from './common.service';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

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
    const doc = {
      data1: undefined,
      data2: undefined,
      data3: undefined,
      data4: undefined,
      lock: undefined
    };
    doc.data1 = data.data1;
    doc.data2 = data.data2;
    doc.data3 = data.data3;
    doc.data4 = data.data4;
    doc.lock = true;

    this.afs.collection(`user`).doc(localStorage.getItem('authID'))
      .collection(`personal`).doc(`question`).set(doc, {merge: true})
      .then(() => {
        this.router.navigate(['/dashboard/registration']).then();
        this.commonService.openBar('Document successfully written!', 2000);
      })
      .catch((error) => {
        this.commonService.openBar('Error:' + error, 2000);
      });
  }


  addRequestContract1(data: any) {
    this.afs.collection(`user`).doc(localStorage.getItem('authID'))
      .collection(`personal`).doc(`contract1`).set(data, {merge: true})
      .then(() => {
        this.router.navigate(['/dashboard/registration']).then();
        this.commonService.openBar('Document successfully written!', 2000);
      })
      .catch((error) => {
        this.commonService.openBar('Error:' + error, 2000);
      });
  }

  addRequestContract2(data: any) {
    this.afs.collection(`user`).doc(localStorage.getItem('authID'))
      .collection(`personal`).doc(`contract2`).set(data, {merge: true})
      .then(() => {
        this.router.navigate(['/dashboard/registration']).then();
        this.commonService.openBar('Document successfully written!', 2000);
      })
      .catch((error) => {
        this.commonService.openBar('Error:' + error, 2000);
      });
  }

  agreeTerm(result: boolean) {
    const doc = {
      agree: undefined,
      lock: undefined
    };
    doc.agree = result;
    doc.lock = true;

    this.afs.collection(`user`).doc(localStorage.getItem('authID'))
      .collection(`personal`).doc(`term`).set(doc, {merge: true})
      .then(() => {
        this.router.navigate(['/dashboard/registration']).then();
        this.commonService.openBar('Document successfully written!', 2000);
      })
      .catch((error) => {
        this.commonService.openBar('Error:' + error, 2000);
      });
  }

  getPersonalQuestion(): Promise<any> {
    const data1 = this.afs.collection('user').doc(localStorage.getItem('authID')).collection('personal').doc('question');
    return data1.ref.get().then((doc) => {
      return doc.data();
    }).catch(err => {
      console.log(err);
      return 0;
    });
  }

  getPersonalTerm(): Promise<any> {
    const data1 = this.afs.collection('user').doc(localStorage.getItem('authID')).collection('personal').doc('term');
    return data1.ref.get().then((doc) => {
      return doc.data();
    }).catch(err => {
      console.log(err);
      return 0;
    });
  }

  getPersonalContract1(): Promise<any> {
    const data1 = this.afs.collection('user').doc(localStorage.getItem('authID')).collection('personal').doc('contract1');
    return data1.ref.get().then((doc) => {
      return doc.data();
    }).catch(err => {
      console.log(err);
      return 0;
    });
  }

  getPersonalContract2(): Promise<any> {
    const data1 = this.afs.collection('user').doc(localStorage.getItem('authID')).collection('personal').doc('contract2');
    return data1.ref.get().then((doc) => {
      return doc.data();
    }).catch(err => {
      console.log(err);
      return 0;
    });
  }

  // 1:question 2: check 3:agreement 4:check 5:contract1 6:check 7:contract2 8:check 9:finish 10:Release 11:question ...
  getStatus(): Promise<any> {
    const data1 = this.afs.collection('user').doc(localStorage.getItem('authID'));
    return data1.ref.get().then((doc) => {
      // console.log(doc.data());
      // console.log(doc.data().status)
      return doc.data().status;
    }).catch(err => console.log(err));
  }

  getUserNetData(): Promise<any> {
    const data = this.afs.collection('user').doc(localStorage.getItem('authID')).collection('data');
    return data.ref.get().then((doc) => {
      return doc;
    })
      .catch((error) => {
        console.log('Error:' + error);
        return 0;
      });
  }

  getPersonal(): Promise<any> {
    const data = this.afs.collection('user').doc(localStorage.getItem('authID')).collection('personal');
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
