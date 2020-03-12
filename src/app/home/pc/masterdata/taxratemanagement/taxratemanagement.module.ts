import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppSharedModule} from '../../../../share.module';
import { Routes, RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import {TaxratemanagementComponent} from './taxratemanagement.component';
import {TaxratedetailComponent} from './taxeratedetail/taxratedetail.component';
import {TaxratelistComponent} from './taxratelist/taxratelist.component';


const routes: Routes = [
  { path: '', component: TaxratemanagementComponent }
];

@NgModule({
  declarations: [TaxratemanagementComponent, TaxratedetailComponent, TaxratelistComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class TaxratemanagementModule { }
