import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GapiService {
    private gapiSubject = new BehaviorSubject({});
    public gapi$ = this.gapiSubject.asObservable();
    constructor() {}

    updateGapi(gapiData:any) {
        this.gapiSubject.next(gapiData);
    }

}