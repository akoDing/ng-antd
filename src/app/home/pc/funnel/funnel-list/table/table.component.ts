import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableInfo} from '../../../../../uilib/components/list-table/list-table';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../../../../uilib/services';
import {Subject} from 'rxjs';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-funnel-list-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class FunnelTableComponent implements OnInit {


  @Output()
  onDisable = new EventEmitter();

  @Output()
  onView = new EventEmitter();

  @Output()
  onEdit = new EventEmitter();

  @Output()
  onLaunch = new EventEmitter();

  @Output()
  onCreate = new EventEmitter();

  searchForm: FormGroup;

  searchData: any = {};

  controlNameList: string[] = ['opportunityNo'];

  @Input()
  reload: Subject<boolean>;

  funnelTableInfo: TableInfo = {
    pageIndex: 1,
    pageSize: 15,
    total: 0,
    data: [],
    loading: false,
    isEmptyTableVisible: true,
    dataColumns: [
      {
        key: 'opportunityNo',
        label: 'frontend.funnel.opportunityNo'
      }, {
        key: 'customerName',
        label: 'frontend.funnel.customerName'
      }, {
        key: 'solution',
        label: 'frontend.funnel.solution'
      }, {
        key: 'ownerName',
        label: 'frontend.funnel.owner'
      }, {
        key: '_12nc',
        label: 'frontend.funnel._12nc'
      }, {
        key: 'source',
        label: 'frontend.funnel.source'
      }, {
        key: 'updateTime',
        label: 'frontend.funnel.updateTime',
        formatContent: (data) => {
          return new DatePipe(this.nzI18nService.getLocaleId()).transform(data, 'yyyy-MM-dd HH:mm:ss');
        }
      }, {
        key: 'status',
        label: 'frontend.funnel.status',
        translate: true,
        formatContent: (data) => {
          return `frontend.funnel.${data}`;
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
          label: 'frontend.launch',
          event: (data) => {
            this.onLaunch.emit(data);
          },
          icon: 'play-circle',
          isVisible: (data) => {
            return data.status == 'READY' || data.status == 'DRAFT';
          }
        },
        {
          label: 'frontend.edit',
          event: (data) => {
            this.onEdit.emit(data);
          },
          icon: 'edit',
          isVisible: (data) => {
            return data.status == 'READY' || data.status == 'DRAFT';
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
          isVisible: (data) => {
            return data.status == 'READY' || data.status == 'DRAFT';
          }
        }
      ]
    }
  };

  constructor(private translateService: TranslateService,
              private apiService: ApiService,
              private fb: FormBuilder,
              private nzI18nService: NzI18nService
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

  create(e) {
    e.preventDefault();
    this.onCreate.emit();
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
    const uri = 'appbiz/funnel/pageQueryByParameter';
    const param = {
      advQuery: {
        ...this.searchData
      },
      pageSize: this.funnelTableInfo.pageSize,
      pageIndex: this.funnelTableInfo.pageIndex
    };
    this.apiService.postJSON(uri, param).subscribe(rest => {
      if (rest.success) {
        this.funnelTableInfo.data = [...rest.result.list];
        this.funnelTableInfo.total = rest.result.total;
      }
      this.funnelTableInfo.loading = false;
    }, error => {
      this.funnelTableInfo.loading = false;
    });
  }


}
