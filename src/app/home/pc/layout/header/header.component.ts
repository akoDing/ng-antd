import { Component, OnInit, Input } from '@angular/core';
import { SettingService } from '../../../../uilib/services/setting.service';
import { MenuService } from '../../../services/common/menu.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
    searchToggleStatus: boolean;
    menuDataSubscription: Subscription;
    showNew = false;
    showToDo = false;

    constructor(
        public setting: SettingService,
        private menuService: MenuService
    ) { }

    ngOnInit(): void {
        this.menuDataSubscription = this.menuService.menuDataAvailableSubject.subscribe(
            (val: any) => {
                if (val) {
                    this.menuService.menuData.forEach(menu => {
                        if (menu.title === 'MenuApplication') {
                            menu.children.forEach(menuChild => {
                                if (menuChild.title === 'MenuMyApplication') {
                                    this.showNew = true;
                                } else if (menuChild.title === 'MenuToDo') {
                                    this.showToDo = true;
                                }
                            });
                        }
                    });
                }
            }
        );
    }

    toggleCollapsedSideabar() {
        this.setting.setLayout('sideCollapsed', !this.setting.layout.sideCollapsed);
    }

    toggleCollapsedHeaderMenu() {
        this.setting.setLayout('headerCollapsed', !this.setting.layout.headerCollapsed);
    }
}
