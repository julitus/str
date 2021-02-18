import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Record } from '../model/record/record.model';

@Injectable()
export class RecordService {

    private recordRef = this.db.list<Record>('record');

    constructor(private db: AngularFireDatabase) { }

    getRecordList() {
        return this.recordRef;
    }

    addRecord(record: Record) {
        return this.recordRef.push(record);
    }

    updateRecord(record: Record) {
        return this.recordRef.update(record.key, record);
    }

    removeRecord(record: Record) {
        return this.recordRef.remove(record.key);
    }
}