import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';


@Injectable()
export class AuthService {
  public TARGET_URL = 'TARGET_URL';

  public LOGIN_USER = 'LOGIN_USER';

  public LOGIN_USER_ID = 'LOGIN_USER_ID';

  public LOGIN_PASSWORD = 'LOGIN_PASSWORD';

  public LOGIN_TYPE = 'LOGIN_TYPE';

  public ADMIN_FLAG = 'ADMIN_FLAG';

  public PS_JWT = 'PS_JWT';

  public PS_MENUS = 'PS_MENUS';

  public PS_BUTTONS = 'PS_BUTTONS';

  public FIRST_LOGIN = 'FIRST_LOGIN';

  public userSubject = new Subject();

  public firstLoginSubject = new Subject();

  getTargetURL(): string {
    return sessionStorage.getItem(this.TARGET_URL) || '';
  }

  setTargetURL(targetURL: string) {
    sessionStorage.setItem(this.TARGET_URL, targetURL);
  }

  getLoginUser(): string {
    return sessionStorage.getItem(this.LOGIN_USER) || '';
  }

  setLoginUser(loginUser: string) {
    sessionStorage.setItem(this.LOGIN_USER, loginUser);
    this.userSubject.next(loginUser);
  }

  logOut() {
    sessionStorage.removeItem(this.LOGIN_USER);
    sessionStorage.removeItem(this.TARGET_URL);
    sessionStorage.removeItem(this.LOGIN_TYPE);
    sessionStorage.removeItem(this.ADMIN_FLAG);
    sessionStorage.removeItem(this.FIRST_LOGIN);
    sessionStorage.removeItem(this.PS_JWT);
    sessionStorage.removeItem(this.PS_MENUS);
  }

  setRememberUser(userName: string, password: string) {
    localStorage.setItem(this.LOGIN_USER, userName);
    localStorage.setItem(this.LOGIN_PASSWORD, password);
  }

  getRememberUser() {
    return {
      userName: localStorage.getItem(this.LOGIN_USER),
      password: localStorage.getItem(this.LOGIN_PASSWORD)
    };
  }

  removeRememberUser() {
    localStorage.removeItem(this.LOGIN_USER);
    localStorage.removeItem(this.LOGIN_PASSWORD);
  }

  getLoginType(): string {
    return sessionStorage.getItem(this.LOGIN_TYPE) || '';
  }

  setLoginType(loginType: string) {
    sessionStorage.setItem(this.LOGIN_TYPE, loginType);
  }

  getAdminFlag(): string {
    return sessionStorage.getItem(this.ADMIN_FLAG) || 'false';
  }

  setAdminFlag(adminFlag: string) {
    sessionStorage.setItem(this.ADMIN_FLAG, adminFlag);
  }

  //below line added newly

  getJWT(): string {
    return sessionStorage.getItem(this.PS_JWT);
  }

  setJWT(jwt: string) {
    sessionStorage.setItem(this.PS_JWT, jwt);
  }

  removeJWT(){
    sessionStorage.removeItem(this.PS_JWT);
  }

  getUserId(): number {
    return Number(sessionStorage.getItem(this.LOGIN_USER_ID)) || undefined;
  }

  setUserId(id: string) {
    sessionStorage.setItem(this.LOGIN_USER_ID, id);
  }

  getMenus(): any[] {
    return JSON.parse(sessionStorage.getItem(this.PS_MENUS));
  }

  setMenus(menus: any) {
    sessionStorage.setItem(this.PS_MENUS, JSON.stringify(menus));
  }

  getButtons(): any[] {
    return JSON.parse(sessionStorage.getItem(this.PS_BUTTONS));
  }

  setButtons(buttons: any) {
    sessionStorage.setItem(this.PS_BUTTONS, JSON.stringify(buttons));
  }


  getFirstLogin(): string {
    return sessionStorage.getItem(this.FIRST_LOGIN) || '0';
  }

  setFirstLogin(flag: string) {
    sessionStorage.setItem(this.FIRST_LOGIN, flag);
    this.firstLoginSubject.next(true);
  }

  //unused
  initLoginUserInfo(result: any) {
    this.setJWT(result.token);
    if (result.user && result.user.username) {
      this.setLoginUser(result.user.username);
    }
  }
}
