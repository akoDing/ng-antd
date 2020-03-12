import { Component, OnInit } from '@angular/core';
import { ApiService, AuthService } from '../uilib/services';
import { LoginGuard } from '../uilib/auth/login.guard';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checktoken',
  templateUrl: './checktoken.component.html',
  styleUrls: ['./checktoken.component.less']
})
export class ChecktokenComponent implements OnInit {

  constructor(
    private aRoute: ActivatedRoute,
    private loginGuard: LoginGuard,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router) { 

    const tmpToken = this.aRoute.snapshot.queryParams['token'];
    if (tmpToken) {
      const uri = 'appbiz/oauth2Login' + '?token=' + tmpToken;
      this.apiService.callApi(this.apiService.get(uri), res => {
        if (res && res.success) {
          const token = res.result.token;
          this.authService.setJWT(`Bearer ${token}`);
          const url = this.authService.getTargetURL();
          if('' !== url) {
            this.router.navigate([url]);
          } else {
            this.router.navigate(['pc/index']);
          }
        } else {
          this.loginGuard.doLogin();
        }
      }, err => {
        console.log('checktoken error', err);
        this.loginGuard.doLogin();
      });
    } else {
      this.loginGuard.doLogin();
    }
      
  

  }

  ngOnInit() {
  }
    

}
