import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppSharedModule } from '../../share.module';

import { IndexComponent } from './index.component';

const COMPONENTS = [
    IndexComponent
];

const ROUTES: Routes = [
    {
        path: '', component: IndexComponent
    },
];

@NgModule({
    imports: [
        AppSharedModule,
        RouterModule.forChild(ROUTES)
    ],
    providers: [

    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class IndexModule {}
