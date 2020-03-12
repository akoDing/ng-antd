import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzI18nService, en_US, zh_CN, zh_TW } from 'ng-zorro-antd';
import { en_US as m_en_US, zh_CN as m_zh_CN, LocaleProviderService } from 'ng-zorro-antd-mobile';
import { AuthService, SettingService } from './uilib/services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    constructor(
        private setting: SettingService,
        private authService: AuthService,
        private translate: TranslateService,
        private nzI18nService: NzI18nService,
        private localeProviderService: LocaleProviderService
    ) { }

    ngOnInit(): void {
        if (this.setting.layout.lang) {
            console.log('current lang ->', this.setting.layout.lang);
            
            this.translate.use(this.setting.layout.lang);
            if (this.setting.layout.lang === 'zh') {
                this.nzI18nService.setLocale(zh_CN);
                this.localeProviderService.setLocale(m_zh_CN);
            } else if (this.setting.layout.lang === 'zh_TW') {
                this.nzI18nService.setLocale(zh_TW);
                this.localeProviderService.setLocale(m_zh_CN);
            } else {
                this.nzI18nService.setLocale(en_US);
                this.localeProviderService.setLocale(m_en_US);
            }
        } else {
            const browserLang = this.translate.getBrowserLang();
            this.translate.use(browserLang.match(/en|zh/) ? browserLang : 'en');
            if (this.setting.layout.lang === 'zh') {
                this.nzI18nService.setLocale(zh_CN);
                this.localeProviderService.setLocale(m_zh_CN);
            } else if (this.setting.layout.lang === 'zh_TW') {
                this.nzI18nService.setLocale(zh_TW);
                this.localeProviderService.setLocale(m_zh_CN);
            } else {
                this.nzI18nService.setLocale(en_US);
                this.localeProviderService.setLocale(m_en_US);
            }
        }
    }
}
