import { Injectable } from '@angular/core';
import { TranslateParser, TranslateDefaultParser } from '@ngx-translate/core';

@Injectable()
export class I18nResourceParser extends TranslateDefaultParser  {

    // public interpolate(expr: string | Function, params?: any): string {
    //     console.group('interpolate');
    //     console.log('expr');
    //     console.log(expr);
    //     console.log('params');
    //     console.log(params);
    //     console.log('super.interpolate(expr, params)');
    //     console.log(super.interpolate(expr, params));
    //     console.groupEnd()
    //     const result: string = super.interpolate(expr, params)
    //     return result;
    // }
    getValue(target: any, key: string): any {
        let result:string;
        const val = super.getValue(target, key);
        if (!val){
            result = key.replace('frontend.', '').replace('backend.', '');
        } else {
            result = val;
        }
        return result;
    }
}
