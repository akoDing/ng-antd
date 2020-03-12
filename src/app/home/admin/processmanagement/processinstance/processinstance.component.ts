import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ApiService} from '../../../../uilib/services';
import {DatePipe} from '@angular/common';
import {TableInfo} from '../../../../uilib/components/list-table/list-table';
import {NzI18nService} from 'ng-zorro-antd';


@Component({
  selector: 'app-processinstancelist',
  templateUrl: './processinstance.component.html',
  styleUrls: ['./processinstance.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessinstanceComponent implements OnInit {


  searchForm: FormGroup;
  searchData: any = {};
  processList: any[] = [];
  controlNameList: string[] = [
    'businessName',
    'businessNumber',
    'processName',
    'owner'
  ];

  constructor(private api: ApiService,
              private message: NzMessageService,
              private fb: FormBuilder,
              private nzI18nService: NzI18nService) {

  }


  ngOnInit(): void {
    this.searchForm = this.fb.group({});
    for (let item of this.controlNameList) {
      this.searchForm.addControl(item, new FormControl());
    }
    this.api.getJson('appbiz/model/listAll').subscribe(res => {
      if (res.success) {
        this.processList = res.result;
      }
    });
    this.loadTable();
  }

  processInstanceTableInfo: TableInfo = {
    pageIndex: 1,
    pageSize: 15,
    total: 0,
    data: [],
    loading: false,
    isEmptyTableVisible: true,
    dataColumns: [
      {
        key: 'processInstanceId',
        label: 'frontend.process.instanceId'
      }, {
        key: 'businessNumber',
        label: 'frontend.process.businessNumber'
      }, {
        key: 'businessName',
        label: 'frontend.process.businessName'
      }, {
        key: 'name',
        label: 'frontend.process.name'
      }, {
        key: 'ownerName',
        label: 'frontend.process.owner'
      }, {
        key: 'startDateTime',
        label: 'frontend.process.startDateTime',
        formatContent: (data) => {
          return new DatePipe(this.nzI18nService.getLocaleId()).transform(data, 'yyyy-MM-dd HH:mm:ss');
        }
      }, {
        key: 'finishedDateTime',
        label: 'frontend.process.finishedDateTime',
        formatContent: (data) => {
          return new DatePipe(this.nzI18nService.getLocaleId()).transform(data, 'yyyy-MM-dd HH:mm:ss');
        }
      }, {
        key: 'state',
        label: 'frontend.process.state',
        formatContent: (data) => {
          switch (data) {
            case 'finished':
              return 'frontend.process.finished';
            case 'suspended':
              return 'frontend.process.suspended';
            case 'running':
              return 'frontend.process.running';
            default:
              return 'frontend.process.running';
          }
        }
      }
    ],
    buttonColumn: {
      label: 'frontend.thAction',
      buttons: [
        {
          label: 'frontend.pause',
          event: (data) => {
            this.suspendedSelected(data);
          },
          icon: 'pause',
          confirm: true,
          confirmTitle: 'frontend.confirmPause',
          isVisible: (data) => {
            return data.state == 'suspended';
          }
        },
        {
          label: 'frontend.start',
          confirm: true,
          confirmTitle: 'frontend.confirmStart',
          event: (data) => {
            this.runningSelected(data);
          },
          icon: 'play-square',
          isVisible: (data) => {
            return data.state == 'running';
          }
        },
        {
          label: 'frontend.delete',
          confirm: true,
          confirmTitle: 'frontend.confirmDelete',
          event: (data) => {
            this.removeSelected(data);
          },
          icon: 'user-delete',
          isVisible: () => {
            return true;
          }
        }
      ]
    }
  };

  suspendedSelected = (row) => {
    this.api.get(`appbiz/task/suspendProcessInstance/${row.processInstanceId}`).subscribe(res => {
      if (res.success) {
        this.message.success('暂停成功！');
        this.loadTable();
      } else {
        this.message.error(res.result);
      }
    });
  };

  runningSelected = (row) => {
    this.api.get(`appbiz/task/startProcessInstance/${row.processInstanceId}`).subscribe(res => {
      if (res.success) {
        this.message.success('运行成功！');
        this.loadTable();
      } else {
        this.message.error(res.result);
      }
    });
  };


  removeSelected = (row) => {
    this.api.delete(`appbiz/task/processInstance/${row.processInstanceId}`).subscribe(res => {
      if (res.success) {
        this.message.success('移除成功！');
        this.loadTable();
      } else {
        this.message.error(res.result);
      }
    });
  };

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
    const uri = 'appbiz/process/listAll';
    const param = {
      ...this.searchData,
      pageSize: this.processInstanceTableInfo.pageSize,
      pageIndex: this.processInstanceTableInfo.pageIndex
    };
    this.api.postJSON(uri, param).subscribe(rest => {
      if (rest.success) {
        this.processInstanceTableInfo.data = [...rest.result.list];
        this.processInstanceTableInfo.total = rest.result.total;
      }
      this.processInstanceTableInfo.loading = false;
    }, error => {
      this.processInstanceTableInfo.loading = false;
    });
  }

  onChangePage() {
    this.loadTable();
  }

}
