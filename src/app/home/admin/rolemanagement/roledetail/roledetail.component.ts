import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../../../uilib/services';
import {NzMessageService} from 'ng-zorro-antd';
import {SysRole} from '../../../domain/role';
import {TableInfo} from '../../../../uilib/components/list-table/list-table';

@Component({
  selector: 'app-roledetail',
  templateUrl: './roledetail.component.html',
  styleUrls: ['./roledetail.component.less']
})
export class RoledetailComponent implements OnInit {

  validateForm: FormGroup;

  @Input()
  role: SysRole;

  @Input()
  readonly: boolean;

  @Output()
  afterSave = new EventEmitter();

  selectUserList: any[];

  defaultUserList: any[];

  selectUserTableConfig: TableInfo = {
    dataColumns: [
      {
        key: 'username',
        label: 'frontend.user.username'
      }, {
        key: 'name',
        label: 'frontend.user.name'
      }, {
        key: 'phoneNumber',
        label: 'frontend.user.phoneNumber'
      }, {
        key: 'mail',
        label: 'frontend.user.mail'
      }
    ],
    data: [],
    frontPaging: true,
    pageIndex: 1,
    pageSize: 50,
    size: 'small',
    isEmptyTableVisible: true,
    loading: false,
    buttonColumn: {
      label: 'frontend.thAction',
      buttons: [
        {
          label: 'frontend.delete',
          event: (data) => {
            this.selectUserTableConfig.data = [...this.selectUserTableConfig.data.filter(user => {
              return data.id != user.id;
            })];
          },
          confirm: true,
          icon: 'user-delete',
          confirmTitle: 'frontend.confirmDelete',
          isVisible: () => {
            return true;
          }
        }]
    }
  };

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private msg: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [{value: this.role.name, disabled: this.readonly}],
      displayName: [{value: this.role.displayName, disabled: this.readonly}],
    });
    if (!this.role.id) {
      return;
    }

    this.selectUserTableConfig.loading = true;
    // 获取用户详情
    this.apiService.getJson(`appbiz/user/findByRoleId/${this.role.id}`).subscribe(res => {
      if (res && res.success) {
        console.log(res.result);
        this.selectUserTableConfig.data = res.result;
        this.selectUserTableConfig.loading = false;
      } else {
        this.msg.error(res.data);
      }
    }, (err) => {
      this.msg.error('action failed.');
    });
  }

  submitForm = (event: any) => {
    event.preventDefault();
    let selectUserIds: number[] = this.selectUserTableConfig.data.map(user => user.id);
    const rawValue = {
      ...this.validateForm.getRawValue(),
    };
    if (selectUserIds.length > 0) {
      rawValue['userList'] = selectUserIds;
    }
    this.apiService.postJSON(`appbiz/role/save`, {...this.role, ...rawValue}).subscribe(res => {
      if (res.success) {
        this.msg.success('提交成功！');
        this.afterSave.emit(true);
      } else {
        this.msg.error(res.result);
      }
    }, error => {
      this.msg.error(error);
    });
  };

  addUser($event) {
    $event.preventDefault();
    let appendUserList = [];
    this.defaultUserList = [];
    this.selectUserList.forEach(user => {
      let contains: boolean = false;
      for (const selectUser of this.selectUserTableConfig.data) {
        if (selectUser.id === user.id) {
          contains = true;
          break;
        }
      }
      if (!contains) {
        appendUserList.push(user);
      }
    });
    this.selectUserTableConfig.data = [...this.selectUserTableConfig.data, ...appendUserList];
  }

  selectUser($event) {
    this.selectUserList = $event;
  }

  closeTabWithoutSave(event) {
    event.preventDefault();
    this.afterSave.emit(this.role);
  }

}
