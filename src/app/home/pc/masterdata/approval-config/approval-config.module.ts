import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from '../../../../share.module';
import { Routes, RouterModule } from '@angular/router';
import { ApprovalConfigComponent } from './approval-config.component';
import { ApprovalConfigTableComponent } from './table/table.component';
import { ApprovalConfigDetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: '', component: ApprovalConfigComponent }
]

@NgModule({
  declarations: [ApprovalConfigComponent, ApprovalConfigTableComponent, ApprovalConfigDetailComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ApprovalConfigModule { }
