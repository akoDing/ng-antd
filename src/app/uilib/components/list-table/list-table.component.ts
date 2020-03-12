import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableInfo} from './list-table';

@Component({
  selector: 'app-list-table',
  templateUrl: 'list-table.component.html'
})

export class ListTableComponent implements OnInit {

  @Input()
  tableInfo: TableInfo;


  @Output()
  private pageChange = new EventEmitter();

  constructor() {
  }

  pageIndexChange(number) {
    this.tableInfo.pageIndex = number;
    this.pageChange.emit({
      pageIndex: this.tableInfo.pageIndex,
      pageSize: this.tableInfo.pageSize
    });
  }

  pageSizeChange(number) {
    this.tableInfo.pageSize = number;
    this.pageChange.emit({
      pageIndex: this.tableInfo.pageIndex,
      pageSize: this.tableInfo.pageSize
    });
  }

  formatContent(data, head): string {
    if (data[head.key] != undefined) {
      return head.formatContent ? head.formatContent(data[head.key]) : data[head.key];
    } else {
      return head.formatWhenEmpty ? head.formatWhenEmpty(data[head.key]) : '';
    }
  }

  isButtonsVisible() {
    return this.tableInfo.buttonColumn && this.tableInfo.buttonColumn.buttons && this.tableInfo.buttonColumn.buttons.length > 0;
  }

  ngOnInit(): void {
  }
}
