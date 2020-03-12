import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableInfo} from '../../../../uilib/components/list-table/list-table';
import {SysUser} from '../../../domain/user';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../../../uilib/services';
import {Subject} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.less']
})
export class UserlistComponent implements OnInit {


  @Output()
  onDisable = new EventEmitter();

  @Output()
  onView = new EventEmitter();

  @Output()
  onEdit = new EventEmitter();


  searchForm: FormGroup;

  searchData: any = {};

  controlNameList: string[] = ['username', 'lastname', 'mail', 'phoneNumber'];

  @Input()
  reload: Subject<boolean>;

  userTableInfo: TableInfo = {
    pageIndex: 1,
    pageSize: 15,
    total: 0,
    data: [],
    loading: false,
    isEmptyTableVisible: true,
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
      }, {
        key: 'roles',
        label: 'frontend.user.roles',
        formatContent: (data) => {
          const roleDisplayName: string[] = data.map(({name}) => {
            return this.translateService.instant(name);
          });
          return roleDisplayName.join(' | ');
        }
      }
    ],
    buttonColumn: {
      label: 'frontend.thAction',
      buttons: [
        {
          label: 'frontend.view',
          event: (data) => {
            this.onView.emit(data);
          },
          icon: 'eye',
          isVisible: () => {
            return true;
          }
        },
        {
          label: 'frontend.edit',
          event: (data) => {
            this.onEdit.emit(data);
          },
          icon: 'edit',
          isVisible: () => {
            return true;
          }
        },
        {
          label: 'frontend.delete',
          confirm: true,
          confirmTitle: 'frontend.confirmDelete',
          event: (data) => {
            this.onDisable.emit(data);
          },
          icon: 'user-delete',
          isVisible: () => {
            return true;
          }
        }
      ]
    }
  };

  constructor(private translateService: TranslateService,
              private apiService: ApiService,
              private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({});
    for (let item of this.controlNameList) {
      this.searchForm.addControl(item, new FormControl());
    }
    this.loadTable();
  }

  onChangePage() {
    this.loadTable();
  }

  ngOnInit(): void {
    this.reload.subscribe(res => {
      console.log('reload data', res);
      if (res === true) {
        this.loadTable();
      }
    });
  }

  onSearch() {
    for (let key in this.searchForm.controls) {
      if (this.searchForm.controls[key].value) {
        this.searchData[key] = this.searchForm.controls[key].value;
      }
    }
    this.loadTable();
  }

  onReset() {
    this.searchForm.reset();
    this.searchData = {};
  }


  loadTable() {
    const uri = 'appbiz/user/findAll';
    const param = {
      advQuery: {
        disable: false,
        ...this.searchData
      },
      pageSize: this.userTableInfo.pageSize,
      pageIndex: this.userTableInfo.pageIndex
    };
    this.apiService.postJSON(uri, param).subscribe(rest => {
      if (rest.success) {
        this.userTableInfo.data = [...rest.result.list];
        this.userTableInfo.total = rest.result.total;
      }
      this.userTableInfo.loading = false;
    }, error => {
      this.userTableInfo.loading = false;
    });
  }


}
