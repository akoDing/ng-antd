import { Component, OnInit } from '@angular/core';
import { AuthService, ApiService } from 'src/app/uilib/services';
import { SettingService } from 'src/app/uilib/services/setting.service';

@Component({
    selector: 'header-user',
    templateUrl: './header-user.component.html',
    styleUrls: ['./header-user.component.less']
})
export class HeaderUserComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private apiService: ApiService,
        public setting: SettingService
    ) { }

    userName: string;

    ngOnInit(): void {
        this.userName = this.authService.getLoginUser();
        this.authService.userSubject.subscribe(
            (user: string) => {
                this.userName = user;
            }
        );
    }

    openUserInfoModal() {
        this.authService.setFirstLogin('1');
    }

    logout() {
        this.apiService.doLogout();
    }
}
