import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppSharedModule } from '../share.module';
import { ResponsiveModule } from './responsive/responsive.module';
import { LoginGuard } from '../uilib/auth/login.guard';
import { LayoutDefaultComponent } from './m/layout/default.component';
import { FullscreenComponent } from './m/layout/fullscreen/fullscreen.component';
import { FullscreenGuideComponent } from './m/layout/fullscreen-guide/fullscreen-guide.component';

const COMPONENTS = [
    LayoutDefaultComponent,
    FullscreenComponent,
    FullscreenGuideComponent
];

const homeRoutes: Routes = [
    {
        path: '', component: LayoutDefaultComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', loadChildren: () => import('./index/index.module').then(m => m.IndexModule), canActivateChild: [LoginGuard] }
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
    ],
    declarations: [
        ...COMPONENTS
    ],
    entryComponents: [
        FullscreenGuideComponent
    ]
})
export class MobileHomeModule { }
