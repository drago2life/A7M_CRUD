import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {User} from './user';
import {Observable} from 'rxjs';
import { RequestOptions } from '@angular/http';

@Injectable()
export class UserService {

    // private url = 'https://apialex.azurewebsites.net';
    private url = 'http://localhost:5000/api/RecoveryCommercial/';

    constructor(private http: HttpClient) { }

    getUsers() {
        const getUrl = this.url;
        return this.http.get(getUrl);
    }

    createUser(user: User) {
        const saveUrl = this.url;
        return this.http.post(saveUrl, user);
    }
    updateUser(id: number, user: User) {
        const urlParams = new HttpParams().set('id', id.toString());
        return this.http.put(this.url + id, user);
    }



    deleteUser(id: number) {
        const urlParams = new HttpParams().set('id', id.toString());
        return this.http.delete(this.url + id);
    }
}
