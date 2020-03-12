import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppSharedModule} from '../../../../share.module';
import { Routes, RouterModule } from '@angular/router';
import { CostInfoComponent } from './cost-info.component';
import { CostInfoTableComponent} from './table/table.component';
import { CostInfoDetailComponent} from './detail/detail.component';


const routes: Routes = [
  { path: '', component: CostInfoComponent }
];

@NgModule({
  declarations: [CostInfoComponent, CostInfoTableComponent, CostInfoDetailComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CostInfoModule { }
