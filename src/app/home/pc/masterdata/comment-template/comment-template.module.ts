import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppSharedModule} from '../../../../share.module';
import { Routes, RouterModule } from '@angular/router';
import { CommentTemplateComponent } from './comment-template.component';
import { CommentTemplateTableComponent } from './table/table.component';
import { CommentTemplateDetailComponent } from './detail/detail.component';


const routes: Routes = [
  { path: '', component: CommentTemplateComponent }
];

@NgModule({
  declarations: [CommentTemplateComponent, CommentTemplateTableComponent, CommentTemplateDetailComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CommentTemplateModule { }
