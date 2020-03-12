import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppSharedModule} from '../../../../share.module';
import { Routes, RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import {ServicemanagementComponent} from './servicemanagement.component';
import {ServicedetailComponent} from './servicedetail/servicedetail.component';
import {ServicelistComponent} from './servicelist/servicelist.component';


const routes: Routes = [
  { path: '', component: ServicemanagementComponent }
];

@NgModule({
  declarations: [ServicemanagementComponent, ServicedetailComponent, ServicelistComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class ServicemanagementModule { }
