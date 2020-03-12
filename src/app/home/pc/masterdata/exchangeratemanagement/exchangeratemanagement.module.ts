import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppSharedModule} from '../../../../share.module';
import { Routes, RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import {ExchangeratemanagementComponent} from './exchangeratemanagement.component';
import {ExchangeratedetailComponent} from './exchangeratedetail/exchangeratedetail.component';
import {ExchangeratelistComponent} from './exchangeratelist/exchangeratelist.component';


const routes: Routes = [
  { path: '', component: ExchangeratemanagementComponent }
];

@NgModule({
  declarations: [ExchangeratemanagementComponent, ExchangeratedetailComponent, ExchangeratelistComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class ExchangeratemanagementModule { }
