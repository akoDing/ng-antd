import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MasterdataComponent } from './masterdata.component';

const routes: Routes = [
  {
    path: '', component: MasterdataComponent,
    children: [
      { path: 'comment-template', loadChildren: () => import('./comment-template/comment-template.module').then(m => m.CommentTemplateModule) },
      { path: 'email-template', loadChildren: () => import('./email-template/email-template.module').then(m => m.EmailTemplateModule) },
      { path: 'approval-config', loadChildren: () => import('./approval-config/approval-config.module').then(m => m.ApprovalConfigModule) },
      { path: 'cost-info', loadChildren: () => import('./cost-info/cost-info.module').then(m => m.CostInfoModule) },
      { path: 'exchangerate-management', loadChildren: () => import('./exchangeratemanagement/exchangeratemanagement.module').then(m => m.ExchangeratemanagementModule) },
      { path: 'service-management', loadChildren: () => import('./servicemanagement/servicemanagement.module').then(m => m.ServicemanagementModule) },
      { path: 'taxrate-management', loadChildren: () => import('./taxratemanagement/taxratemanagement.module').then(m => m.TaxratemanagementModule) },
      { path: 'product-management', loadChildren: () => import('./productmanagement/productmanagement.module').then(m => m.ProductmanagementModule) },
      { path: '12nc-code', loadChildren: () => import('./12nc-code/12nc-code.module').then(m => m.M12ncCodeModule) },
      { path: 'setmealmanagement', loadChildren: () => import('./setmealmanagement/setmealmanagement.module').then(m => m.SetmealmanagementModule) },
    ]
  }
];

@NgModule({
  declarations: [MasterdataComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MasterdataModule { }
