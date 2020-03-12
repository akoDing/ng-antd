import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingService } from '../../../../uilib/services/setting.service';
import { Subscription } from 'rxjs';
import { MenuService } from '../../../services/common/menu.service';

@Component({
    selector: 'header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.less']
})
export class HeaderMenuComponent implements OnInit, OnDestroy {

    @Input() device: string;
    menuData: any[] = [];
    menuDataSubscription: Subscription;

    constructor(
        private menuService: MenuService,
        public setting: SettingService
    ) {
        this.menuDataSubscription = this.menuService.menuDataAvailableSubject.subscribe(
            (val: any) => {
                if (val) {
                    this.menuData = this.menuService.menuData;
                }
            }
        );
    }

    ngOnInit(): void {
    }
    ngOnDestroy(): void {
        this.menuDataSubscription.unsubscribe();
    }
    getIconType(icon): string {
        if (icon && icon !== '') {
            return icon;
        } else {
            return 'appstore';
        }
    }
}
