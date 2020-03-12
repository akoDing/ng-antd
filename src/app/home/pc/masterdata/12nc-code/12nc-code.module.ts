import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppSharedModule} from '../../../../share.module';
import { Routes, RouterModule } from '@angular/router';
import { M12ncCodeComponent} from './12nc-code.component';
import {M12ncCodeTableComponent} from './table/table.component';
import {M12ncCodeDetailComponent} from './detail/detail.component';


const routes: Routes = [
  { path: '', component: M12ncCodeComponent }
];

@NgModule({
  declarations: [M12ncCodeComponent, M12ncCodeTableComponent, M12ncCodeDetailComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    RouterModule.forChild(routes)
  ]
})
export class M12ncCodeModule { }

