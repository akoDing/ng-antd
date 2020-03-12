import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../../share.module';
import { CommonModule } from '@angular/common';

const COMPONENTS = [

];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    AppSharedModule
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class PcCommonModule { }
