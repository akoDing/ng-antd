import {Component, OnInit, ViewChild} from '@angular/core';
import {TabRouter} from '../../../../uilib/components/tab-router/model/tabRouter';
import {Subject} from 'rxjs';
import {FunnelTableComponent} from './table/table.component';
import {FunnelFormComponent} from '../funnel-form/funnelform.component';

@Component({
  selector: 'app-funnel-list',
  templateUrl: './funnel-list.component.html'
})
export class FunnelListComponent implements OnInit {

  @ViewChild('table', {static: true}) table: FunnelTableComponent;
  @ViewChild('detail', {static: true}) detail: FunnelFormComponent;

  tabs: TabRouter[];
  index: number = 0;
  reload: Subject<boolean> = new Subject();

  constructor() {
  }

  ngOnInit() {
    this.tabs = [
      {
        title: 'frontend.funnel.list',
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
      attribute: {funnel: {}, basicReadOnly: false , priceReadOnly: false},
      icon: 'plus'
    });
    this.index = this.tabs.length - 1;
  }

  edit($event) {
    this.tabs.push({
      title: `frontend.edit`,
      titleAppend: ` (${$event.opportunityNo})`,
      closeable: true,
      template: this.detail,
      attribute: {funnel: $event, basicReadOnly: false , priceReadOnly: true},
      icon: 'edit'
    });
    this.index = this.tabs.length - 1;
  }

  launch($event) {
    this.tabs.push({
      title: `frontend.funnel.launch`,
      titleAppend: ` (${$event.opportunityNo})`,
      closeable: true,
      template: this.detail,
      attribute: {funnel: $event,  basicReadOnly: true , priceReadOnly: false},
      icon: 'play-circle'
    });
    this.index = this.tabs.length - 1;
  }

  view($event) {
    this.tabs.push({
      title: `frontend.view`,
      titleAppend: ` (${$event.opportunityNo})`,
      closeable: true,
      template: this.detail,
      attribute: {funnel: $event,  basicReadOnly: true , priceReadOnly: true},
      icon: 'eye'
    });
    this.index = this.tabs.length - 1;
  }

  remove($event) {

  }

  closeTab(idx) {
    this.tabs.splice(idx, 1);
    this.index = 0;
  }

  closeTabAndReload(idx, event) {
    this.closeTab(idx);
    if (event) {
      this.reload.next(true);
    }
  }

}
