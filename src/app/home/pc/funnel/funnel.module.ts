import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AppSharedModule} from '../../../share.module';
import {EnummanagementModule} from '../../admin/enummanagement/enummanagement.module';
import {FunnelListComponent} from './funnel-list/funnel-list.component';
import {FunnelTableComponent} from './funnel-list/table/table.component';
import {FunnelFormComponent} from './funnel-form/funnelform.component';


const funnelRoutes: Routes = [
  {path: 'funnel-list', component: FunnelListComponent}
];

@NgModule({
  imports: [
    AppSharedModule,
    EnummanagementModule,
    RouterModule.forChild(funnelRoutes)
  ],
  declarations: [
    FunnelListComponent,
    FunnelTableComponent,
    FunnelFormComponent
  ]
})
export class FunnelModule {
}
