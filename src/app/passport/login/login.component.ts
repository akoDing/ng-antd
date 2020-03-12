import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService, ApiService, HandlerService} from '../../uilib/services';
import {checkFormValid} from '../../uilib/util/util';
import {CommonConstants} from 'src/app/uilib/util/CommonConstants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class UserLoginComponent implements OnInit {

  form: FormGroup;
  isProcessing = false;
  emailId = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    public handlerService: HandlerService) {
  }

  get userName() {
    return this.form.controls['userName'];
  }

  // region: fields

  get password() {
    return this.form.controls['password'];
  }

  ngOnInit() {
    this.form = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
    const user = this.authService.getRememberUser();
    this.userName.setValue(user.userName);
    this.password.setValue(user.password);
  }

  // endregion

  login(isMobile = false) {
    this.handlerService.closeAlert();
    if (!checkFormValid(this.form)) {
      return;
    }

    this.isProcessing = true;
    const emaiStr: string = this.userName.value;
    const atPosition = emaiStr.indexOf('@');
    if (atPosition > 0) {
      this.emailId = emaiStr.trim();
    } else {
      this.emailId = emaiStr.trim() + '@philips.com';
    }

    // const params = {
    //     userName: encodeURIComponent(this.emailId),
    // password: encodeURIComponent(this.password.value)
    // };
    const params = {
      userName: this.emailId,
      password: this.password.value
    };

    //new login method
    this.apiService.callApi(this.apiService.doLogin('appbiz/login', params),
      (res: any) => {
      debugger;
        const token = res.result.token;
        this.authService.setJWT(`Bearer ${token}`);
        const targetUrl = this.authService.getTargetURL();
        console.log('what targetUrl', targetUrl);
        if (targetUrl === '' || targetUrl === '/passport/login') {
          if (isMobile) {
            this.router.navigate(['m']);
          } else {
            this.router.navigate(['pc']);
          }
        } else {
          this.router.navigateByUrl(targetUrl);
        }
        if (this.form.controls['remember'].value) {
          this.authService.setRememberUser(this.emailId, this.password.value);
        } else {
          this.authService.removeRememberUser();
        }
        this.isProcessing = false;
      }, () => {
        this.isProcessing = false;
      }
    );
  }

  keepClientInfo(dvsType: string) {
    const params = {
      what: 'logon',
      deviceType: dvsType,
      userAgent: 'unknown',
      misc: ''
    };
    if (window && window.navigator) {

      const nav = window.navigator;

      params.userAgent = nav.userAgent;

      if (nav.product) {
        params.misc = params.misc + ' /' + nav.product;
      }

      if (nav.platform) {
        params.misc = params.misc + ' /' + nav.platform;
      }

      if (nav.maxTouchPoints) {
        params.misc = params.misc + ' /' + nav.maxTouchPoints;
      }

      if (nav.hardwareConcurrency) {
        params.misc = params.misc + ' /' + nav.hardwareConcurrency;
      }

      if (nav.vendor) {
        params.misc = params.misc + ' /' + nav.vendor;
      }
    }

    this.apiService.callApi(this.apiService.postJSON('appbiz/clientinfo', params),
      (res) => {
        // do nothing
      });
  }
}
