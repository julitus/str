import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../model/user/user.model';

@Injectable()
export class UserService {

    private userRef = this.db.list<User>('user');

    constructor(private db: AngularFireDatabase) { }

    getUserList() {
        return this.userRef;
    }

    addUser(user: User) {
        return this.userRef.push(user);
    }

    updateUser(user: User) {
        return this.userRef.update(user.key, user);
    }

    removeUser(user: User) {
        return this.userRef.remove(user.key);
    }
}