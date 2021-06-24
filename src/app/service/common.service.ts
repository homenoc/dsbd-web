import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(
        public router: Router,
        private snackBar: MatSnackBar,
        private http: HttpClient
    ) {
    }

    public random(len): string {
        const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const cl = c.length;
        let result = '';
        for (let i = 0; i < len; i++) {
            result += c[Math.floor(Math.random() * cl)];
        }
        return result;
    }

    public openBar(message: string, time: number) {
        this.snackBar.open(message, 'done', {
            duration: time,
        });
    }

    getTemplate(): Promise<any> {
        return this.http.get(environment.api.url + environment.api.path + '/template', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                USER_TOKEN: sessionStorage.getItem('ClientID'),
                ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
            }),
        }).toPromise().then(r => {
            const response: any = r;
            return response;
        }).catch(error => {
            sessionStorage.setItem('error', JSON.stringify(error));
            this.router.navigate(['/error']).then();
        });
    }

    getNOC(): Promise<any> {
        return this.http.get(environment.api.url + environment.api.path + '/noc', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                USER_TOKEN: sessionStorage.getItem('ClientID'),
                ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
            }),
        }).toPromise().then(r => {
            const response: any = r;
            return response;
        }).catch(error => {
            sessionStorage.setItem('error', JSON.stringify(error));
            this.router.navigate(['/error']).then();
        });
    }
}
