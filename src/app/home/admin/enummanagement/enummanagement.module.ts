import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from '../../../share.module';
import { Routes, RouterModule } from '@angular/router';
import { EnummanagementComponent } from './enummanagement.component';
import { EnumTableComponent } from './table/table.component';
import { EnumDetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: '', component: EnummanagementComponent }
];

@NgModule({
  declarations: [EnummanagementComponent, EnumTableComponent, EnumDetailComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    RouterModule.forChild(routes)
  ]
})
export class EnummanagementModule { }
