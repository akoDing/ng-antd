import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './passport/notfound/notfound.component';
import { LoginGuard } from './uilib/auth/login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'pc/index', pathMatch: 'full' },
  { path: 'passport', loadChildren: () => import('./passport/passport.module').then(m => m.AppPassportModule) },
  { path: 'checktoken', loadChildren: () => import('./checktoken/checktoken.module').then(m => m.ChecktokenModule) },
  { path: 'pc', loadChildren: () => import('./home/pc.module').then(m => m.PCHomeModule), canActivateChild: [LoginGuard] },
  { path: 'm', loadChildren: () => import('./home/m.module').then(m => m.MobileHomeModule), canActivateChild: [LoginGuard] },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
