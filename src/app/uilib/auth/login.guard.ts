import { Injectable, DebugElement } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { AuthService, HandlerService, ApiService, EnumService } from '../services';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { CommonConstants } from '../util/CommonConstants';
// import { stat } from 'fs';

@Injectable()
export class LoginGuard implements CanActivateChild {
    oauth_server = environment.oauth_server;
    production_flag: boolean = environment.production || false;

    baseinfo_uri = 'appbiz/baseinfo/';

    constructor(
      private authService: AuthService,
      private translate: TranslateService,
      private enumService: EnumService,
      private router: Router,
      public handlerService: HandlerService,
      public apiService: ApiService,
      private aRoute: ActivatedRoute
    ) {}

    doLogin(url ? : string) {
      if (!this.production_flag || CommonConstants.LOGIN_TYPE_LOCAL === this.authService.getLoginType()) {
        if (url) {
          this.authService.setTargetURL(url);
        }
        this.router.navigateByUrl('passport/login');
      } else {
        // if it's use OAuth2 for authentication, go to authentication server
        window.open(this.oauth_server, '_self');
      }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      this.handlerService.closeAlert();
      console.log('login guard...');
      this.authService.setTargetURL(state.url);
      if ('' === this.authService.getLoginUser() || '' === this.authService.getJWT()) {
        let lang = this.translate.currentLang;
        if (!lang) {
          let browserLang = this.translate.getBrowserLang();
          if (browserLang && ['en', 'zh'].indexOf(browserLang) > -1) {
            lang = browserLang;
          } else {
            // this.translate.use("en");
            lang = 'en';
          }
        }
        // this.apiService.get('appbiz/cfg/authresult').subscribe(
        this.apiService.get(this.baseinfo_uri + lang).subscribe(
          (res: any) => {
            if (res && res.success) {
              console.log('baseinfo', res.result);
              let usernameDisplay = 'default username';
              if (res.result.user && res.result.user.username) {
                usernameDisplay = res.result.user.username;
              }
              this.authService.setLoginUser(usernameDisplay);

              let userId;
              if (res.result.user && res.result.user.id) {
                userId = res.result.user.id;
                this.authService.setUserId(userId);
              }

              let adminFlag = 'false';
              if (res.result.user && res.result.user.roles) {
                // admi = res.result.user.username;
                for(const role of res.result.user.roles) {
                  if('admin'  === role.code) {
                    adminFlag = 'true';
                  }
                }
              }
              this.authService.setAdminFlag(adminFlag);

              const firstLoginFlag: string = !!res.result.user.firstLogin ? '1' : '0';
              console.log('firstLoginFlag', firstLoginFlag);
              this.authService.setFirstLogin(firstLoginFlag);

              // debugger;
              this.authService.setMenus(res.result.menu);

              this.enumService.setEnumList(res.result.enum || []);
              // this.authService.setJWT(res);
              this.router.navigateByUrl(state.url);
            } else {
              console.log(res);
              this.doLogin(state.url);
            }
          }, (err) => {
            this.doLogin(state.url);
          }
        );
        return false;
      } else {
        return true;
      }
    }
    }
