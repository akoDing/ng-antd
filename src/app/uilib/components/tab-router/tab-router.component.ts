import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter
} from '@angular/core';
import {TabRouter} from './model/tabRouter';

@Component({
  selector: 'app-tab-router',
  template: `
    <nz-tabset [nzSelectedIndex]="index">
      <nz-tab *ngFor="let tab of tabs; let currentIndex = index" [nzTitle]="titleTemplate">
        <ng-template #titleTemplate>
          <div>
            <i nz-icon [type]="tab.icon"></i>
            {{ tab.title | translate}}{{tab.titleAppend}}
            <i *ngIf="tab.closeable" nz-icon type="close" class="ant-tabs-close-x" (click)="closeTab(currentIndex)"></i>
          </div>
        </ng-template>
        <app-tab-dynamic-content [tab]="tab"></app-tab-dynamic-content>
      </nz-tab>
    </nz-tabset>
  `
})
export class TabRouterComponent implements OnInit {

  @Input()
  tabs: TabRouter[] = [];

  @Input()
  index: number;

  @Output()
  onCloseTab = new EventEmitter();


  constructor() {

  }

  closeTab(currentIndex: number): void {
    this.onCloseTab.emit(currentIndex);
  }

  ngOnInit(): void {
  }

}
