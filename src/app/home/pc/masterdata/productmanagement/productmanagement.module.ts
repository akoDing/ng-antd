import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppSharedModule} from '../../../../share.module';
import { Routes, RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import {ProductmanagementComponent} from './productmanagement.component';
import {ProductdetailComponent} from './productdetail/productdetail.component';
import {ProductlistComponent} from './prodcutlist/productlist.component';


const routes: Routes = [
  { path: '', component: ProductmanagementComponent }
];

@NgModule({
  declarations: [ProductmanagementComponent, ProductdetailComponent, ProductlistComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class ProductmanagementModule { }
