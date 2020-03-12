import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChildren } from '@angular/core';
import { EmailTemplate } from '../../../../domain';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../../../../uilib/services';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-email-template-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class EmailTemplateTableComponent implements OnInit {

  dataList: EmailTemplate[] = [];
  tmpList: EmailTemplate[] = [];
  _operatingFlag: boolean = false;

  @Output()
  onEdit = new EventEmitter();

  @Output()
  onCreate = new EventEmitter();

  @Input() reload: Subject<boolean>;

  searchForm: FormGroup;
  controlNameList = ['title'];
  pageSize: number = 20;
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

    const uri = 'appbiz/masterdataEmailTemplate/queryByParameter';//Email Template 不分页
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
          this.dataList = [...res.result];
          console.log('dataList', this.dataList);
          // this.doSearch();
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

  edit(item: EmailTemplate) {
    this.onEdit.emit(item);
  }

  create(e) {
    e.preventDefault();
    this.onCreate.emit();
  }

  toggle(item, flag?: string) {
    console.log('toggle', item);
    const uri = 'appbiz/masterdataEmailTemplate/save';
    let data = {
      id: item.id,
      active: !item.active
    };


    if (flag && 'delete' === flag) {
      this.pageIndex = 1;
      data['teamName'] = item.teamName + '(deleted: ' + Date.now() + ')';
      data['active'] = item.active;
      data['deleted'] = true;
    }
    console.log('toggle', data);
    this.apiService.postJSON(uri, data).subscribe(res => {
      if (res && res.success) {
        this.msg.success('Done.');
        this.loadTable();
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

}
