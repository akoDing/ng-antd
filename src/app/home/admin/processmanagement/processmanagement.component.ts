import {Component, OnInit, ViewChild} from '@angular/core';
import {TabRouter} from '../../../uilib/components/tab-router/model/tabRouter';


@Component({
  selector: 'app-processmanagement',
  templateUrl: './processmanagement.component.html',
  styleUrls: ['./processmanagement.component.less']
})
export class ProcessmanagementComponent implements OnInit {
  @ViewChild('processInstanceList', {static: true}) processInstanceList;
  @ViewChild('processTemplateList', {static: true}) processTemplateList;
  @ViewChild('taskList',{static:true}) taskList;

  tabs: TabRouter[];

  index: number = 0;


  constructor() {
  }

  ngOnInit(): void {
    this.tabs = [
      {
        title: 'frontend.process.title',
        closeable: false,
        template: this.processInstanceList
      },
      {
        title: 'frontend.processtemplate.title',
        closeable: false,
        template: this.processTemplateList
      },
      {
        title: 'frontend.task.title',
        closeable: false,
        template: this.taskList
      }
    ];
  }

  closeTab(index) {
    this.tabs.splice(index, 1);
    this.index = 0;
  }

  closeTabAndReload(index, event) {
    this.closeTab(index);
  }

}
