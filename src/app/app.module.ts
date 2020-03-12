import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader, TranslateParser } from '@ngx-translate/core';

import { BaseServicesModule } from './uilib/services';
import { ApiService } from './uilib/services';
import { CommonServicesModule } from './home/services/common';
import { NotfoundComponent } from './passport/notfound/notfound.component';
import { HeaderInterceptor } from './uilib/interceptor/header.interceptor';
import { ResponseInterceptor } from './uilib/interceptor/response.interceptor';
import { LoginGuard } from './uilib/auth/login.guard';
import { I18nResourceService } from './home/services/i18n/i18n.resource.service';
import { I18nResourceLoader } from './home/services/i18n/i18n.resource.loader';
import { I18nResourceParser } from './home/services/i18n/i18n.resource.parser';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { LOCAL_PROVIDER_TOKEN, zh_CN as m_zh_CN } from 'ng-zorro-antd-mobile';

export function createTranslateLoader(apiService: ApiService) {
  return new I18nResourceLoader(apiService);
}

registerLocaleData(zh);

const SERVICES = [
  LoginGuard,
  I18nResourceService
];

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    NgZorroAntdMobileModule,
    AppRoutingModule,
    BaseServicesModule.forRoot(),
    CommonServicesModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [ApiService]
      },
      parser: { provide: TranslateParser, useClass: I18nResourceParser },
    })
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: LOCAL_PROVIDER_TOKEN, useValue: m_zh_CN },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    ...SERVICES
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
