import { Injectable } from '@angular/core';


@Injectable()
export class MockService {

    constructor() {
    }

    fetchMockJson (fileName: string, cb) {
        const req = new XMLHttpRequest();
        const uri = 'assets/mock/'+ fileName +'.json';
        req.open('GET', uri);
        req.onload = () => {
            const data = JSON.parse(req.response);
            cb(data);
        };
        req.send();
    }


}

