import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthService, HandlerService } from '../services';
import { environment } from 'src/environments/environment';
import { CommonConstants } from '../util/CommonConstants';


@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    oauth_server = environment.oauth_server;
    production_flag: boolean = environment.production || false;

    constructor(
        private router: Router,
        private authService: AuthService,
        private handlerService: HandlerService) { }

    doLogin() {
        if (!this.production_flag || CommonConstants.LOGIN_TYPE_LOCAL === this.authService.getLoginType()) {
            this.router.navigateByUrl('passport/login');
            if (document.getElementsByTagName('nz-modal').length > 0) {
                document.body.removeChild(document.getElementsByTagName('nz-modal')[0]);
            }
            this.handlerService.handleException(401, '', 'Please log on');
        } else {
            // if it's use OAuth2 for authentication, go to authentication server
            window.open(this.oauth_server, '_self');
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      console.log("response interceptor ===>");
        return next.handle(req).pipe(
            tap(
                event => {
                  if(event instanceof HttpResponse){
                    switch (event.status) {
                      case 210:
                        const token = event.headers.get("Authorization");
                        console.log("refresh token ===>" + token);
                        this.authService.setJWT(token);
                        break;
                    }
                  }
                },
                // Operation failed; error is an HttpErrorResponse
                error => {
                   if(error instanceof HttpErrorResponse){
                     switch (error.status) {
                       case 401:
                         this.doLogin();
                         break;
                       case 404:
                         this.router.navigate(['notfound']);
                         break;
                       case 408:
                         this.doLogin();
                         break;
                     }
                   }
                }
            ),
            finalize(() => {
                // TODO
            })
        );
    }
}
