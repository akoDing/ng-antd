import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChildren } from '@angular/core';
import { ApprovalConfig } from '../../../../domain';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../../../../uilib/services';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-approval-config-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class ApprovalConfigTableComponent implements OnInit {

  dataList: ApprovalConfig[] = [];
  tmpList: ApprovalConfig[] = [];
  _operatingFlag: boolean = false;

  @Output()
  onEdit = new EventEmitter();

  @Output()
  onCreate = new EventEmitter();

  @Input() reload: Subject<boolean>;

  searchForm: FormGroup;
  controlNameList = ['approvalName'];
  pageSize: number = 10;
  pageIndex: number = 1;

  constructor(private fb: FormBuilder, private apiService: ApiService, private msg: NzMessageService) {
    this.searchForm = this.fb.group({});
    for (let item of this.controlNameList) {
      this.searchForm.addControl(item, new FormControl())
    }
    this.loadTable();

  }

  ngOnInit() {
    this.reload.subscribe(res => {
      console.log('reload data', res);
      if (res === true) {
        this.loadTable();
      }
    });
  }

  loadTable(pageNumber?: number) {
    // this.loadFakeData();
    const uri = 'appbiz/masterdataApprovalConfig/queryByParameter';//Approval Config 不分页
    const param = {
      'advQuery': {
        'deleted': 0
      },
    };

    this._operatingFlag = true;
    this.apiService.callApi(this.apiService.postJSON(uri, param),
      (res: any) => {
        console.log(res);
        if (res && res.success) {
          console.log('success');
          this.tmpList = [...res.result];
          // this.dataList = [...res.result];
          this.doSearch();
          if (pageNumber) {
            this.pageIndex = pageNumber;
          }
        } else {
          console.log('failed', res);
        }
        this._operatingFlag = false;
      }, (res: any) => {
        this._operatingFlag = false;
      }
    );

  }

  edit(item: ApprovalConfig) {
    this.onEdit.emit(item);
  }

  create(e) {
    e.preventDefault();
    this.onCreate.emit();
  }

  doSearch(e?) {
    if (e) {
      e.preventDefault();
    }
    let filterRows = this.tmpList;
    for (let key in this.searchForm.controls) {
      const currentFiltername = key;
      const userInput = this.searchForm.controls[key].value ? this.searchForm.controls[key].value.toLowerCase() : null;

      filterRows = filterRows.filter(item => {
        if (!item[currentFiltername]) {
          return false;
        } else return item[currentFiltername].toLowerCase().indexOf(userInput) !== -1 || !userInput;
      });
    }

    // update the rows
    this.dataList = filterRows;

    // Whenever the filter changes, always go back to the first page
    this.pageIndex = 1;
  }

  toggle(item, flag?: string) {
    console.log('toggle', item);
    let currentPage = this.pageIndex;
    const uri = 'appbiz/masterdataApprovalConfig/save';
    let data = {
      id: item.id,
      active: !item.active
    };
    if (flag && 'delete' === flag) {
      currentPage = 1;
      data['active'] = item.active;
      data['deleted'] = true;
    }
    console.log('toggle', data);
    this.apiService.postJSON(uri, data).subscribe(res => {
      if (res && res.success) {
        this.msg.success('Done.');
        this.loadTable(currentPage);
      } else {
        this.msg.error('action failed.');
      }
    }, err => {
      this.msg.error('action failed.');
      console.log(err);
    });
  }

  remove(item) {
    this.toggle(item, 'delete');
  }

  doReset(e) {
    e.preventDefault();
    this.searchForm.reset();
  }

  ngOnDestroy(): void {
    console.log('list instance destroyed!');
    this.reload.unsubscribe();
  }

}
