import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {AuthService} from '../services';
import {Observable} from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("request head interceptor ===>");
    let headers = req.headers.set('x-requested-with', 'XMLHttpRequest');
    if (!!this.authService.getJWT()) {
      headers = req.headers.set('Authorization', this.authService.getJWT()).set('x-requested-with', 'XMLHttpRequest');
    }
    const authReq = req.clone({headers});
    return next.handle(authReq);
  }
}
