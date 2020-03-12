import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {ApiService} from '../../../../uilib/services/api.service';
import {TableInfo} from '../../../../uilib/components/list-table/list-table';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-rolelist',
  templateUrl: './rolelist.component.html',
  styleUrls: ['./rolelist.component.less']
})
export class RolelistComponent implements OnInit {

  @Output()
  onDisable = new EventEmitter();

  @Output()
  onView = new EventEmitter();

  @Output()
  onEdit = new EventEmitter();

  @Output()
  onCreate = new EventEmitter();


  searchForm: FormGroup;

  searchData: any = {};

  controlNameList: string[] = ['name', 'displayName'];

  @Input()
  reload: Subject<boolean>;

  roleTableInfo: TableInfo = {
    pageIndex: 1,
    pageSize: 15,
    total: 0,
    data: [],
    loading: false,
    isEmptyTableVisible: true,
    dataColumns: [
      {
        key: 'name',
        label: 'frontend.role.name'
      }, {
        key: 'displayName',
        label: 'frontend.role.displayName'
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

  create(e) {
    e.preventDefault();
    this.onCreate.emit();
  }


  loadTable() {
    const uri = 'appbiz/role/findAll';
    const param = {
      advQuery: {
        ...this.searchData
      },
      pageSize: this.roleTableInfo.pageSize,
      pageIndex: this.roleTableInfo.pageIndex
    };
    this.apiService.postJSON(uri, param).subscribe(rest => {
      if (rest.success) {
        this.roleTableInfo.data = [...rest.result.list];
        this.roleTableInfo.total = rest.result.total;
      }
      this.roleTableInfo.loading = false;
    }, error => {
      this.roleTableInfo.loading = false;
    });
  }

}
