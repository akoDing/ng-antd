import { Component, OnInit, ViewChild } from '@angular/core';
import { TabRouter } from '../../../../uilib/components/tab-router/model/tabRouter';
import { CommentTemplateTableComponent } from './table/table.component';
import { CommentTemplateDetailComponent } from './detail/detail.component';
import { Subject } from 'rxjs';
import { ApiService } from '../../../../uilib/services';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-comment-template',
  templateUrl: './comment-template.component.html',
  styleUrls: ['./comment-template.component.less']
})
export class CommentTemplateComponent implements OnInit {

  @ViewChild('table', { static: true }) table: CommentTemplateTableComponent;
  @ViewChild('detail', { static: true }) detail: CommentTemplateDetailComponent;

  tabs: TabRouter[];
  index: number = 0;
  reload: Subject<boolean> = new Subject();

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.tabs = [
      {
        title: '快捷意见列表',
        closeable: false,
        template: this.table
      }
    ];
  }

  create() {
    this.tabs.push({
      title: `frontend.create`,
      closeable: true,
      template: this.detail,
      attribute: { commentTemplate: {}, i18nList:[] },
      icon: 'plus'
    });
    this.index = this.tabs.length - 1;
  }

  async edit(event) {

    let i18nList: any[] = [];
    const res = await this.getI18nList(event.id, event.name);
    if (res && res.success && res.result && res.result.length > 0) {
      i18nList = res.result;
    }
    


    this.tabs.push({
      title: `frontend.edit`,
      closeable: true,
      template: this.detail,
      attribute: { commentTemplate: event, i18nList: i18nList },
      icon: 'edit'
    });
    this.index = this.tabs.length - 1;
  }

  async getI18nList(id:string, code: string) {
    
    const uri = 'appbiz/i18n/listByCode';
    const oid = 'com.philips.ps.entity.MasterdataCommentTemplate' + ':' + id;
    const param = {
      code: code,
      oid: oid
    };
    return await this.apiService.postJSON(uri, param).toPromise();
  }

  closeTab(idx) {
    this.tabs.splice(idx, 1);
    this.index = 0;
  }

  closeTabAndReload(idx, event) {
    console.log('closeTabAndReload');
    this.closeTab(idx);
    if(event){
      this.reload.next(true);
    }
  }

}
