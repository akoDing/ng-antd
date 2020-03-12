import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs';
import {NzMessageService, NzI18nService} from 'ng-zorro-antd';
import {ApiService} from '../../../../../uilib/services';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {TableInfo} from '../../../../../uilib/components/list-table/list-table';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-cost-info-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class CostInfoTableComponent implements OnInit {


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
  controlNameList = ['name_like'];

  costTableInfo: TableInfo = {
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
        key: 'name',
        label: 'frontend.cost.name',
      }, {
        key: 'priceCn',
        label: 'frontend.cost.priceCn'
      }, {
        key: 'unit',
        label: 'frontend.cost.unit'
      }, {
        key: 'insertUser',
        label: 'frontend.insertUser'
      }, {
        key: 'updateTime',
        label: 'frontend.updateTime',
        formatContent: (data) => {
          return new DatePipe(this.nzI18nService.getLocaleId()).transform(data, 'yyyy-MM-dd HH:mm:ss');
        }
      }, {
        key: 'active',
        label: 'frontend.active',
        formatContent: (data) => {
          return data ? "Y" : "N";
        }
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
        },
        {
          label: 'frontend.toggleActive',
          event: (data) => {
            this.onSave.emit(data);
          },
          icon: 'swap',
          isVisible: () => {
            return true;
          }
        },
        {
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
    const uri = 'appbiz/masterdataCostInfo/pageQueryByParameter';
    const param = {
      advQuery: {
        deleted: false,
        ...this.searchData
      },
      pageSize: this.costTableInfo.pageSize,
      pageIndex: this.costTableInfo.pageIndex
    };

    this.apiService.postJSON(uri, param).subscribe(rest => {
      if (rest.success) {
        this.costTableInfo.data = [...rest.result.list];
        this.costTableInfo.total = rest.result.total;
      }
      this.costTableInfo.loading = false;
    }, error => {
      this.costTableInfo.loading = false;
    });
  }

}
