import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppSharedModule} from '../share.module';
import {ResponsiveModule} from './responsive/responsive.module';
import {DefaultComponent} from './pc/layout/default/default.component';
import {HeaderComponent} from './pc/layout/header/header.component';
import {HeaderMenuComponent} from './pc/layout/header-menu/header-menu.component';
// import { ReimburseWorkflowService } from './core/workflow/reimbursement-workflow.service';
// import { TaskService } from './core/common/task.service';
// import { WorkflowLogComponent } from '../uilib/components/workflow-log/workflow-log.component';

const COMPONENTS = [
  DefaultComponent,
  HeaderComponent,
  HeaderMenuComponent
];

const homeRoutes: Routes = [
  {
    path: '', component: DefaultComponent,
    children: [
      {path: '', redirectTo: 'index', pathMatch: 'full'},
      {path: 'index', loadChildren: () => import('./index/index.module').then(m => m.IndexModule)},
      {path: 'config', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
      {path: 'masterdata', loadChildren: () => import('./pc/masterdata/masterdata.module').then(m => m.MasterdataModule)},
      {path: 'data', loadChildren: () => import('./pc/data/data.module').then(m => m.DataModule)},
      {path: 'funnel', loadChildren: () =>  import('./pc/funnel/funnel.module').then(m => m.FunnelModule)}
    ]
  }
];

@NgModule({
  imports: [
    AppSharedModule,
    ResponsiveModule,
    RouterModule.forChild(homeRoutes)
  ],
  providers: [
    // MenuService,
    // FileService,
    // TaskService,
    // ReimburseWorkflowService
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [
    // WorkflowLogComponent
  ]
})
export class PCHomeModule {
}
