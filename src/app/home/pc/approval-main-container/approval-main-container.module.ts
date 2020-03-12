import { NgModule } from '@angular/core';
import { PcCommonModule } from '../common/common.module';
import { AppSharedModule } from '../../../share.module';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ApprovalMainContainerComponent } from './approval-main-container.component';

const routes: Routes = [
  { path: '', component: ApprovalMainContainerComponent }
];

@NgModule({
  declarations: [ApprovalMainContainerComponent],
  imports: [
    CommonModule,
    PcCommonModule,
    AppSharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ApprovalMainContainerModule { }
