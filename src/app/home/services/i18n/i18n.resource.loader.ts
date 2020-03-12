import { TranslateLoader } from '@ngx-translate/core';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { ApiService } from '../../../uilib/services/';

export class I18nResourceLoader implements TranslateLoader {

    resourceLoadDone = false;

    constructor(private apiService: ApiService) { }

    getTranslation(lang: string): Observable<any> {
        console.log('getTranslate', lang);
        

        this.resourceLoadDone = false;
        // TODO find a way to decide if use local cache or get it from backend server
        // return this.apiService.get('appbiz/i18n/' + lang);

        //below is my new method //lang -> en/zh/zh_TW
        let frontend_i18n: Observable<any>;
        let backend_i18n: Observable<any>;
        if('en' === lang) {
            frontend_i18n = this.apiService.getStaticResource(`assets/i18n/`+  lang + `.json`);
            backend_i18n = this.apiService.get('appbiz/i18n/queryAll/en').pipe(map(res => res.result));
        } else {
            lang = 'zh';
            frontend_i18n = this.apiService.getStaticResource(`assets/i18n/`+  lang + `.json`);
            backend_i18n = this.apiService.get('appbiz/i18n/queryAll/zh').pipe(map(res => res.result));
        }
        let languageObs = forkJoin(
            {
                frontend:frontend_i18n, 
                backend:backend_i18n
            });
        return languageObs;
    }
}
