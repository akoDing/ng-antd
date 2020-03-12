import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/home/services/common/menu.service';
import { SettingService } from 'src/app/uilib/services/setting.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit, OnDestroy {
    @Input() device: string;
    @Output() private menuDataReadyEvent = new EventEmitter();

    @Output() private itemClickEvent = new EventEmitter();
    // default menus
    // menuData = {
    //     'children': [
    //         {
    //             'children': [
    //                 {
    //                     'text': 'test',
    //                     'url': '',
    //                     'selected': false
    //                 }
    //             ],
    //             'description': 'desc',
    //             'expanded': false,
    //             'mid': 1,
    //             'text': 'test'
    //         }
    //     ]
    // };
    menuData: any[] = [];

    menuDataSubscription: Subscription;

    currentPath: string;

    constructor(
        private menuService: MenuService,
        public setting: SettingService,
        private location: Location) {
        this.currentPath = this.location.path();
        // debugger;
        this.menuDataSubscription = this.menuService.menuDataAvailableSubject.subscribe(
            (val: any) => {
                // debugger;
                if (val) {
                    this.menuData = this.menuService.menuData;
                    // this.menuDataReadyEvent.emit(this.menuData.children); // TODO
                    this.menuDataReadyEvent.emit(this.menuData); // TODO
                    this.checkOpen();
                }

            }
        );
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.menuDataSubscription.unsubscribe();
    }

    // expand the submenu when the item url equals the route url
    checkOpen() {
        // debugger;
        let isOpen = false;
        this.menuData.forEach(menu => {
            if(menu.children) {
                menu.children.forEach(item => {
                    if (item.url === this.currentPath) {
                        item.selected = true;
                        menu.expanded = true;
                        isOpen = true;
                    }
                });
            }
        });
        if (this.menuData.length > 0 && !isOpen) {
            this.menuData[0].expanded = true;
        }
    }

    closeOtherMenu = (data: any) => {
        this.menuData.forEach(menu => {
            menu.expanded = false;
        });
        data.expanded = true;
    }

    getIconType(icon): string {
        if (icon && icon !== '') {
            return icon;
        } else {
            return 'appstore';
        }
    }

    onItemClick(event) {
        this.itemClickEvent.emit();
    }
}
