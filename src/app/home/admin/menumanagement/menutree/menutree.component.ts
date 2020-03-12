import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {SysMenu} from '../../../domain';
import {ApiService} from '../../../../uilib/services/api.service';
import {Subject} from 'rxjs';
import {generateTree} from '../../../../uilib/util/TreeUtil';
import {MenuService} from '../../../services/common';

@Component({
  selector: 'app-menutree',
  templateUrl: './menutree.component.html',
  styleUrls: ['./menutree.component.less']
})
export class MenutreeComponent {

  mapOfExpandedData: { [mid: number]: SysMenu[] } = {};

  menuTreeList: SysMenu[] = [];

  menuLoading: boolean = false;

  @Output()
  onEdit = new EventEmitter();

  @Output()
  onInsert = new EventEmitter();

  @Output()
  onDelete = new EventEmitter();

  @Output()
  onCreate = new EventEmitter();

  @Input() reload: Subject<boolean>;

  constructor(private apiService: ApiService, private msg: NzMessageService, private menuService: MenuService) {
    this.loadMenuData(null);
  }

  ngOnInit() {
    this.reload.subscribe(res => {
      this.loadMenuData(res as SysMenu);
    });
  }

  getParentList(menu: SysMenu, expandList: string[]) {
    expandList.push(menu.id);
    if (!!menu.parent) {
      this.getParentList(menu.parent, expandList);
    }
  }


  loadMenuData(menu: SysMenu) {
    let expandList = [];
    if (!!menu) {
      this.getParentList(menu, expandList);
    }
    console.log(expandList);
    this.menuLoading = true;
    let menuUrl = 'appbiz/action/findAll';
    this.apiService.callApi(this.apiService.get(menuUrl), (res: any) => {
      let data: SysMenu[] = res.result;
      let tree: SysMenu = {};
      generateTree(data, null, tree);
      this.menuTreeList = [...tree.children];
      this.menuTreeList.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item, expandList);
      });
      this.menuLoading = false;
    }, (res: any) => {
      this.menuLoading = false;
    });
  }

  collapse(array: SysMenu[], data: SysMenu, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: SysMenu, expandList: string[]): SysMenu[] {
    const stack: SysMenu[] = [];
    const array: SysMenu[] = [];
    const hashMap = {};
    stack.push({...root, level: 0, expand: expandList.includes(root.id)});
    while (stack.length !== 0) {
      const node: SysMenu = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          if (expandList.includes(node.id)) {
            console.log(node.id);
          }
          stack.push({...node.children[i], level: node.level + 1, expand: expandList.includes(node.id), parent: node});
        }
      }
    }
    return array;
  }


  visitNode(node: SysMenu, hashMap: { [id: number]: any }, array: SysMenu[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }


  edit(item: SysMenu) {
    this.onEdit.emit(item);
  }

  insert(item: SysMenu) {
    this.onInsert.emit(item);
  }

  remove(item: SysMenu) {
    if (item.children && item.children.length > 0) {
      this.msg.warning('该菜单下有子菜单，请先删除此菜单下的所有子菜单后再删除此菜单！');
      return;
    }
    let menuUrl = `appbiz/i18n/remove/net.mopos.admin.entity.Action:${item.id}`;
    this.apiService.callApi(this.apiService.delete(menuUrl), (res: any) => {
      if (res && res.success) {
        this.msg.success(res.msg);
        //刷新菜单
        this.menuService.refreshMenuData();
        this.loadMenuData(item.parent);
      } else {
        this.msg.error(res.msg);
      }

    }, (res: any) => {
      this.msg.error('action failed.');
    });
  }

  create() {
    this.onCreate.emit();
  }

  ngOnDestroy(): void {
    this.reload.unsubscribe();
  }

}
