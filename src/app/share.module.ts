import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {TranslateModule} from '@ngx-translate/core';
import {NgZorroAntdMobileModule} from 'ng-zorro-antd-mobile';
import {AlertComponent} from './uilib/components/alert/alert.component';
import {WorkflowLogComponent} from './uilib/components/workflow-log/workflow-log.component';
import {ViewAttachmentsComponent} from './uilib/components/view-attachments/view-attachments.component';
import {ListTableComponent} from './uilib/components/list-table/list-table.component';
import {TipComponent} from './uilib/components/tip/tip-template.component';
import {HtmlPipe} from './uilib/components/dynamic-template/html-pipe';
import {IsActivePipe, YYYYMMDDDatePipe} from './uilib/pipes';
import {IconPickerComponent} from './uilib/components/icon-picker/icon-picker.component';
import {TabRouterComponent} from './uilib/components/tab-router/tab-router.component';
import {SysUserTableComponent} from './uilib/components/sys-user-table/sys-user-table.component';
import {SysUserSelectComponent} from './uilib/components/sys-user-select/sys-user-select.component';
import {SysUserSelectMultiComponent} from './uilib/components/sys-user-select-multi/sys-user-select-multi.component';
import {MasterdataSelectComponent} from './uilib/components/masterdata-select/masterdata-select.component';
import {TabDynamicContentComponent} from './uilib/components/tab-router/tab-dynamic-content.component';
import {EditI18nBackendComponent} from './uilib/components/edit-i18n-backend/edit-i18n-backend.component';
import {I18nEditorComponent} from './uilib/components/i18n-editor/i18n-editor.component';
import {PersonalInfoModalComponent} from './uilib/components/personal-info-modal/personal-info-modal.component';
import {FileUploadComponent} from './uilib/components/file-upload/file-upload.component';
import {EnumSelectComponent} from './uilib/components/enum-select/enum-select.component';

const COMPONENTS = [
  AlertComponent,
  WorkflowLogComponent,
  ViewAttachmentsComponent,
  ListTableComponent,
  TipComponent,
  HtmlPipe,
  IconPickerComponent,
  TabRouterComponent,
  SysUserTableComponent,
  SysUserSelectComponent,
  SysUserSelectMultiComponent,
  MasterdataSelectComponent,
  TabDynamicContentComponent,
  EditI18nBackendComponent,
  PersonalInfoModalComponent,
  I18nEditorComponent,
  FileUploadComponent,
  EnumSelectComponent
];

const PIPES = [
  YYYYMMDDDatePipe,
  IsActivePipe
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroAntdModule,
    NgZorroAntdMobileModule,
    TranslateModule
  ],
  declarations: [
    ...COMPONENTS,
    ...PIPES
  ],
  entryComponents: [
    TipComponent,
    TabDynamicContentComponent,
    SysUserTableComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroAntdModule,
    NgZorroAntdMobileModule,
    TranslateModule,
    ...COMPONENTS,
    ...PIPES
  ]
})
export class AppSharedModule {
}
