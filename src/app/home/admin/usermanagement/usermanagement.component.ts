import {Component, OnInit, ViewChild} from '@angular/core';
import {TabRouter} from '../../../uilib/components/tab-router/model/tabRouter';
import {Subject} from 'rxjs';
import {UserlistComponent} from './userlist/userlist.component';
import {UserdetailComponent} from './userdetail/userdetail.component';
import {ApiService} from '../../../uilib/services';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.less']
})
export class UsermanagementComponent implements OnInit {

  @ViewChild('userList', {static: true}) userList: UserlistComponent;
  @ViewChild('userDetail', {static: true}) userDetail: UserdetailComponent;

  tabs: TabRouter[];

  index: number = 0;

  reload: Subject<any> = new Subject();

  constructor(private apiService: ApiService, private msg: NzMessageService) {
  }

  ngOnInit(): void {
    this.tabs = [
      {
        title: '用户列表',
        closeable: false,
        template: this.userList
      }
    ];
  }

  disable($event) {
    this.apiService.postJSON(`appbiz/user/updateUser`, {
      ...$event,
      disable: true
    }).subscribe(res => {
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
      template: this.userDetail,
      attribute: {user: $event, readonly: true},
      icon: 'eye'
    });
    this.index = this.tabs.length - 1;
  }

  edit($event) {
    this.tabs.push({
      title: `frontend.edit`,
      titleAppend: ` (${$event.name})`,
      closeable: true,
      template: this.userDetail,
      attribute: {user: $event, readonly: false},
      icon: 'edit'
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
