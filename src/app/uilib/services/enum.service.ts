import { Injectable } from '@angular/core';
import { EnumEntity } from '../../home/domain'
import { Subject } from 'rxjs';


@Injectable()
export class EnumService {
    public ENUM = 'PS_ENUM';

    clean() {
        localStorage.removeItem(this.ENUM);
    }

    getEnumList(): any[] {
        return JSON.parse(localStorage.getItem(this.ENUM));
    }

    setEnumList(enumList: any[]) {
        localStorage.setItem(this.ENUM, JSON.stringify(enumList));
    }

    filterByParentName(pname: string) {
        let result = [];
        let pKey = '';
        const tmpData:EnumEntity[] = this.getEnumList();
        for(let item of tmpData) {
            if (pname === item.name) {
                pKey = item.key;
                break;
            }
        }
        if('' !== pKey) {
            result = this.filterByParentKey(pKey);
        }
        return result;
    }

    filterByParentKey(pKey: string) {
        let result = [];
        const tmpData: EnumEntity[] = this.getEnumList();
        result = tmpData.filter(({parentKey}) => {
            return parentKey === pKey;
        });
        return result;
    }

}