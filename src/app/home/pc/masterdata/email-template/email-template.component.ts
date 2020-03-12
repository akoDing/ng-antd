import { Component, OnInit, ViewChild } from '@angular/core';
import { TabRouter } from '../../../../uilib/components/tab-router/model/tabRouter';
import { EmailTemplateTableComponent } from './table/table.component';
import { EmailTemplateDetailComponent } from './detail/detail.component';
import { ApiService } from '../../../../uilib/services';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.less']
})
export class EmailTemplateComponent implements OnInit {

  @ViewChild('table', { static: true }) table: EmailTemplateTableComponent;
  @ViewChild('detail', { static: true }) detail: EmailTemplateDetailComponent;

  tabs: TabRouter[];
  index: number = 0;
  reload: Subject<boolean> = new Subject();

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.tabs = [
      {
        title: 'frontend.tabEmailTemplate',
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
      attribute: { emailTemplate: {} },
      icon: 'plus'
    });
    this.index = this.tabs.length - 1;
  }

  async edit(event) { // todo
    const raw = await this.getContent(event.id);
    const item = raw ? raw : {};
    this.tabs.push({
      title: `frontend.edit`,
      titleAppend: ` ${event.title}`,
      closeable: true,
      template: this.detail,
      attribute: { emailTemplate: item },
      icon: 'edit'
    });
    this.index = this.tabs.length - 1;
  }

  async getContent(id: string) {
    let result;
    const uri = 'appbiz/masterdataEmailTemplate/queryDetailById/' + id;
    let res = await this.apiService.get(uri).toPromise();
    if (res && res.success) {
      result = res.result;
    }
    return result;
  }

  closeTab(idx) {
    this.tabs.splice(idx, 1);
    this.index = 0;
  }

  closeTabAndReload(idx, event) {
    console.log('closeTabAndReload');
    this.closeTab(idx);
    if (event) {
      this.reload.next(true);
    }
  }

}
