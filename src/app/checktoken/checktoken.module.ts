import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ChecktokenComponent } from './checktoken.component';
import { AppSharedModule } from '../share.module';

const routes: Routes = [
  { path: '**', component: ChecktokenComponent },
];

@NgModule({
  declarations: [ChecktokenComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    AppSharedModule
  ]
})
export class ChecktokenModule { }
