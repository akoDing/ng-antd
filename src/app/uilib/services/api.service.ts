import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {serialize, transToFormData} from '../util/util';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {HandlerService} from './handler.service';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth.service';
import {tap} from 'rxjs/operators';
import {CommonConstants} from '../util/CommonConstants';
import {saveAs} from 'file-saver';

@Injectable()
export class ApiService {
  base_href = environment.base_href;
  csrfToken = '';
  csrfTokenUrl = 'appbiz/cfg/csrftoken';
  jsonHeaders: HttpHeaders;
  formHeaders: HttpHeaders;
  multipartformHeaders: HttpHeaders;


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    public handlerService: HandlerService
  ) {
    this.jsonHeaders = new HttpHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');

    this.formHeaders = new HttpHeaders().set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');

    this.multipartformHeaders = new HttpHeaders().set('Accept', 'application/json');
  }

  getFullHref(path: string): string {
    return this.base_href + path;
  }

  getStaticResource(path: string): Observable<any> {
    return this.http.get(path);
  }

  get(path: string, args?: any): Observable<any> {
    const options = this.getOptions(this.jsonHeaders);
    if (args) {
      options['params'] = serialize(args);
    }
    return this.http.get(this.base_href + path, options);
  }

  getJson(path: string, args?: any): Observable<any> {
    const options = this.getOptions(this.jsonHeaders);
    if (args) {
      options['params'] = serialize(args);
    }
    return this.http.get(this.base_href + path, options);
  }

  downloadFile(uri: string, name: string): void {
    this.http.get(uri).subscribe(res => {
      let arr = this.base64ToArrayBuffer(res);
      let blob = new Blob([arr]);
      saveAs(blob, name);
    }, error => {
    });
  }

  base64ToArrayBuffer(base64) {
    let binaryString = window.atob(base64);
    let binaryLen = binaryString.length;
    let bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      let ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  postJSON(path: string, jsonObject: any, customHeaders?: HttpHeaders): Observable<any> {
    const options = this.getOptions(this.jsonHeaders, customHeaders);
    return this.http.post(this.base_href + path, jsonObject, options);
  }

  postForm(path: string, body: any, isMultipart: boolean = false, customHeaders?: HttpHeaders): Observable<any> {
    if (isMultipart) {
      const options = this.getOptions(this.multipartformHeaders, customHeaders);
      if (body instanceof FormGroup) {
        body = transToFormData(body);
      }
      return this.http.post(this.base_href + path, body, options);
    } else {
      const options = this.getOptions(this.formHeaders, customHeaders);
      const params = serialize(body);
      return this.http.post(this.base_href + path, params, options);
    }
  }

  putJSON(path: string, jsonObject: any, customHeaders?: HttpHeaders): Observable<any> {
    const options = this.getOptions(this.jsonHeaders, customHeaders);
    return this.http.put(this.base_href + path, JSON.stringify(jsonObject), options);
  }

  putFormGroup(path: string, fg: FormGroup, customHeaders?: HttpHeaders): Observable<any> {
    const options = this.getOptions(this.multipartformHeaders, customHeaders);
    const formData = transToFormData(fg);

    return this.http.put(this.base_href + path, formData, options);
  }

  delete(path: string, args?: any): Observable<any> {
    const options = this.getOptions(this.jsonHeaders);
    if (args) {
      options['params'] = serialize(args);
    }

    return this.http.delete(this.base_href + path, options);
  }

  /**
   * the common method to call the api
   * @param api request path
   * @param success success method when request success
   * @param error error method when request failed
   */
  async callApi(api: Observable<any>, success?: Function, error?: Function, isModal: boolean = false) {
    api.subscribe(
      (res: any) => {
        console.log(res);
        if (res && res.success) {
          if (res.csrfToken) {
            this.csrfToken = res.csrfToken;
          }
          if (success) {
            success(res);
          }
        } else {
          this.handlerService.handleException(res.statusCode, res.exceptionId, res.msg, isModal);
          if (error) {
            error();
          }
        }
      }, (err) => {
        this.handlerService.handleException(err.error.statusCode, err.error.exceptionId, err.error.msg, isModal);
        if (error) {
          error();
        }
      }
    );
  }

  pipeApi(api: Observable<any>, isModal: boolean = false): Observable<any> {
    return api.pipe(
      tap((res: any) => {
        if (res && res.success && res.csrfToken) {
          this.csrfToken = res.csrfToken;
        } else {
          this.handlerService.handleException(res.statusCode, res.exceptionId, res.msg, isModal);
          throw new Error();
        }
      }, (err) => {
        console.log('pipeApi, err ->', err);
        this.handlerService.handleException(err.error.statusCode, err.error.exceptionId, err.error.msg, isModal);
      })
    );
  }

  getCsrfToken(success?: Function, error?: Function) {
    this.callApi(this.get(this.csrfTokenUrl), success, error);
  }

  setCsrfToken(_csrfToken: string) {
    this.csrfToken = _csrfToken;
  }

  doDownload(path: string, params?: any) {
    let fullPath = this.getFullHref(path);
    if (params) {
      const urlParams = serialize(params).toString();
      if (urlParams && urlParams !== '') {
        fullPath = fullPath + '?' + urlParams;
      }
    }
    window.open(fullPath, '_self');
  }

  doLogout() {

    //TODO logot backend api should be checked
    this.postForm('appbiz/logout', null).subscribe(
      (res: any) => {
        this.authService.logOut();
        if (this.authService.getLoginType() === CommonConstants.LOGIN_TYPE_LOCAL) {
          this.router.navigateByUrl('passport/login');
        } else {
          if (res.data && res.data.logoutUrl) {
            window.open(res.data.logoutUrl, '_self');
          } else {
            this.router.navigateByUrl('passport/login');
          }
          // this.router.navigateByUrl('passport/logout');
        }
        this.handlerService.closeAlert();
      }, (err) => {
        this.authService.logOut();
        this.router.navigateByUrl('passport/login');
        this.handlerService.closeAlert();
      }
    );
  }

  doLogin(path: string, body: any, customHeaders?: HttpHeaders): Observable<any> {
    this.authService.removeJWT();
    const options = this.getOptions(customHeaders, this.jsonHeaders);
    const jsonParam = {
      username: body.userName,
      password: body.password
    };
    return this.http.post<any>(this.base_href + path, jsonParam, options);
  }

  private getOptions(hearder: HttpHeaders, customHeaders?: HttpHeaders) {
    const _headers = (customHeaders || hearder).set('X-CSRF-TOKEN', this.csrfToken);
    return {
      headers: _headers
    };
  }
}
