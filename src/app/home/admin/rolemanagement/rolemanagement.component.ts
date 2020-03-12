import {Component, OnInit, ViewChild} from '@angular/core';
import {TabRouter} from '../../../uilib/components/tab-router/model/tabRouter';
import {Subject} from 'rxjs';
import {RolelistComponent} from './rolelist/rolelist.component';
import {ApiService} from '../../../uilib/services';
import {NzMessageService} from 'ng-zorro-antd';
import {RoledetailComponent} from './roledetail/roledetail.component';

@Component({
  selector: 'app-rolemanagement',
  templateUrl: './rolemanagement.component.html',
  styleUrls: ['./rolemanagement.component.less']
})
export class RolemanagementComponent implements OnInit {

  @ViewChild('roleList', {static: true}) roleList: RolelistComponent;
  @ViewChild('roleDetail', {static: true}) roleDetail: RoledetailComponent;

  tabs: TabRouter[];

  index: number = 0;

  reload: Subject<any> = new Subject();

  constructor(private apiService: ApiService, private msg: NzMessageService) {
  }

  ngOnInit(): void {
    this.tabs = [
      {
        title: '角色列表',
        closeable: false,
        template: this.roleList
      }
    ];
  }

  disable($event) {
    this.apiService.delete(`appbiz/role/removeRole/${$event.id}`).subscribe(res => {
      if (res.success) {
        this.msg.success('提交成功！');
        this.reload.next(true);
      } else {
        this.msg.error(res.result);
      }
    }, error => {
      this.msg.error(error);
    });
  }

  view($event) {
    this.tabs.push({
      title: `frontend.view`,
      titleAppend: ` (${$event.name})`,
      closeable: true,
      template: this.roleDetail,
      attribute: {role: $event, readonly: true},
      icon: 'eye'
    });
    this.index = this.tabs.length - 1;
  }

  edit($event) {
    this.tabs.push({
      title: `frontend.edit`,
      titleAppend: ` (${$event.name})`,
      closeable: true,
      template: this.roleDetail,
      attribute: {role: $event, readonly: false},
      icon: 'edit'
    });
    this.index = this.tabs.length - 1;
  }

  create(){
    this.tabs.push({
      title: `frontend.create`,
      closeable: true,
      template: this.roleDetail,
      attribute: {role: {}},
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
