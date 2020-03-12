import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppSharedModule} from '../../../../share.module';
import { Routes, RouterModule } from '@angular/router';
import { EmailTemplateComponent } from './email-template.component';
import { EmailTemplateTableComponent } from './table/table.component';
import { EmailTemplateDetailComponent } from './detail/detail.component';
import { QuillModule } from 'ngx-quill';

const routes: Routes = [
  { path: '', component: EmailTemplateComponent }
];

@NgModule({
  declarations: [EmailTemplateComponent, EmailTemplateTableComponent, EmailTemplateDetailComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class EmailTemplateModule { }
