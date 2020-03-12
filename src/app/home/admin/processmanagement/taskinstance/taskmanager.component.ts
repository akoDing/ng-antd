import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../../../../uilib/services';
import {NzMessageService} from 'ng-zorro-antd';
import {DatePipe} from '@angular/common';
import {TableInfo} from '../../../../uilib/components/list-table/list-table';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-tasklist',
  templateUrl: './taskmanager.component.html',
  styleUrls: ['./taskmanager.component.scss']
})
export class TaskmanagerComponent implements OnInit {

  processList: any[] = [];
  selectedAssignee: any;
  searchForm: FormGroup;
  searchData: any = {};
  controlNameList: string[] = [
    'taskName',
    'businessName',
    'businessNumber',
    'processName',
    'owner',
    'createTimeStart',
    'createTimeEnd',
    'finishedTimeStart',
    'finishedTimeEnd',
    'assignee'
  ];
  taskTableInfo: TableInfo = {
    pageIndex: 1,
    pageSize: 15,
    total: 0,
    data: [],
    loading: false,
    isEmptyTableVisible: true,
    dataColumns: [
      {
        key: 'id',
        label: 'frontend.task.id'
      }, {
        key: 'name',
        label: 'frontend.task.name'
      }, {
        key: 'businessNumber',
        label: 'frontend.process.businessNumber'
      }, {
        key: 'businessName',
        label: 'frontend.process.businessName'
      }, {
        key: 'processDefinitionName',
        label: 'frontend.process.name'
      }, {
        key: 'owner',
        label: 'frontend.process.owner'
      }, {
        key: 'assigneeName',
        label: 'frontend.task.assignee'
      }, {
        key: 'createTime',
        label: 'frontend.task.createTime',
        formatContent: (data) => {
          return new DatePipe(this.nzI18nService.getLocaleId()).transform(data, 'yyyy-MM-dd HH:mm:ss');
        }
      }, {
        key: 'endTime',
        label: 'frontend.task.endTime',
        formatContent: (data) => {
          return new DatePipe(this.nzI18nService.getLocaleId()).transform(data, 'yyyy-MM-dd HH:mm:ss');
        }
      }
    ],
    buttonColumn: {
      label: 'frontend.thAction',
      buttons: [
        {
          label: 'frontend.task.reassign',
          event: (data) => {

          },
          icon: 'pause',
          confirm: true,
          confirmTitle: 'frontend.confirmPause',
          isVisible: (data) => {
            return !data.endTime;
          }
        }
      ]
    }
  };

  constructor(private api: ApiService,
              private msg: NzMessageService,
              private fb: FormBuilder,
              private nzI18nService: NzI18nService) {
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({});
    for (let item of this.controlNameList) {
      this.searchForm.addControl(item, new FormControl());
    }
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
    const uri = 'appbiz/task/listAll';
    const param = {
      ...this.searchData,
      pageSize: this.taskTableInfo.pageSize,
      pageIndex: this.taskTableInfo.pageIndex
    };
    this.api.postJSON(uri, param).subscribe(rest => {
      if (rest.success) {
        this.taskTableInfo.data = [...rest.result.list];
        this.taskTableInfo.total = rest.result.total;
      }
      this.taskTableInfo.loading = false;
    }, error => {
      this.taskTableInfo.loading = false;
    });
  }

  onChangePage() {
    this.loadTable();
  }


}
