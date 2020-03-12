import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {SysMenu} from '../../domain';
import {ApiService} from '../../../uilib/services';
import {generateTree} from '../../../uilib/util/TreeUtil';
import {MenuService} from '../../services/common';
import {SysRole} from '../../domain/role';

@Component({
  selector: 'app-authmanagement',
  templateUrl: './authmanagement.component.html',
  styleUrls: ['./authmanagement.component.less']
})
export class AuthmanagementComponent implements OnInit {

  mapOfExpandedData: { [mid: number]: SysMenu[] } = {};

  menuTreeList: SysMenu[] = [];

  roleList: SysRole[] = [];
  allRoleList: SysRole[] = [];
  selectRoleId: string;
  menuList: SysMenu[] = [];

  menuLoading: boolean = false;
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId: { [key: string]: any } = {};
  saveLoading: boolean = false;
  saveDisabled: boolean = true;

  constructor(private apiService: ApiService, private msg: NzMessageService, private menuService: MenuService) {
  }

  ngOnInit(): void {
    this.loadMenuData(null);
    this.loadRoleData();
  }

  changeSelectRole($event) {
    console.log('change select role id:', $event);
    this.saveDisabled = false;
    this.mapOfCheckedId = {};
    this.menuLoading = true;
    let authUrl = `appbiz/auth/find/${$event}`;
    this.apiService.callApi(this.apiService.get(authUrl), (res: any) => {
      const actionList: string[] = [...res.result];
      actionList.forEach(actionId => {
        this.mapOfCheckedId[actionId] = {indeterminate: !this.findChildIsAllChecked(actionId, actionList)};
      });
      this.refreshAllCheckedState();
      this.menuLoading = false;
    });
  }

  searchRole($event) {
    const searchValue = $event.target.value;
    if (!searchValue) {
      this.roleList = [...this.allRoleList];
      return;
    }
    const filterList = this.roleList.filter(item => {
      console.log(item.name.toLowerCase());
      return item.name.toLowerCase().indexOf(searchValue) >= 0 || item.displayName.toLowerCase().indexOf(searchValue) >= 0;
    });
    this.roleList = [...filterList];
  }

  getParentList(menu: SysMenu, expandList: string[]) {
    expandList.push(menu.id);
    if (!!menu.parent) {
      this.getParentList(menu.parent, expandList);
    }
  }

  loadRoleData() {
    let roleUrl = 'appbiz/role/all';
    this.apiService.callApi(this.apiService.get(roleUrl), (res: any) => {
      this.roleList = [...res.result];
      this.allRoleList = [...res.result];
    });
  }

  loadMenuData(menu: SysMenu) {
    let expandList = [];
    if (!!menu) {
      this.getParentList(menu, expandList);
    }
    console.log(expandList);
    this.menuLoading = true;
    let menuUrl = 'appbiz/action/findAll';
    this.apiService.callApi(this.apiService.getJson(menuUrl), (res: any) => {
      let data: SysMenu[] = res.result;
      let tree: SysMenu = {};
      generateTree(data, null, tree);
      this.menuList = res.result;
      this.menuTreeList = [...tree.children];
      console.log(this.menuTreeList);
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

  refreshStatus(node: SysMenu): void {
    if (!!this.mapOfCheckedId[node.id]) {
      this.selectNode(node, false);
    } else {
      this.selectNode(node, true);
    }
    this.refreshAllCheckedState();
  }

  checkAll(value: boolean): void {
    console.log('check All', value);
    this.menuTreeList.forEach(item => {
      if (value) {
        this.mapOfCheckedId[item.id] = {indeterminate: false};
      } else {
        delete this.mapOfCheckedId[item.id];
      }
      this.selectNode(item, value);
    });
  }

  saveChange(): void {
    this.saveLoading = true;
    console.log('save change role id:', this.selectRoleId);
    if (!this.selectRoleId) {
      this.msg.error("请选中角色后再保存！");
    }
    let saveActionUrl = `appbiz/auth/save/${this.selectRoleId}`;
    this.apiService.callApi(this.apiService.postJSON(saveActionUrl, Object.keys(this.mapOfCheckedId)), (res: any) => {
      this.msg.success(res.result);
      this.saveLoading = false;
    }, error => {
      console.log(error);
      this.msg.error(error.result);
      this.saveLoading = false;
    });
  }

  private findChildIsAllChecked(actionId: string, actionList: string[]): boolean {
    const action: SysMenu = this.findItemByActionId(actionId);
    const {children} = action;
    if (!children) {
      return true;
    }
    let allChecked = true;
    !!children && children.every(item => {
      if (actionList.indexOf(item.id) < 0) {
        allChecked = false;
        return false;
      }
    });
    return allChecked;
  }

  /**
   * 影响到的Parent
   */
  private selectParent(par: SysMenu, checked: boolean): void {
    if (!par) {
      return;
    }
    const {parent, children} = par;
    !!parent && this.selectParent(parent, checked);
    if (checked) {
      let allChecked = true;
      children.forEach(item => {
        if (!this.mapOfCheckedId[item.id]) {
          allChecked = false;
        }
      });
      this.mapOfCheckedId[par.id] = {indeterminate: !allChecked};
    } else {
      let noneChecked = true;
      children.forEach(item => {
        if (!!this.mapOfCheckedId[item.id]) {
          noneChecked = false;
        }
      });
      if (noneChecked) {
        delete this.mapOfCheckedId[par.id];
      } else {
        this.mapOfCheckedId[par.id] = {indeterminate: true};
      }
    }
  }

  /**
   * 影响到的Child
   */
  private selectChild(child: SysMenu, checked: boolean): void {
    const {children} = child;
    !!children && children.forEach(item => {
      this.selectChild(item, checked);
    });
    if (checked) {
      this.mapOfCheckedId[child.id] = {indeterminate: false};
    } else {
      delete this.mapOfCheckedId[child.id];
    }
  }

  private selectNode(node: SysMenu, checked: boolean): void {
    const {parent, children} = node;
    if (checked) {
      this.mapOfCheckedId[node.id] = {indeterminate: false};
      !!children && children.forEach(item => {
        this.selectChild(item, true);
      });
      this.selectParent(parent, true);
    } else {
      delete this.mapOfCheckedId[node.id];
      !!children && children.forEach(item => {
        this.selectChild(item, false);
      });
      this.selectParent(parent, false);
    }
    this.refreshAllCheckedState();
  }

  private refreshAllCheckedState(): void {
    this.isAllDisplayDataChecked = this.menuTreeList.every(item => !!this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.menuTreeList.some(item => !!this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }

  private findItemByActionId(actionId: string): SysMenu {
    let action: SysMenu = {};
    for (const item of this.menuList) {
      if (item.id === actionId) {
        action = item;
        break;
      }
    }
    return action;
  }

}
