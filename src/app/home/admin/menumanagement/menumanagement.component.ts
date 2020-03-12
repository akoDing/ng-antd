import {Component, OnInit, ViewChild} from '@angular/core';
import {TabRouter} from '../../../uilib/components/tab-router/model/tabRouter';
import {MenutreeComponent} from './menutree/menutree.component';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-menumanagement',
  templateUrl: './menumanagement.component.html',
  styleUrls: ['./menumanagement.component.less']
})
export class MenumanagementComponent implements OnInit {
  @ViewChild('menuInfo', {static: true}) menuInfo;
  @ViewChild('menuTree', {static: true}) menuTree: MenutreeComponent;

  tabs: TabRouter[];

  index: number = 0;

  reload: Subject<any> = new Subject();


  constructor() {
  }

  ngOnInit(): void {
    this.tabs = [
      {
        title: '菜单列表',
        closeable: false,
        template: this.menuTree
      }
    ];
  }

  editMenu($event) {
    this.tabs.push({
      title: `frontend.edit`,
      titleAppend: ` ${$event.title}`,
      closeable: true,
      template: this.menuInfo,
      attribute: {menu: $event},
      icon: 'edit'
    });
    this.index = this.tabs.length - 1;
  }

  deleteMenu($event) {
    console.log('delete', $event);
  }

  insertMenu($event) {
    this.tabs.push({
      title: `插入子菜单`,
      closeable: true,
      template: this.menuInfo,
      attribute: {menu: {parentId: $event.id}},
      icon: 'plus'
    });
    this.index = this.tabs.length - 1;
  }

  createMenu() {
    this.tabs.push({
      title: `frontend.create`,
      closeable: true,
      template: this.menuInfo,
      attribute: {menu: {}},
      icon: 'plus'
    });
    this.index = this.tabs.length - 1;
  }

  closeTab(index) {
    this.tabs.splice(index, 1);
    this.index = 0;
  }

  closeTabAndReload(index, event) {
    this.closeTab(index);
    console.log('closeTabAndReload', event);
    if (event) {
      this.reload.next(event);
    }
  }

}
