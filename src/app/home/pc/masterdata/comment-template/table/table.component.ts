import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommentTemplate } from '../../../../domain';
import { MockService } from '../../../../services/common';
import { Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../../../../uilib/services'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-comment-template-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class CommentTemplateTableComponent implements OnInit {

  dataList: CommentTemplate[] = [];
  tmpList: CommentTemplate[] = [];
  _operatingFlag: boolean = false;

  @Output()
  onEdit = new EventEmitter();

  @Output()
  onCreate = new EventEmitter();

  @Input() reload: Subject<boolean>

  searchForm: FormGroup;
  controlNameList = ['name'];
  pageSize: number = 15;
  pageIndex: number = 1;

  constructor(
    private apiService: ApiService, 
    private msg: NzMessageService,
    private translateService: TranslateService) {
    this.loadTable();
  }

  ngOnInit() {
    this.reload.subscribe(res => {
      console.log('reload menu data', res);
      if (res === true) {
        this.loadTable();
      }
    });
    
  }

  loadTable(pageNumber?: number){
    // this.loadFakeData();
    const uri = 'appbiz/masterdataCommentTemplate/queryByParameter';//comment template 不分页
    const param = {
      'advQuery': {
        'deleted': 0
      },
      'sorter' : 'orderIndex'
    };
    this._operatingFlag = true;
    this.apiService.callApi(this.apiService.postJSON(uri, param),
      (res: any) => {
        console.log(res);
        if (res && res.success) {
          console.log('success');
          this.tmpList = [...res.result];
          this.dataList = [...res.result];
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

  toggle(item, flag?: string) {
    console.log('toggle', item);
    let currentPage = this.pageIndex;
    const uri = 'appbiz/masterdataCommentTemplate/save';
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

  remove(item) { // 逻辑删除
    this.toggle(item, 'delete');
  }

  delete(item) {
    const className = 'com.philips.ps.entity.MasterdataCommentTemplate';
    const uri = 'appbiz/i18n/remove/' + className + ':' + item.id;
    this.apiService.delete(uri).subscribe(res =>{
      if (res && res.success) {
        this.msg.success('Done.');
        this.translateService.reloadLang(this.translateService.currentLang || 'zh');
        this.loadTable(1);
      } else {
        this.msg.error('action failed.');
      }
    }, err => {
      this.msg.error('action failed.');
      console.log(err);
    });
    

  }


  edit(item: CommentTemplate) {
    this.onEdit.emit(item);
  }

  create() {
    this.onCreate.emit();
  }

  doSearch() {
    console.log('do search');
  }

  ngOnDestroy(): void {
    console.log('list instance destroyed!');
    this.reload.unsubscribe();
  }

}
