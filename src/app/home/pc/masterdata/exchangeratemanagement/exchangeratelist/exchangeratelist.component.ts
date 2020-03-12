import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {ApiService} from '../../../../../uilib/services/api.service';
import {TableInfo} from '../../../../../uilib/components/list-table/list-table';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {NzI18nService} from 'ng-zorro-antd';
import {MasterdataExchangeRate} from '../../../../domain/exchangerate';
import {log, NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-exchangeratelist',
  templateUrl: './exchangeratelist.component.html',
  styleUrls: ['./exchangeratelist.component.less']
})
export class ExchangeratelistComponent implements OnInit {

  exchangerate: MasterdataExchangeRate;

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

  controlNameList: string[] = ['currency', 'exchangeRate', 'startTime', 'endTime', 'active', 'updateUser', 'updateTime'];

  temp: boolean;

  @Input()
  reload: Subject<boolean>;

  exchangerateTableInfo: TableInfo = {
    pageIndex: 1,
    pageSize: 50,
    showPaging: true,
    frontPaging: false,
    total: 0,
    data: [],
    loading: false,
    isEmptyTableVisible: true,
    dataColumns: [
      {
        key: 'currency',
        label: 'frontend.exchangerate.currency',
        translate: true,
        formatContent: (data) => {
          return `backend.${data}`;
        }
      }, {
        key: 'exchangeRate',
        label: 'frontend.exchangerate.exchange_rate'
      },
      {
        key: 'startTime',
        label: 'frontend.exchangerate.start_time',
        formatContent: (data) => {
          return new DatePipe(this.nzI18nService.getLocaleId()).transform(data, 'yyyy-MM-dd');
        }
      },
      {
        key: 'endTime',
        label: 'frontend.exchangerate.end_time',
        formatContent: (data) => {
          return new DatePipe(this.nzI18nService.getLocaleId()).transform(data, 'yyyy-MM-dd');
        }
      },
      {
        key: 'active',
        label: 'frontend.exchangerate.active',
        formatContent: (data) => {
          this.temp = data;
          return data ? "Y" : "N";
        },
      },
      {
        key: 'updateUser',
        label: 'frontend.exchangerate.update_user'
      },
      {
        key: 'updateTime',
        label: 'frontend.exchangerate.update_time',
        formatContent: (data) => {
          return new DatePipe(this.nzI18nService.getLocaleId()).transform(data, 'yyyy-MM-dd');
        }
      }
    ],
    buttonColumn: {
      label: 'frontend.thAction',
      buttons: [
        {
          label: 'frontend.view',
          event: (data) => {
            console.log(data);
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
            if (this.temp) {
              return false;
            }
            else {
              return true;
            }
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
              private fb: FormBuilder,
              private nzI18nService:NzI18nService,
              private msg: NzMessageService,
  ) {
    this.searchForm = this.fb.group({});
    for (let item of this.controlNameList) {
      this.searchForm.addControl(item, new FormControl());
    }
    this.loadTable();
  }

  onChangePage(event) {
    console.log(event);
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
      if (this.searchForm.controls[key].value != null) {
        console.log("2222222");
        console.log(this.searchForm.controls[key].value);
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

    const uri = 'appbiz/masterdataExchangeRate/pageQueryByParameter';
    const param = {
      advQuery: {
        ...this.searchData
      },
      pageSize: this.exchangerateTableInfo.pageSize,
      pageIndex: this.exchangerateTableInfo.pageIndex
    };

    this.apiService.postJSON(uri, param).subscribe(rest => {
      if (rest.success) {
        this.exchangerateTableInfo.data = [...rest.result.list];
        this.exchangerateTableInfo.total = rest.result.total;
        for (let entry of rest.result.list) {
          this.exchangerate = entry;
          console
          this.apiService.postJSON(`appbiz/masterdataExchangeRate/save`, {...this.exchangerate}).subscribe();
        }
      }
      this.exchangerateTableInfo.loading = false;
    }, error => {
      this.exchangerateTableInfo.loading = false;
    });
  }

}
