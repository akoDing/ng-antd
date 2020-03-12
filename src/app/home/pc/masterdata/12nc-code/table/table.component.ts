import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs';
import {NzMessageService, NzI18nService} from 'ng-zorro-antd';
import {ApiService} from '../../../../../uilib/services';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {TableInfo} from '../../../../../uilib/components/list-table/list-table';
import {DatePipe} from '@angular/common';
import {Data} from '@angular/router';

@Component({
  selector: 'app-12nc-code-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class M12ncCodeTableComponent implements OnInit {


  @Output()
  onEdit = new EventEmitter();

  @Output()
  onSave = new EventEmitter();

  @Output()
  onDelete = new EventEmitter();

  @Output()
  onCreate = new EventEmitter();

  @Input() reload: Subject<boolean>;

  searchForm: FormGroup;
  searchData: any = {};
  controlNameList: string[] = ['m12ncCode', 'description'];

  m12ncTableInfo: TableInfo = {
    pageIndex: 1,
    pageSize: 15,
    showPaging: true,
    frontPaging: false,
    total: 0,
    data: [],
    loading: false,
    isEmptyTableVisible: true,
    dataColumns: [
      {
        key: 'm12ncCode',
        label: 'frontend.m12nc.m12ncCode'
      }, {
        key: 'description',
        label: 'frontend.m12nc.description'
      }, {
        key: 'mag',
        label: 'frontend.m12nc.mag'
      }, {
        key: 'productHierarchy',
        label: 'frontend.m12nc.productHierarchy'
      }, {
        key: 'thirdParty',
        label: 'frontend.m12nc.thirdParty',
        translate: true,
        formatContent: (data) => {
          return `backend.${data}`;
        }
      }, {
        key: 'remarks',
        label: 'frontend.m12nc.remarks'
      }
    ],
    buttonColumn: {
      label: 'frontend.thAction',
      buttons: [
        {
          label: 'frontend.edit',
          event: (data) => {
            this.onEdit.emit(data);
          },
          icon: 'edit',
          isVisible: () => {
            return true;
          }
        }, {
          label: 'frontend.delete',
          confirm: true,
          confirmTitle: 'frontend.confirmDelete',
          event: (data) => {
            this.onDelete.emit(data);
          },
          icon: 'user-delete',
          isVisible: () => {
            return true;
          }
        }
      ]
    }
  };


  constructor(
    private apiService: ApiService,
    private msg: NzMessageService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private nzI18nService:NzI18nService) {
    this.searchForm = this.fb.group({});
    for (let item of this.controlNameList) {
      this.searchForm.addControl(item, new FormControl());
    }
    this.loadTable();
  }

  ngOnInit() {
    this.reload.subscribe(res => {
      if (res === true) {
        this.loadTable();
      }
    });
  }


  onChangePage(event) {
    console.log(event);
    this.loadTable();
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
    this.loadTable();
  }

  create(e) {
    e.preventDefault();
    this.onCreate.emit();
  }

  loadTable() {
    const uri = 'appbiz/masterdata12ncCode/pageQueryByParameter';
    const param = {
      advQuery: {
        deleted: false,
        ...this.searchData
      },
      pageSize: this.m12ncTableInfo.pageSize,
      pageIndex: this.m12ncTableInfo.pageIndex
    };

    this.apiService.postJSON(uri, param).subscribe(rest => {
      if (rest.success) {
        this.m12ncTableInfo.data = [...rest.result.list];
        this.m12ncTableInfo.total = rest.result.total;
      }
      this.m12ncTableInfo.loading = false;
    }, error => {
      this.m12ncTableInfo.loading = false;
    });
  }

}
