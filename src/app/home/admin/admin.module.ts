import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppSharedModule} from '../../share.module';
import {UsermanagementComponent} from './usermanagement/usermanagement.component';
import {UserdetailComponent} from './usermanagement/userdetail/userdetail.component';
import {UserlistComponent} from './usermanagement/userlist/userlist.component';
import {RolemanagementComponent} from './rolemanagement/rolemanagement.component';
import {RolelistComponent} from './rolemanagement/rolelist/rolelist.component';
import {RoledetailComponent} from './rolemanagement/roledetail/roledetail.component';
import {MenumanagementComponent} from './menumanagement/menumanagement.component';
import {MenutreeComponent} from './menumanagement/menutree/menutree.component';
import {MenuinfoComponent} from './menumanagement/menuinfo/menuinfo.component';
import {EnummanagementComponent} from './enummanagement/enummanagement.component';
import {EnummanagementModule} from './enummanagement/enummanagement.module';
import {AuthmanagementComponent} from './authmanagement/authmanagement.component';
import {ProcessinstanceComponent} from './processmanagement/processinstance/processinstance.component';
import {ProcesstemplatemanagerComponent} from './processmanagement/processtemplate/processtemplatemanager.component';
import {TaskmanagerComponent} from './processmanagement/taskinstance/taskmanager.component';
import {ProcessmanagementComponent} from './processmanagement/processmanagement.component';


const adminRoutes: Routes = [
  {path: 'user', component: UsermanagementComponent},
  {path: 'role', component: RolemanagementComponent},
  {path: 'menu', component: MenumanagementComponent},
  {path: 'enum', component: EnummanagementComponent},
  {path: 'process', component: ProcessmanagementComponent},
  {path: 'auth', component: AuthmanagementComponent}
];

@NgModule({
  imports: [
    AppSharedModule,
    EnummanagementModule,
    RouterModule.forChild(adminRoutes)
  ],
  declarations: [
    UsermanagementComponent,
    UserlistComponent,
    UserdetailComponent,
    RolemanagementComponent,
    RolelistComponent,
    RoledetailComponent,
    MenumanagementComponent,
    MenumanagementComponent,
    MenutreeComponent,
    MenuinfoComponent,
    AuthmanagementComponent,
    ProcessmanagementComponent,
    ProcessinstanceComponent,
    ProcesstemplatemanagerComponent,
    TaskmanagerComponent
  ]
})
export class AdminModule {
}
