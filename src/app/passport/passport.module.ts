import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppSharedModule } from '../share.module';

import { UserLoginComponent } from './login/login.component';
import { PassportComponent } from './passport.component';
import { UserLogoutComponent } from './logout/logout.component';
import { LoginFooterComponent } from './login-footer/login-footer.component';

const passportRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: PassportComponent },
    { path: 'logout', component: UserLogoutComponent },
];

const COMPONENTS = [
    UserLoginComponent,
    PassportComponent,
    UserLogoutComponent,
    LoginFooterComponent
];

@NgModule({
    imports: [
        RouterModule.forChild(passportRoutes),
        AppSharedModule
    ],
    providers: [],
    declarations: [
        COMPONENTS
    ],
    exports: [
        COMPONENTS
    ]
})
export class AppPassportModule { }
