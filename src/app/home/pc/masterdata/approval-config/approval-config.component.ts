import { Component, OnInit, ViewChild } from '@angular/core';
import { TabRouter } from '../../../../uilib/components/tab-router/model/tabRouter';
import { ApprovalConfigTableComponent } from './table/table.component';
import { ApprovalConfigDetailComponent } from './detail/detail.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-approval-config',
  templateUrl: './approval-config.component.html',
  styleUrls: ['./approval-config.component.less']
})
export class ApprovalConfigComponent implements OnInit {

  @ViewChild('table', { static: true }) table: ApprovalConfigTableComponent;
  @ViewChild('detail', { static: true }) detail: ApprovalConfigDetailComponent;

  tabs: TabRouter[];
  index: number = 0;
  reload: Subject<boolean> = new Subject();

  constructor() { }

  ngOnInit() {
    this.tabs = [
      {
        title: 'frontend.tabApprovalConfig',
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
      attribute: { approvalConfig: {} },
      icon: 'plus'
    });
    this.index = this.tabs.length - 1;
  }

  edit(event) {
    this.tabs.push({
      title: `frontend.edit`,
      titleAppend: ` ${event.approvalName}`,
      closeable: true,
      template: this.detail,
      attribute: { approvalConfig: event },
      icon: 'edit'
    });
    this.index = this.tabs.length - 1;
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
