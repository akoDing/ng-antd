import { Component, OnInit, ViewChild } from '@angular/core';
import { TabRouter } from '../../../uilib/components/tab-router/model/tabRouter';
import { EnumTableComponent } from './table/table.component';
import { EnumDetailComponent } from './detail/detail.component';
import { ApiService } from '../../../uilib/services';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-enummanagement',
  templateUrl: './enummanagement.component.html',
  styleUrls: ['./enummanagement.component.less']
})
export class EnummanagementComponent implements OnInit {

  @ViewChild('table', { static: true }) table: EnumTableComponent;
  @ViewChild('detail', { static: true }) detail: EnumDetailComponent;

  tabs: TabRouter[];
  index: number = 0;
  reload: Subject<boolean> = new Subject();

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.tabs = [
      {
        title: 'frontend.tabEnumManagement',
        closeable: false,
        template: this.table
      }
    ];
  }

  create() {
    this.tabs.push({
      title: `frontend.createEnumRoot`,
      closeable: true,
      template: this.detail,
      attribute: { enumEntity: {} },
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
      // titleAppend: ` ${event.costCenterName}`,
      closeable: true,
      template: this.detail,
      attribute: { enumEntity: event, i18nList: i18nList },
      icon: 'edit'
    });
    this.index = this.tabs.length - 1;
  }

  insert(event) {
    this.tabs.push({
      title: `frontend.createEnumChild`,
      closeable: true,
      template: this.detail,
      attribute: { enumEntity: { parentKey: event.id }, parentName: event.name },
      icon: 'plus'
    });
    this.index = this.tabs.length - 1;
  }

  async getI18nList(id: string, code: string) {

    const uri = 'appbiz/i18n/listByCode';
    const oid = 'net.mopos.admin.entity.EnumEntity' + ':' + id;
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
    if (event) {
      this.reload.next(true);
    }
  }

}
